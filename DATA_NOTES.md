# Data notes (Pair A)

Profile of the source files and how each anomaly is handled in `index.html` (the `kpi-lib` block, tested by `tests/kpi.test.js`).
Each treatment is a provisional choice to confirm with the team and the site.

## extrusion_shift_log.csv: 1,890 raw rows, 1,883 after cleaning

| Anomaly | Finding | Treatment | Question for the site |
|---|---|---|---|
| Exact duplicates | 7 identical repeated rows: 11 March, shift A, M01 to M07 | Removed (one occurrence kept) | Was shift A of 11 March imported twice? |
| kg instead of t | M06, shift B, 22, 23 and 24 Jan: output_t = 12,750 / 8,750 / 10,750 (physical max ≈ 18 t per shift at 2.3 t/h), same for scrap_t | Divided by 1,000 (threshold: output_t > 100). After correction, total extrusion output (21,922.9 t) matches `stage_daily` (21,923.4 t) | Who logs M06 on shift B, and did the form change on those days? |
| Missing shift | No rows for 17 Feb, shift C (7 machines) | Left as is; `stage_daily` shows 6,720 planned min that day (= 2 shifts), so the shift was not scheduled | Was there a planned stop on the night of 17 Feb? |
| planned_min = 0 | M03, 1 March, shifts A, B and C (run and output at 0) | Kept; no effect on sums; divisions protected (null instead of NaN) | Was M03 down for maintenance on 1 March? `stage_daily` shows 8,640 min that day, which is consistent |
| Stops > planned | M03, 31 March, shift C: 409 + 42 + 33 = 484 min for 480 planned, run_min = 0 | Kept as is | Did the 409-min changeover spill over into the next shift? |
| ideal_rate_tph | 2.3 t/h for all 7 lines, no variation | Used as is | Do all 7 lines really have the same nameplate rate, whatever the product? |

No missing values, no negative values.

## stage_daily.csv: 270 rows (90 days × 3 stages)

No duplicates, no missing values. planned_min = 10,080 (7 units × 24 h) except on 17 Feb (6,720) and 1 March (8,640), consistent with the extrusion log.

## Calculation choices

- Every ratio is aggregated as sums (never an average of ratios).
- Bottleneck = the stage with the fewest starved + blocked minutes: upstream blocks on it (mixing blocked 11.7%), downstream starves (packing starved 16.5%).
- Weeks run Monday to Sunday; the first (29 Dec, 4 days) and the last (30 March, 2 days) are partial and flagged as such.
