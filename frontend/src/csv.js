// Downloads rows as a CSV file that opens in Excel
export function downloadCsv(filename, columns, rows) {
  const esc = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const lines = [columns.map((c) => esc(c.label)).join(",")];
  rows.forEach((row) => lines.push(columns.map((c) => esc(c.value(row))).join(",")));
  // \uFEFF makes Excel read Hindi / special letters correctly
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
