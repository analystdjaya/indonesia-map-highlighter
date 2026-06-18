# Data README

## Production files

- `indonesia-adm2.geojson`: browser-ready production GeoJSON.
- `indonesia-adm2-simplified.geojson`: app-optimized production geometry simplified from `indonesia-adm2.geojson` for practical browser use.
- `indonesia-adm2-registry.csv`: geometry registry with stable IDs and matched HDX ADM2 metadata where unambiguous.
- `region-aliases.csv`: starter alias table for future manual matching.
- `unmatched-and-extra-regions.csv`: unresolved geometry and official-reference matching issues.
- `boundary-validation-summary.json`: machine-readable validation summary.

## Source

Production geometry uses geoBoundaries IDN ADM2, sourced from the HDX/OCHA COD-AB Indonesia lineage.

- Boundary year represented: 2020
- geoBoundaries boundary ID: `IDN-ADM2-22746128`
- Feature count: 519
- License reported by geoBoundaries: CC BY 3.0 IGO
- HDX package license title: CC BY-IGO

The larger source shapefile and geoBoundaries archive were not committed because the downloads timed out in this environment and the browser application only needs the validated GeoJSON.

## Matching status

The geometry contains names and geoBoundaries shape IDs. HDX tabular ADM2 data was used to enrich province names and official-style PCODEs where the geometry name matched exactly and uniquely.

- Geometry features: 519
- HDX ADM2 reference rows: 522
- Unique name matches: 466
- Ambiguous geometry names: 53
- Geometry features without any name candidate: 0
- Reference GeoJSON size: 9,930,000 bytes
- App GeoJSON size: 2,014,724 bytes
- App GeoJSON SHA-256: `6d735512fb7cab04ac7ca6048aa41437eba4f53595b83d8da4f25c198ba01f91`

## App simplification

The app file was simplified with Douglas-Peucker per linear ring at tolerance `0.018` degrees. Rings were preserved with fallback points so small islands/rings are not deliberately dropped. Vertex count changed from 260,746 to 44,950.

Ambiguous features remain usable for manual coloring by stable internal ID, but they are not assigned official codes automatically.
