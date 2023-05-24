import * as d3 from "d3";
import { scatterplot } from "./scatterplot.mjs";

export function observer() {
  let SP, PC, overview, detailView;
  let sp, pc;

  function initialize(data, DR) {
    SP = d3.select(".SP");
    PC = d3.select(".PC");
    overview = d3.select(".overview");
    detailView = d3.select(".detailView");

    sp = scatterplot(DR);

    SP.node().appendChild(sp.element);
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
