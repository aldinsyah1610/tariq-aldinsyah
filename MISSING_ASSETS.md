# Missing Assets & Placeholder Data

Track placeholder content that needs real assets/data before the portfolio goes live.
All items render safely (guarded by `!a.src.startsWith('[')` and `!m.context.startsWith('[isi:')` in ProjectDetail.jsx).

---

## Process Artifact Images (blocked from rendering)

### `rakit-ecosystem`
| Placeholder | Caption |
|---|---|
| `[path-to-audit-matrix.jpg]` | Audit workshop output: matriks fitur berulang di 5+ produk |
| `[path-to-ecosystem-blueprint.jpg]` | Ecosystem blueprint: diagram dependensi antar modul |
| `[path-to-design-system-tokens.jpg]` | Design system token sheet: color, spacing, typography |

### `coopin-ecosystem`
| Placeholder | Caption |
|---|---|
| `[path-to-stakeholder-affinity-map.jpg]` | Affinity map dari sesi stakeholder interview |
| `[path-to-crossplatform-ia.jpg]` | Arsitektur informasi cross-platform: web admin vs mobile member |
| `[path-to-loan-wireframe.jpg]` | Low-fi wireframe flow pengajuan pinjaman |

### `mykisel-redesign`
| Placeholder | Caption |
|---|---|
| `[path-to-heuristic-report.jpg]` | Heuristic evaluation report: 14 critical friction point |
| `[path-to-ia-comparison.jpg]` | Perbandingan sitemap: 7 level (before) vs 3 level (after) |
| `[path-to-usability-notes.jpg]` | Synthesis usability testing: 12 sesi, task completion rate |

---

## Metric Contexts (hidden from UI until filled)

Format: `[isi: ...]` → replace with real measurement methodology.

| Project | Val | Label | Status |
|---|---|---|---|
| `coopin-ecosystem` | `↑` | Operational Accessibility | Needs measurement data |
| `mykisel-redesign` | `+20%` | Active Users in 3 Months | Needs MAU analytics |
| `mykisel-redesign` | `↑` | New Ecosystem Features | Needs feature count/data |
| `bayaraja` | `↓` | Transaction Drop-off Rate | Needs funnel analytics |
| `bayaraja` | `↑` | User Satisfaction Score | Needs survey/CSAT data |
| `bayaraja-canvasser` | `↑` | Field Productivity | Needs measurement data |
| `bayaraja-canvasser` | `↓` | Reporting Time | Needs time comparison data |
| `bayaraja-pos` | `↑` | Transaction Accuracy | Needs measurement data |
| `bayaraja-pos` | `↑` | MSME Digital Adoption | Needs adoption metrics |
| `marissa-hris` | `↑` | Employee Engagement | Needs measurement data |
| `marissa-hris` | `↓` | HR Manual Workload | Needs measurement data |
| `ifmc` | `↓` | System Fragmentation | Needs measurement data |
| `ifmc` | `↑` | Field Team Visibility | Needs measurement data |
| `dira-helpdesk` | `↓` | Average Resolution Time | Needs ticket log comparison |
| `dira-helpdesk` | `↑` | Request Visibility | Needs measurement data |

---

## Notes

- `rakit-ecosystem` metrics[0] and [1] (previously `40%` and `3×`) were replaced with factual reuse data (`4` apps, `1→N` pattern) in A1.
- Metrics using directional symbols (`↑`, `↓`) are intentionally non-numeric pending real data — they render as arrows in the UI without triggering the radial ring animation.
- `bayaraja-canvasser` metric[1] context has partial data (`[isi: diukur dari perbandingan waktu...`] — still placeholder, replace with actual figures.
- `dira-helpdesk` metric[0] context has partial data — same, replace with actual numbers.
