import * as d3 from "d3";

export function songsTable(data) {
  const table = d3.select(".table-body");
  const rows = table.selectAll("tr").data(data).join("tr");

  const columns = ["artist", "song"];

  rows
    .selectAll("td")
    .data((d) => columns.map((c) => d[c]))
    .join("td")
    .text((d) => d);

  function update(selectedData) {}

  return {
    update,
  };
}
