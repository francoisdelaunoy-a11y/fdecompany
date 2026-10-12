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

const P = { margin: 300, downtimeCost: 250, smedPct: 0.3, worstDownPct: 0.5, bottleneckPct: 0.5, scrapTarget: 0.04 };

test("impacts : minutes perdues valorisées au débit réel de tonnes bonnes", () => {
  // 480 min planifiées, 240 de marche, 120 de pannes, 120 de changements, 6 t dont 0,6 t de rebut.
  const r = row({ run_min: 240, unplanned_downtime_min: 120, changeovers: 2, changeover_min: 120, output_t: 6, scrap_t: 0.6 });
  const stage = (st, s, b) => ({ date: "2026-01-05", stage: st, units: 7, planned_min: 1000, output_t: 90, starved_min: s, blocked_min: b });
  const i = K.impacts([r], [stage("mixing", 0, 100), stage("extrusion", 0, 0), stage("packing", 200, 0)], P);
  const get = (id) => i.problems.find((x) => x.id === id);
  // Débit bon = 5,4 t / 4 h = 1,35 t/h ; 120 min ⇒ 2,7 t.
  assert.ok(Math.abs(get("downtime").tonnes - 2.7) < 1e-9);
  assert.ok(Math.abs(get("downtime").cost - (2.7 * 300 + 2 * 250)) < 1e-9);
  assert.ok(Math.abs(get("changeover").gainEur - 2.7 * 0.3 * 300 * 365) < 1e-6);
  // Rebut 10 % → cible 4 % : 6 × 6 % = 0,36 t récupérées sur 1 jour.
  assert.ok(Math.abs(get("scrap").gainT - 0.36 * 365) < 1e-9);
  // Goulot : mélange bloqué 100 min, débit 90 t / 900 min ⇒ 10 t.
  assert.equal(get("bottleneck").stage, "extrusion");
  assert.ok(Math.abs(get("bottleneck").tonnes - 10) < 1e-9);
  assert.equal(i.problems[0].id, "bottleneck");
});

test("impacts : aucune division par zéro sur des données vides ou sans marche", () => {
  const i = K.impacts([row({ planned_min: 0, run_min: 0, output_t: 0 })], [], { ...P, scrapTarget: 0.5 });
  i.problems.forEach((x) => { assert.ok(Number.isFinite(x.tonnes)); assert.ok(Number.isFinite(x.gainEur)); });
  assert.equal(i.problems.find((x) => x.id === "scrap").gainT, 0);
});

test("diagnostics : ligne hors norme en rebut, rebut avec / sans changement", () => {
  const rows = ["M01", "M02", "M03"].flatMap((m, i) => [
    row({ machine: m, output_t: 10, scrap_t: m === "M03" ? 1 : 0.6, changeovers: 1, changeover_min: 100 }),
    row({ machine: m, date: "2026-02-02", output_t: 10, scrap_t: 0.6 }),
  ]);
  const d = K.diagnostics(rows);
  assert.equal(d.scrapOutlier.key, "M03");
  assert.equal(d.scrapRange.machines.max, 0.06);
  assert.ok(Math.abs(d.scrapWithCo - 2.2 / 30) < 1e-12);
  assert.ok(Math.abs(d.scrapWithoutCo - 0.06) < 1e-12);
  assert.equal(d.minPerCoRange.machines.min, 100);
  assert.equal(d.months.map((m) => m.key).join(","), "2026-01,2026-02");
});

test("diagnostics : données réelles nettoyées", () => {
  const c = K.cleanShiftLog(K.parseCSV(fs.readFileSync(path.join(root, "extrusion_shift_log.csv"), "utf8")));
  const d = K.diagnostics(c.rows);
  assert.equal(d.plant.co, 800);
  assert.equal(d.scrapOutlier.key, "M04");
  assert.ok(Math.abs(d.scrapOutlier.scrapRate - 0.0695) < 5e-4);
});

