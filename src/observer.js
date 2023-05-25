import * as d3 from "d3";
import { scatterplot } from "./scatterplot.js";
import { parallelCoordinates } from "./parallelCoordinates.js";
import { songsTable } from "./songs.js";
import { lineChart } from "./lineChart.js";

export function observer() {
  let Scatterplot, ParallelCoordinates, detailView;
  let sp, pc, st, lc;
  let attrs = [
    "duration_ms",
    "danceability",
    "tempo",
    "energy",
    // "popularity",
    // "loudness",
    // "acousticness",
    // "speechiness",
    // "instrumentalness",
    // "liveness",
    // "valence",
  ];

  function initialize(data, DR) {
    console.log(data);
    console.log(DR);
    Scatterplot = d3.select(".SP");
    ParallelCoordinates = d3.select(".PC");
    detailView = d3.select(".detailView");

    sp = scatterplot(DR);
    pc = parallelCoordinates(data);
    pc.update();
    st = songsTable(data);
    lc = attrs.map((attr) => lineChart(data, attr));

    Scatterplot.node().appendChild(sp.element);
    ParallelCoordinates.node().appendChild(pc.element);
    lc.forEach((l) => {
      detailView.node().appendChild(l.element);
    });
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
