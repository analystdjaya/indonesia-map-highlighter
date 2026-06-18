# Data Inspection Report

## Files inspected

- `data/indonesia-adm2-simplified.geojson`
- `data/IDN_Admin123Boundaries_TabularData.xlsx`

## GeoJSON inspection

- Type: FeatureCollection
- Feature count: 519
- Geometry types: 287 Polygon, 232 MultiPolygon
- Coordinate bounds: 95.0111465, -11.0076151, 141.0194, 6.07693
- Null or empty geometry: 0
- Out-of-range coordinates: 0
- Original attributes: `shapeName`, `shapeISO`, `shapeID`, `shapeGroup`, `shapeType`

## HDX workbook inspection

ADM2 sheet headers:

- `ADM2_EN`
- `ADM2_PCODE`
- `ADM2_REF`
- `ADM2ALT1_EN`
- `ADM2ALT2_EN`
- `ADM1_EN`
- `ADM1_PCODE`
- `ADM0_EN`
- `ADM0_PCODE`
- `DATE`
- `VALIDON`
- `VALIDTO`
- `AREA_SQKM`

Rows:

- ADM2 rows: 522
- ADM1 province codes represented: 34

## Attribute enrichment

Unique normalized name matching was used from geometry `shapeName` to HDX `ADM2_EN` and alternate-name fields.

Results:

- 466 geometry features matched one HDX ADM2 row.
- 53 geometry features had multiple candidate HDX rows and were left unresolved.
- 0 geometry features had no candidate at all.
- 109 unresolved report rows were written because each ambiguous geometry and each non-uniquely matched official row is recorded.

