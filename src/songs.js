import * as d3 from "d3";

export function songsTable(data, handlers) {
  const table = d3.select(".table-body");
  const columns = ["artist", "song"];

  const colorScale = d3
    .scaleOrdinal()
    .range(d3.schemeTableau10)
    .domain(
      [...new Set(data.map((d) => d.genre))].sort(
        (a, b) =>
          data.filter((d) => d.genre === b).length -
          data.filter((d) => d.genre === a).length
      )
    );

  let rows = table
    .selectAll("tr")
    .data(data)
    .join("tr")
    .on("mouseover", (_, d) => {
      handlers.hover(d.idx);
      console.log(d);
    })
    .on("mouseout", () => {
      handlers.mouseout();
    });
  let tds = rows
    .selectAll("td")
    .data((d) => columns.map((c) => d[c]))
    .join("td")
    .text((d) => d);

  function update() {
    let brushedData = data.filter((d) => d.state === "selected");
    rows = table
      .selectAll("tr")
      .data(brushedData)
      .join("tr")
      .on("mouseover", (_, d) => {
        handlers.hover(d.idx);
        console.log(d);
      })
      .on("mouseout", () => {
        handlers.brush();
      });
    tds = rows
      .selectAll("td")
      .data((d) => columns.map((c) => d[c]))
      .join("td")
      .text((d) => d);
  }

  function hover(idx) {
    rows.attr("style", (d) =>
      d.idx === idx ? `background-color: ${colorScale(d.genre)};` : null
    );
  }

  function mouseout() {
    console.log("mouseout");
    rows.attr("style", "background-color: initial;");
  }

  function reset() {
    rows = table
      .selectAll("tr")
      .data(data)
      .join("tr")
      .on("mouseover", (_, d) => {
        handlers.hover(d.idx);
        console.log(d);
      })
      .on("mouseout", () => {
        handlers.mouseout();
      });

    tds = rows
      .selectAll("td")
      .data((d) => columns.map((c) => d[c]))
      .join("td")
      .text((d) => d);
  }

  return {
    update,
    reset,
    hover,
    mouseout,
  };
}
