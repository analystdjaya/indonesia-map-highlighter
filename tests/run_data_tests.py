import csv
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "indonesia-adm2-simplified.geojson"
REGISTRY = ROOT / "data" / "indonesia-adm2-registry.csv"
SAMPLE_CSV = ROOT / "sample" / "sample-region-colors.csv"
SAMPLE_PROJECT = ROOT / "sample" / "sample-project.json"


def walk_coords(geometry):
    if geometry["type"] == "Polygon":
        for ring in geometry["coordinates"]:
            for point in ring:
                yield point[0], point[1]
    elif geometry["type"] == "MultiPolygon":
        for polygon in geometry["coordinates"]:
            for ring in polygon:
                for point in ring:
                    yield point[0], point[1]


def main():
    failures = []
    geo = json.loads(DATA.read_text(encoding="utf-8"))
    features = geo.get("features", [])
    if geo.get("type") != "FeatureCollection":
        failures.append("GeoJSON is not a FeatureCollection")
    if len(features) != 519:
        failures.append(f"Expected 519 features, found {len(features)}")

    ids = [f["properties"].get("region_id") for f in features]
    duplicates = [key for key, value in Counter(ids).items() if value > 1]
    if duplicates:
        failures.append(f"Duplicate region IDs: {duplicates[:5]}")

    geometry_types = Counter((f.get("geometry") or {}).get("type") for f in features)
    unexpected = set(geometry_types) - {"Polygon", "MultiPolygon"}
    if unexpected:
        failures.append(f"Unexpected geometry types: {sorted(unexpected)}")

    for feature in features:
        props = feature["properties"]
        for field in ["region_id", "display_name", "geometry_source_name", "geometry_source_id", "match_status"]:
            if not props.get(field):
                failures.append(f"Missing {field} on {props.get('region_id')}")
                break
        geometry = feature.get("geometry")
        if not geometry:
            failures.append(f"Missing geometry on {props.get('region_id')}")
            continue
        coords = list(walk_coords(geometry))
        if not coords:
            failures.append(f"Empty coordinates on {props.get('region_id')}")
        if any(not (-180 <= x <= 180 and -90 <= y <= 90) for x, y in coords):
            failures.append(f"Out-of-range coordinate on {props.get('region_id')}")

    registry_rows = list(csv.DictReader(REGISTRY.open(encoding="utf-8")))
    if len(registry_rows) != len(features):
        failures.append("Registry row count does not match feature count")
    if set(row["internal_id"] for row in registry_rows) != set(ids):
        failures.append("Registry IDs do not match GeoJSON IDs")

    sample_rows = list(csv.DictReader(SAMPLE_CSV.open(encoding="utf-8")))
    code_index = {row["official_code"] for row in registry_rows if row["official_code"]}
    missing_sample = [row["Official_Code"] for row in sample_rows if row["Official_Code"] not in code_index]
    if missing_sample:
        failures.append(f"Sample CSV codes do not match registry: {missing_sample}")

    project = json.loads(SAMPLE_PROJECT.read_text(encoding="utf-8"))
    unknown_project_ids = [key for key in project["highlights"] if key not in set(ids)]
    if unknown_project_ids:
        failures.append(f"Sample project contains unknown IDs: {unknown_project_ids}")

    if failures:
        print("FAILED")
        for failure in failures:
            print("-", failure)
        raise SystemExit(1)
    print("PASSED")
    print(f"features={len(features)} polygon={geometry_types['Polygon']} multipolygon={geometry_types['MultiPolygon']}")
    print(f"registry={len(registry_rows)} sample_csv_rows={len(sample_rows)}")


if __name__ == "__main__":
    main()

