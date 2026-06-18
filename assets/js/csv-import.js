(function () {
  const REQUIRED_HEADERS = ["Official_Code", "Province", "Region_Name", "Color", "Value", "Category"];

  function escapeFormula(value) {
    const text = String(value || "");
    return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];
      if (inQuotes) {
        if (char === '"' && next === '"') {
          field += '"';
          i += 1;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          field += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (char !== "\r") {
        field += char;
      }
    }
    row.push(field);
    rows.push(row);
    return rows.filter((items) => items.some((value) => value.trim() !== ""));
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/\b(KABUPATEN|KAB\.?|KOTA)\b/g, " ")
      .replace(/[^A-Z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeCode(value) {
    const text = String(value || "").trim().toUpperCase().replace(/^ID/, "").replace(/\./g, "");
    if (/^\d{4}$/.test(text)) return text.slice(0, 2) + "." + text.slice(2);
    return String(value || "").trim().toUpperCase();
  }

  function validateAndMatch(text, indexes) {
    const rows = parseCsv(text);
    if (!rows.length) throw new Error("CSV kosong.");
    const headers = rows[0].map((h) => h.trim());
    const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
    if (missing.length) throw new Error("Kolom wajib tidak ada: " + missing.join(", "));
    const headerIndex = Object.fromEntries(headers.map((h, i) => [h, i]));
    const seenTargets = new Set();
    const results = [];
    rows.slice(1).forEach((cells, index) => {
      const record = {};
      headers.forEach((h, i) => { record[h] = (cells[i] || "").trim(); });
      const rowNumber = index + 2;
      const errors = [];
      const code = normalizeCode(record.Official_Code);
      const color = record.Color || "#4472C4";
      if (!record.Official_Code && !(record.Province && record.Region_Name)) errors.push("Isi Official_Code atau Province + Region_Name.");
      if (record.Color && !ProjectStorage.isColor(color)) errors.push("Warna tidak valid.");
      let matched = null;
      let ambiguous = [];
      if (code && indexes.byCode.has(code)) {
        matched = indexes.byCode.get(code);
      } else if (record.Province && record.Region_Name) {
        const key = normalizeText(record.Province) + "|" + normalizeText(record.Region_Name);
        const candidates = indexes.byProvinceName.get(key) || [];
        if (candidates.length === 1) matched = candidates[0];
        if (candidates.length > 1) ambiguous = candidates;
      }
      if (!matched && !ambiguous.length && !errors.length) errors.push("Wilayah tidak ditemukan.");
      if (ambiguous.length) errors.push("Nama wilayah ambigu; gunakan Official_Code.");
      if (matched && seenTargets.has(matched.id)) errors.push("Duplikat wilayah dalam CSV.");
      if (matched) seenTargets.add(matched.id);
      results.push({ rowNumber, record, matched, ambiguous, errors, color });
    });
    return {
      headers,
      valid: results.filter((r) => r.matched && !r.errors.length),
      invalid: results.filter((r) => r.errors.length),
      all: results
    };
  }

  function buildErrorCsv(results) {
    const lines = [["Row", "Official_Code", "Province", "Region_Name", "Color", "Errors"].join(",")];
    results.invalid.forEach((item) => {
      const values = [
        item.rowNumber,
        item.record.Official_Code,
        item.record.Province,
        item.record.Region_Name,
        item.record.Color,
        item.errors.join("; ")
      ].map((value) => '"' + escapeFormula(value).replace(/"/g, '""') + '"');
      lines.push(values.join(","));
    });
    return lines.join("\n");
  }

  window.CsvImport = { validateAndMatch, buildErrorCsv, normalizeText, normalizeCode };
})();

