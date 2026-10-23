# Boundary Validation Report

Validation date: 2026-06-18

## Method

Validation used Python standard-library JSON parsing and custom coordinate traversal.

Checks completed:

- GeoJSON parseability
- Feature count
- Stable ID uniqueness
- Geometry type inventory
- Null and empty geometry check
- Coordinate range check
- Bounding box calculation
- Registry and geometry reconciliation
- Official metadata matching status

Checks not completed in this environment:

- Full topological overlap/gap analysis
- Self-intersection repair
- Ring orientation normalization
- Duplicate geometry detection beyond stable ID uniqueness

## Results

- Feature count: 519
- Unique stable IDs: 519
- Duplicate IDs: 0
- Geometry types: 287 Polygon, 232 MultiPolygon
- Null or empty geometry: 0
- Out-of-range coordinate features: 0
- BBox: `[95.0111465, -11.0076151, 141.0194, 6.07693]`
- Reference GeoJSON size: 9,930,000 bytes
- Legacy simplified GeoJSON size: 2,014,724 bytes
- Legacy per-ring simplification: Douglas-Peucker, tolerance 0.018 degrees
- Vertex count in full runtime geometry: 260,746
- Vertex count in legacy simplified geometry: 44,950
- Full runtime GeoJSON SHA-256: `b379b52fab7f2ac1ca85ccb670877785a3bc6f55534f7268868f8cdede72cd4f`

## Repairs performed

No topology repair was performed. The source geometry was simplified upstream by geoBoundaries and retained in `indonesia-adm2.geojson`. A lighter app copy was simplified for runtime performance and written to `indonesia-adm2-simplified.geojson`. Properties were replaced with app-ready metadata fields.

## Runtime rendering correction

The app now loads `indonesia-adm2.geojson` directly. The smaller per-ring simplified file is retained for reference and is no longer rendered. Leaflet's per-feature path simplification is disabled (`smoothFactor: 0`), and renderer viewport clipping is disabled (`noClip: true`) so the workspace draws raw rings like the export path.

An exact consecutive-coordinate comparison found 59,803 shared edge segments in the full source geometry and 2,614 in the legacy simplified copy. This confirms that the app-level simplification discarded many matching border segments. This comparison is not a complete topology validation or repair.

## Known validation limitations

The dataset represents the 2020 COD-AB lineage and does not reflect all current 38-province administrative changes. The HDX workbook used for metadata still represented 34 ADM1 province codes in the inspected ADM2 sheet.

See `data/boundary-validation-summary.json` for machine-readable results.
