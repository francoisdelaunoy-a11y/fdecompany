// Tests de la bibliothèque KPI embarquée dans index.html (bloc <script id="kpi-lib">).
// Lancer : npm test (ou node --test)
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const src = html.match(/<script id="kpi-lib">([\s\S]*?)<\/script>/)[1];
const ctx = {};
vm.runInNewContext(src, { globalThis: ctx });
const K = ctx.PolymexKPI;

const row = (o) => ({ date: "2026-01-05", shift: "A", machine: "M01", planned_min: 480, changeovers: 0, changeover_min: 0,
  unplanned_downtime_min: 0, other_stop_min: 0, run_min: 480, output_t: 18.4, scrap_t: 0, ideal_rate_tph: 2.3, ...o });

test("TRS parfait = 100 %", () => {
  const r = K.oee([row()]);
  assert.equal(r.availability, 1);
  assert.ok(Math.abs(r.performance - 1) < 1e-12);
  assert.equal(r.quality, 1);
});

test("agrégation par sommes, pas par moyenne de ratios", () => {
  const r = K.oee([row({ run_min: 240, output_t: 9.2 }), row({ planned_min: 0, run_min: 0, output_t: 0 })]);
  assert.equal(r.availability, 0.5); // 240 / 480, et non moyenne(0,5 ; indéfini)
  const q = K.oee([row({ output_t: 10, scrap_t: 1 }), row({ output_t: 30, scrap_t: 1 })]);
  assert.equal(q.quality, 1 - 2 / 40);
});

test("division par zéro : aucune ligne planifiée ⇒ null, pas NaN", () => {
  const r = K.oee([row({ planned_min: 0, run_min: 0, output_t: 0 })]);
  assert.equal(r.availability, null);
  assert.equal(r.performance, null);
  assert.equal(r.quality, null);
  assert.equal(r.oee, null);
});

test("nettoyage : doublons exacts supprimés, kg convertis en tonnes", () => {
  const c = K.cleanShiftLog([row(), row(), row({ machine: "M06", output_t: 12750, scrap_t: 830 })]);
  assert.equal(c.rows.length, 2);
  assert.equal(c.duplicates.length, 1);
  assert.equal(c.rows[1].output_t, 12.75);
  assert.equal(c.rows[1].scrap_t, 0.83);
});

test("goulot = étape ni affamée ni bloquée", () => {
  const s = (stage, st, bl) => ({ date: "2026-01-05", stage, units: 7, planned_min: 10000, output_t: 1, starved_min: st, blocked_min: bl });
  const f = K.flow([s("mixing", 50, 1200), s("extrusion", 30, 20), s("packing", 1600, 30)]);
  assert.equal(f.bottleneck, "extrusion");
  assert.equal(f.stages[0].blockedPct, 0.12);
});

test("semaine ISO : le jeudi 1er janvier 2026 appartient à la semaine du lundi 29 décembre", () => {
  assert.equal(K.weekStart("2026-01-01"), "2025-12-29");
  assert.equal(K.weekStart("2026-03-29"), "2026-03-23");
});

test("données réelles : TRS usine et M07 recoupent le calcul de référence", () => {
  const read = (f) => K.parseCSV(fs.readFileSync(path.join(root, f), "utf8"));
  const c = K.cleanShiftLog(read("extrusion_shift_log.csv"));
  assert.equal(c.rows.length, 1883);
  assert.ok(Math.abs(K.oee(c.rows).oee - 0.5949) < 5e-4);
  assert.ok(Math.abs(K.oee(c.rows.filter((r) => r.machine === "M07")).oee - 0.5440) < 5e-4);
  assert.equal(K.flow(read("stage_daily.csv")).bottleneck, "extrusion");
});
