import * as d3 from "d3";

export function lineChart(data, attr) {
  const margin = { top: 10, right: 10, bottom: 30, left: 30 };
  const width = 400 - margin.left - margin.right;
  const height = 150 - margin.top - margin.bottom;

  const years = [...new Set(data.map((d) => d.year))];
  const means = years.map((y) =>
    d3.mean(data.filter((d) => d.year === y).map((d) => d[attr]))
  );

  const svg = d3
    .create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  const container = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${height})`);
  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`);

  const xScale = d3.scaleLinear().domain(d3.extent(years)).range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(means).map((d) => d * 1.05))
    .range([height, 0]);

  xAxis.call(d3.axisBottom(xScale));
  yAxis.call(d3.axisLeft(yScale));

  const lines = container.append("g");
}
