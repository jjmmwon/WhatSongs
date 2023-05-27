import * as d3 from "d3";
import "d3-brush";

export function scatterplot(data, DR, handlers) {
  const margin = { top: 40, right: 90, bottom: 10, left: 0 };
  const width = 360;
  const height = 360;

  // construct scales
  const xScale = d3
    .scaleLinear()
    .range([0, width])
    .domain(d3.extent(DR, (d) => d.x).map((d) => d * 1.05));

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent(DR, (d) => d.y).map((d) => d * 1.05));

  const zScale = d3
    .scaleOrdinal()
    .range(d3.schemeTableau10)
    .domain(
      [...new Set(DR.map((d) => d.genre))].sort(
        (a, b) =>
          DR.filter((d) => d.genre === b).length -
          DR.filter((d) => d.genre === a).length
      )
    );

  // construct svg and g
  const svg = d3
    .create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  const container = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // encode data

  const circles = container
    .append("g")
    .selectAll("circle")
    .data(DR)
    .join("circle")
    .attr("r", 2.5)
    .attr("opacity", 0.7)
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("fill", (d) => zScale(d.genre));

  // create legends
  const legends = svg
    .append("g")
    .attr(
      "transform",
      `translate(${margin.left + width + 20}, ${margin.top + 210})`
    );

  const legendRects = legends
    .append("g")
    .selectAll("rect")
    .data(zScale.domain())
    .join("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * 15)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => zScale(d))
    .attr("cursor", "pointer")
    .on("click", (event, d) => {
      data.forEach((datum) =>
        datum.genre === d ? (datum.state = "selected") : (datum.state = "")
      );
      handlers.brush();
      handlers.endEvent();
    });

  const legendTexts = legends
    .append("g")
    .selectAll("text")
    .data(zScale.domain())
    .join("text")
    .attr("x", 15)
    .attr("y", (d, i) => i * 15 + 10)
    .text((d) => d)
    .attr("font-size", 10)
    .attr("text-anchor", "start");

  //create brush
  const brush = d3
    .brush()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("start brush", (event) => {
      brushCircles(event);
      handlers.brush();
    })
    .on("end", () => {
      if (isEmpty()) {
        handlers.reset();
      } else {
        handlers.endEvent();
      }
    });

  container.call(brush);

  function brushCircles(event) {
    let selection = event.selection;
    data.forEach((d, i) =>
      isBrushed(DR[i], selection) ? (d.state = "selected") : (d.state = "")
    );
  }

  function isBrushed(d, selection) {
    let [[x0, y0], [x1, y1]] = selection;
    let x = xScale(d.x);
    let y = yScale(d.y);
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }

  function isEmpty() {
    return data.filter((d) => d.state === "selected").length === 0;
  }

  function update() {
    // update circles
    circles.attr("opacity", (d, i) => (data[i].state === "selected" ? 1 : 0.1));
  }
  function hover(idx) {
    circles.attr("opacity", (d, i) => (i === idx ? 1 : 0.1));
  }
  function reset() {
    circles.attr("opacity", 0.7);
  }

  return {
    element: svg.node(),
    update,
    hover,
    reset,
  };
}
