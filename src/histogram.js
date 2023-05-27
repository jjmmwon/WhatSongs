import * as d3 from "d3";

export function histogram(data, handlers) {
  const margin = { top: 60, right: 30, bottom: 40, left: 60 };
  const width = 520 - margin.left - margin.right;
  const height = 360 - margin.top - margin.bottom;
  let bins, xScale, yScale;

  const svg = d3
    .create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  const container = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const xAxis = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${margin.left}, ${height + margin.top})`);
  const yAxis = svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
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

  function update(attr, filter = false) {
    let activeData = filter ? data.filter((d) => d.state == "selected") : data;
    bins = d3
      .bin()
      .domain(d3.extent(activeData.map((d) => d[attr])))
      .thresholds(
        activeData.length > 500 ? 30 : activeData.length > 200 ? 20 : 10
      )(activeData.map((d) => d[attr]));
    console.log(bins);
    xScale = d3
      .scaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([0, width]);
    yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins.map((d) => d.length))])
      .range([height, 0]);

    let stack = d3.stack().keys(zScale.domain());

    xAxis.transition().duration(1000).call(d3.axisBottom(xScale));
    yAxis.transition().duration(1000).call(d3.axisLeft(yScale));

    const bar = container.selectAll("rect").data(bins).join("rect");
    bar
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.x0) + 1)
      .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
      .attr("y", (d) => yScale(d.length))
      .attr("height", (d) => yScale(0) - yScale(d.length))
      .attr("fill", d3.schemeTableau10[8]);
  }

  return {
    element: svg.node(),
    update,
  };
}
