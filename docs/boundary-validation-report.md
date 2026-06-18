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
- App GeoJSON size: 2,014,724 bytes
- App simplification: Douglas-Peucker per ring, tolerance 0.018 degrees
- Vertex count before app simplification: 260,746
- Vertex count after app simplification: 44,950
- App GeoJSON SHA-256: `6d735512fb7cab04ac7ca6048aa41437eba4f53595b83d8da4f25c198ba01f91`

## Repairs performed

No topology repair was performed. The source geometry was simplified upstream by geoBoundaries and retained in `indonesia-adm2.geojson`. A lighter app copy was simplified for runtime performance and written to `indonesia-adm2-simplified.geojson`. Properties were replaced with app-ready metadata fields.

## Known validation limitations

The dataset represents the 2020 COD-AB lineage and does not reflect all current 38-province administrative changes. The HDX workbook used for metadata still represented 34 ADM1 province codes in the inspected ADM2 sheet.

See `data/boundary-validation-summary.json` for machine-readable results.