// ---- Contrôle des données et familles MECE (onglet Problèmes & impact) ----
const readRaw = () => K.parseCSV(fs.readFileSync(path.join(root, "extrusion_shift_log.csv"), "utf8"));
const readStage = () => K.parseCSV(fs.readFileSync(path.join(root, "stage_daily.csv"), "utf8"));

test("contrôle : doublons exacts vs contradictoires, valeurs hors échelle", () => {
  const raw = [row(), row(), row({ machine: "M02" }), row({ machine: "M02", output_t: 10 }), row({ machine: "M06", output_t: 12750, scrap_t: 830 })];
  const c = K.dataControl(raw, K.cleanShiftLog(raw).rows, []);
  assert.equal(c.dupKeys.length, 2);
  assert.equal(c.exactDupKeys, 1);
  assert.equal(c.contradictoryDupKeys, 1); // non fusionné : les deux lignes M02 restent dans le retraité
  assert.equal(c.removedRows, 1);
  assert.equal(c.outOfScale.length, 1);
  assert.equal(c.stageExtrusionT, null);
  assert.equal(c.gapClean, null);
});

test("contrôle : bilan temps marche + arrêts vs planifié", () => {
  const b = K.timeBalance([row({ run_min: 0, changeover_min: 409, unplanned_downtime_min: 42, other_stop_min: 33 }), row()]);
  assert.equal(b.mismatches.length, 1);
  assert.equal(b.mismatches[0].stops, 484);
  assert.equal(b.mismatches[0].diff, 4);
  assert.equal(b.diff, 4);
});

test("contrôle : ratio > 100 % non plafonné, division par zéro ⇒ null", () => {
  const c = K.dataControl([row({ output_t: 36.8 })], [row()], []);
  assert.ok(Math.abs(c.raw.performance - 2) < 1e-12);
  assert.equal(c.overCapacity.raw, 1);
  assert.equal(c.overCapacity.clean, 0);
  const e = K.dataControl([], [], []);
  assert.equal(e.raw.performance, null);
  assert.equal(e.raw.oee, null);
  assert.equal(e.period.start, null);
  const f = K.meceFacts([], []);
  assert.equal(f.B1.share, null);
  assert.equal(f.B1.worst, null);
  assert.equal(f.C.grossRate, null);
  assert.equal(f.D.yield, null);
});

test("contrôle : données réelles brutes vs retraitées", () => {
  const raw = readRaw(), clean = K.cleanShiftLog(raw).rows;
  const c = K.dataControl(raw, clean, readStage());
  assert.equal(c.raw.n, 1890);
  assert.equal(c.clean.n, 1883);
  assert.equal(c.dupKeys.length, 7);
  assert.equal(c.contradictoryDupKeys, 0);
  assert.equal(c.outOfScale.length, 3);
  assert.ok(Math.abs(c.raw.output - 54217.7) < 0.05);
  assert.ok(Math.abs(c.stageExtrusionT - 21923.4) < 0.05);
  assert.ok(Math.abs(c.gapClean + 0.5) < 0.05);
  assert.ok(Math.abs(c.raw.performance - 2.128) < 5e-4);
  assert.equal(c.raw.co, 805);
  assert.equal(c.clean.co, 800);
  assert.equal(c.balanceRaw.mismatches.length, 1);
  assert.equal(c.balanceRaw.mismatches[0].stops, 484);
});

test("familles MECE : constats calculés au périmètre retraité", () => {
  const f = K.meceFacts(K.cleanShiftLog(readRaw()).rows, readStage());
  assert.equal(f.B1.worst.machine, "M02");
  assert.equal(f.B2.count, 800);
  assert.equal(f.D.outlier.machine, "M04");
  assert.equal(f.bottleneck, "extrusion");
  assert.ok(Math.abs(f.B3.mixingBlocked - 0.1165) < 5e-4);
  // L'identité de référence reconstitue les tonnes bonnes.
  const r = f.reference;
  assert.ok(Math.abs(r.plannedH * r.availability * r.grossRate * r.yield - r.goodT) < 1e-6);
});
