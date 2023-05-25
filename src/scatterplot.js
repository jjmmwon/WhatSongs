import * as d3 from "d3";

export function scatterplot(data) {
  const margin = { top: 10, right: 90, bottom: 10, left: 0 };
  const width = 310;
  const height = 310;

  // construct scales
  const xScale = d3
    .scaleLinear()
    .range([0, width])
    .domain(d3.extent(data, (d) => d.x).map((d) => d * 1.01));

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent(data, (d) => d.y).map((d) => d * 1.01));

  const zScale = d3
    .scaleOrdinal()
    .range(d3.schemeTableau10)
    .domain(
      [...new Set(data.map((d) => d.genre))].sort(
        (a, b) =>
          data.filter((d) => d.genre === b).length -
          data.filter((d) => d.genre === a).length
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

  const legends = svg
    .append("g")
    .attr(
      "transform",
      `translate(${margin.left + width + 20}, ${margin.top + 210})`
    );

  const circles = container.append("g");
  circles
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", 2.5)
    .attr("opacity", 0.7)
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("fill", (d) => zScale(d.genre));

  const legendRects = legends.append("g");
  const legendTexts = legends.append("g");

  legendRects
    .selectAll("rect")
    .data(zScale.domain())
    .join("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * 15)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => zScale(d));

  legendTexts
    .selectAll("text")
    .data(zScale.domain())
    .join("text")
    .attr("x", 15)
    .attr("y", (d, i) => i * 15 + 10)
    .text((d) => d)
    .attr("font-size", 10)
    .attr("text-anchor", "start");

  function update() {
    // update circles
  }

  return {
    element: svg.node(),
    update,
  };
}
