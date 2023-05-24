import * as d3 from "d3";

export function scatterplot(data) {
  const margin = { top: 20, right: 120, bottom: 20, left: 10 };
  const width = 340;
  const height = 340;

  // construct scales
  const xScale = d3
    .scaleLinear()
    .range([0, width])
    .domain(d3.extent(data, (d) => d.x).map((d) => d * 1.01));

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain(d3.extent(data, (d) => d.y).map((d) => d * 1.01));

  const labelScale = d3
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

  const circles = container.append("g");
  circles
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", 2.5)
    .attr("opacity", 0.7)
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("fill", (d) => labelScale(d.genre));

  function update() {
    // update circles
  }

  return {
    element: svg.node(),
    update,
  };
}
