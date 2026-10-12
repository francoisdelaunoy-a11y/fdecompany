// Tests for the KPI library embedded in index.html (<script id="kpi-lib"> block).
// Run: npm test (or node --test)
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

test("perfect OEE = 100%", () => {
  const r = K.oee([row()]);
  assert.equal(r.availability, 1);
  assert.ok(Math.abs(r.performance - 1) < 1e-12);
  assert.equal(r.quality, 1);
});

test("aggregation as sums, not as an average of ratios", () => {
  const r = K.oee([row({ run_min: 240, output_t: 9.2 }), row({ planned_min: 0, run_min: 0, output_t: 0 })]);
  assert.equal(r.availability, 0.5); // 240 / 480, not mean(0.5, undefined)
  const q = K.oee([row({ output_t: 10, scrap_t: 1 }), row({ output_t: 30, scrap_t: 1 })]);
  assert.equal(q.quality, 1 - 2 / 40);
});

test("division by zero: nothing planned ⇒ null, not NaN", () => {
  const r = K.oee([row({ planned_min: 0, run_min: 0, output_t: 0 })]);
  assert.equal(r.availability, null);
  assert.equal(r.performance, null);
  assert.equal(r.quality, null);
  assert.equal(r.oee, null);
});

test("cleaning: exact duplicates removed, kg converted to tonnes", () => {
  const c = K.cleanShiftLog([row(), row(), row({ machine: "M06", output_t: 12750, scrap_t: 830 })]);
  assert.equal(c.rows.length, 2);
  assert.equal(c.duplicates.length, 1);
  assert.equal(c.rows[1].output_t, 12.75);
  assert.equal(c.rows[1].scrap_t, 0.83);
});

test("bottleneck = stage neither starved nor blocked", () => {
  const s = (stage, st, bl) => ({ date: "2026-01-05", stage, units: 7, planned_min: 10000, output_t: 1, starved_min: st, blocked_min: bl });
  const f = K.flow([s("mixing", 50, 1200), s("extrusion", 30, 20), s("packing", 1600, 30)]);
  assert.equal(f.bottleneck, "extrusion");
  assert.equal(f.stages[0].blockedPct, 0.12);
});

test("ISO week: Thursday 1 January 2026 belongs to the week of Monday 29 December", () => {
  assert.equal(K.weekStart("2026-01-01"), "2025-12-29");
  assert.equal(K.weekStart("2026-03-29"), "2026-03-23");
});

test("real data: plant and M07 OEE match the reference calculation", () => {
  const read = (f) => K.parseCSV(fs.readFileSync(path.join(root, f), "utf8"));
  const c = K.cleanShiftLog(read("extrusion_shift_log.csv"));
  assert.equal(c.rows.length, 1883);
  assert.ok(Math.abs(K.oee(c.rows).oee - 0.5949) < 5e-4);
  assert.ok(Math.abs(K.oee(c.rows.filter((r) => r.machine === "M07")).oee - 0.5440) < 5e-4);
  assert.equal(K.flow(read("stage_daily.csv")).bottleneck, "extrusion");
});

const P = { margin: 300, downtimeCost: 250, smedPct: 0.3, worstDownPct: 0.5, bottleneckPct: 0.5, scrapTarget: 0.04 };

test("impacts: lost minutes valued at the actual rate of good tonnes", () => {
  // 480 min planned, 240 running, 120 breakdowns, 120 changeovers, 6 t of which 0.6 t scrap.
  const r = row({ run_min: 240, unplanned_downtime_min: 120, changeovers: 2, changeover_min: 120, output_t: 6, scrap_t: 0.6 });
  const stage = (st, s, b) => ({ date: "2026-01-05", stage: st, units: 7, planned_min: 1000, output_t: 90, starved_min: s, blocked_min: b });
  const i = K.impacts([r], [stage("mixing", 0, 100), stage("extrusion", 0, 0), stage("packing", 200, 0)], P);
  const get = (id) => i.problems.find((x) => x.id === id);
  // Good rate = 5.4 t / 4 h = 1.35 t/h; 120 min ⇒ 2.7 t.
  assert.ok(Math.abs(get("downtime").tonnes - 2.7) < 1e-9);
  assert.ok(Math.abs(get("downtime").cost - (2.7 * 300 + 2 * 250)) < 1e-9);
  assert.ok(Math.abs(get("changeover").gainEur - 2.7 * 0.3 * 300 * 365) < 1e-6);
  // Scrap 10% → target 4%: 6 × 6% = 0.36 t recovered over 1 day.
  assert.ok(Math.abs(get("scrap").gainT - 0.36 * 365) < 1e-9);
  // Bottleneck: mixing blocked 100 min, rate 90 t / 900 min ⇒ 10 t.
  assert.equal(get("bottleneck").stage, "extrusion");
  assert.ok(Math.abs(get("bottleneck").tonnes - 10) < 1e-9);
  assert.equal(i.problems[0].id, "bottleneck");
});

test("impacts: no division by zero on empty or non-running data", () => {
  const i = K.impacts([row({ planned_min: 0, run_min: 0, output_t: 0 })], [], { ...P, scrapTarget: 0.5 });
  i.problems.forEach((x) => { assert.ok(Number.isFinite(x.tonnes)); assert.ok(Number.isFinite(x.gainEur)); });
  assert.equal(i.problems.find((x) => x.id === "scrap").gainT, 0);
});

test("diagnostics: scrap outlier line, scrap with / without changeover", () => {
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

test("diagnostics: cleaned real data", () => {
  const c = K.cleanShiftLog(K.parseCSV(fs.readFileSync(path.join(root, "extrusion_shift_log.csv"), "utf8")));
  const d = K.diagnostics(c.rows);
  assert.equal(d.plant.co, 800);
  assert.equal(d.scrapOutlier.key, "M04");
  assert.ok(Math.abs(d.scrapOutlier.scrapRate - 0.0695) < 5e-4);
});
