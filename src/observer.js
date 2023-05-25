import * as d3 from "d3";
import { scatterplot } from "./scatterplot.js";
import { parallelCoordinates } from "./parallelCoordinates.js";
import { songsTable } from "./songs.js";
import { lineChart } from "./lineChart.js";

export function observer() {
  let Scatterplot, ParallelCoordinates;
  let sp, pc, st, lc;

  function initialize(data, DR) {
    console.log(data);
    console.log(DR);
    Scatterplot = d3.select(".SP");
    ParallelCoordinates = d3.select(".PC");

    sp = scatterplot(DR);
    pc = parallelCoordinates(data);
    pc.update();
    st = songsTable(data);
    lc = lineChart(data, "duration_ms");

    Scatterplot.node().appendChild(sp.element);
    ParallelCoordinates.node().appendChild(pc.element);
    return this;
  }

  function update() {
    return this;
  }

  return {
    update,
    initialize,
  };
}
