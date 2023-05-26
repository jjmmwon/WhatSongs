import * as d3 from "d3";
import { scatterplot } from "./scatterplot.js";
import { parallelCoordinates } from "./parallelCoordinates.js";
import { songsTable } from "./songs.js";
import { lineChart } from "./lineChart.js";
import { histogram } from "./histogram.js";

export function observer() {
  let observedData;
  let Scatterplot, ParallelCoordinates, detailView, Histogram;
  let sp, pc, st, lc, hg;
  let attrs = [
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
  let handlers = {
    brush: () => brush(),
    reset: () => reset(),
    hover: (idx) => hover(idx),
    mouseout: () => mouseout(),
    endEvent: () => endEvent(),
  };

  function initialize(data, DR) {
    observedData = data;
    data.forEach((d, i) => {
      d.state = "";
      d.idx = i;
    });
    console.log(data);
    console.log(DR);
    Scatterplot = d3.select(".SP");
    ParallelCoordinates = d3.select(".PC");
    detailView = d3.select(".detailView");
    Histogram = d3.select(".HG");

    sp = scatterplot(data, DR, handlers);
    pc = parallelCoordinates(data);
    pc.update();
    st = songsTable(data, handlers);
    lc = attrs.map((attr) => lineChart(data, attr));
    hg = histogram(data, handlers);
    hg.update(d3.select("#attr-selector").node().value);

    Scatterplot.node().appendChild(sp.element);
    ParallelCoordinates.node().appendChild(pc.element);
    lc.forEach((l) => {
      detailView.node().appendChild(l.element);
    });
    Histogram.node().appendChild(hg.element);

    return this;
  }

  function brush() {
    sp.update();
    pc.brush();
    st.update();
    st.mouseout();
    return this;
  }
  function endEvent() {
    hg.update(d3.select("#attr-selector").node().value, true);
  }

  function hover(idx) {
    sp.hover(idx);
    pc.hover(idx);
    st.hover(idx);
    return this;
  }

  function mouseout() {
    sp.reset();
    pc.reset();
    st.mouseout();
    return this;
  }

  function reset() {
    sp.reset();
    pc.reset();
    st.reset();
    hg.update(d3.select("#attr-selector").node().value);
    return this;
  }

  function changeAttr() {
    hg.update(
      d3.select("#attr-selector").node().value,
      observedData.filter((d) => d.state === "selected").length > 0
        ? true
        : false
    );
  }

  function changeDims(activeDims) {
    pc.update(activeDims);
  }

  return {
    update: brush,
    initialize,
    changeAttr,
    changeDims,
  };
}
