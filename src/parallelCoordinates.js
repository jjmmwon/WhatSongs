import * as d3 from "d3";

export function parallelCoordinates(data) {
  const margin = { top: 60, right: 20, bottom: 60, left: 40 };
  const width = 640 - margin.left - margin.right;
  const height = 420 - margin.top - margin.bottom;

  // construct scales
  const Dims = [
    "duration_ms",
    "danceability",
    "tempo",
    "energy",
    "popularity",
    "loudness",
    "acousticness",
    "speechiness",
    "instrumentalness",
    "liveness",
    "valence",
  ];
  let activeDims = ["popularity", "danceability", "energy", "acousticness"];
  const xScale = d3.scalePoint().range([0, width]).domain(activeDims);
  const yScale = {};
  Dims.forEach((dim) => {
    yScale[dim] = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[dim]).map((d) => d * 1.03))
      .range([height, 0]);
  });
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

  let polyline = (d) => {
    return d3.line()(
      activeDims.map((dim) => [xScale(dim), yScale[dim](d[dim])])
    );
  };

  const svg = d3
    .create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const container = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const axes = container.append("g");
  axes
    .selectAll("g.axis")
    .data(activeDims)
    .join("g")
    .attr("class", "axis")
    .attr("transform", (d) => `translate(${xScale(d)}, 0)`)
    .each(function (d) {
      d3.select(this).call(d3.axisLeft(yScale[d]));
    });

  const titles = container.append("g");
  titles
    .selectAll("text")
    .data(activeDims)
    .join("text")
    .attr("transform", (d) => `translate(${xScale(d)}, -10)`)
    .text((d) => d)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("dy", "-.8em");

  const lineG = container.append("g");
  let lines = lineG
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("d", polyline)
    .attr("fill", "none")
    .attr("stroke", (d) => zScale(d.genre))
    .attr("stroke-width", 1.5)
    .attr("opacity", 0);

  function update(dims) {
    activeDims = dims ? dims : activeDims;
    xScale.domain(activeDims);
    console.log(activeDims);
    axes
      .selectAll("g.axis")
      .data(activeDims)
      .join("g")
      .attr("class", "axis")
      .transition()
      .duration(1000)
      .attr("transform", (d) => `translate(${xScale(d)}, 0)`)
      .each(function (d) {
        d3.select(this).call(d3.axisLeft(yScale[d]));
      });

    titles
      .selectAll("text")
      .data(activeDims)
      .join("text")
      .transition()
      .duration(1000)
      .attr("transform", (d) => `translate(${xScale(d)}, -10)`)
      .text((d) => d)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("dy", "-.8em");

    lines = lineG
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("d", polyline)
      .attr("fill", "none")
      .attr("stroke", (d) => zScale(d.genre))
      .attr("stroke-width", 1.5)
      .attr("opacity", (d) => (d.state == "selected" ? 0.7 : 0.01));
  }

  function brush() {
    lines
      .transition()
      .attr("opacity", (d) => (d.state == "selected" ? 0.7 : 0.01));
  }

  function hover(idx) {
    lines.transition().attr("opacity", (d, i) => (i == idx ? 0.7 : 0.01));
  }

  function reset() {
    lines.transition().attr("opacity", 0.01);
  }
  return {
    element: svg.node(),
    update,
    reset,
    hover,
    brush,
  };
}
