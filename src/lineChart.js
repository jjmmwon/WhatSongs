import * as d3 from "d3";

export function lineChart(data, attr) {
  const margin = { top: 30, right: 80, bottom: 30, left: 50 };
  const width = 400 - margin.left - margin.right;
  const height = 180 - margin.top - margin.bottom;

  const years = [...new Set(data.map((d) => d.year))];
  const means = years.map((y) => {
    return {
      year: y,
      mean: d3.mean(data.filter((d) => d.year === y).map((d) => d[attr])),
    };
  });

  const div = d3.create("div");
  const svg = div
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  const attrText = svg
    .append("text")
    .attr("x", 50)
    .attr("y", 15)
    .text(attr)
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "hanging");
  const yearText = svg
    .append("text")
    .attr("x", width + margin.left + 10)
    .attr("y", height + margin.top + 3)
    .text("Year →")
    .attr("font-size", 10)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "middle");

  const container = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${height + margin.top})`);
  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear().domain(d3.extent(years)).range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain(
      d3
        .extent(means.map((d) => d.mean))
        .map((d, i) =>
          i ? (d > 0 ? d * 1.03 : d * 0.97) : d > 0 ? d * 0.97 : d * 1.03
        )
    )
    .range([height, 0]);

  xAxis.call(d3.axisBottom(xScale));
  yAxis.call(d3.axisLeft(yScale));

  let polyline = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.mean));

  const line = container.append("g");
  line
    .append("path")
    .attr("d", polyline(means))
    .attr("fill", "none")
    .attr("stroke", d3.schemeTableau10[7])
    .attr("stroke-width", 2.5);

  return {
    element: div.node(),
  };
}
