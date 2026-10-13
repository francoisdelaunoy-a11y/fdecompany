# Context for Claude Code

This repository is a Forward Deployed Engineering (FDE) practice used for AI transformation work with several brands and industrial clients.

## FDE method (applies to every engagement)

@.claude/skills/fde-basics/SKILL.md
@fde/PLAYBOOK.md

The FDE basics above are the reference doctrine: they take precedence over the playbook and the step skills if they disagree.

Skills: `/fde-basics` (doctrine), then one per step: `/fde-new-engagement`, `/fde-discovery`, `/fde-data-profile`, `/fde-kpi`, `/fde-impact`, `/fde-use-cases`, `/fde-demo`. New clients go in `engagements/<client>/`, created from `fde/templates/engagement/`, each with its own `CLAUDE.md`. Never mix data from one client into another client's work.

## Engagement: Polymex Industries (files at the repository root)

You are helping a team of Forward Deployed Engineers in training build "Plant Pulse", a one-page web app about Polymex Industries, a fictional plastics compounding plant. Read `README.md` for the brief and `DATA_DICTIONARY.md` for the data.

### Working rules

1. Profile the data before computing anything: row counts per date and shift, value ranges per column, exact duplicate rows, missing date and shift combinations, rows where planned_min is 0, and values that look like a different unit. Write what you find to `DATA_NOTES.md` and ask the team how to handle each anomaly before deciding silently.
2. Compute every KPI from the raw CSV files in code. Never hard-code a number in the interface.
3. Use these definitions, aggregated as sums (not as averages of ratios):
   - availability = sum(run_min) / sum(planned_min)
   - performance = sum(output_t) / sum(run_min / 60 * ideal_rate_tph)
   - quality = sum(output_t - scrap_t) / sum(output_t)
   - OEE = availability * performance * quality
4. Put KPI calculations in one module with unit tests. Show units on every number (t, %, min).
5. Keep it simple: one page, no login, no database. Prefer reading the CSVs at build time.
6. When you are unsure about the plant's reality, say so and suggest the question the team should ask the site director.
7. Before saying a task is done, run the tests and the build.
