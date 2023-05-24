import * as d3 from "d3";
import { scatterplot } from "./scatterplot.mjs";
import { parallelCoordinates } from "./parallelCoordinates.mjs";

export function observer() {
  let SP, PC, overview, detailView;
  let sp, pc;

  function initialize(data, DR) {
    console.log(data);
    console.log(DR);
    SP = d3.select(".SP");
    PC = d3.select(".PC");
    overview = d3.select(".overview");
    detailView = d3.select(".detailView");

    sp = scatterplot(DR);
    pc = parallelCoordinates(data);
    pc.update();

    SP.node().appendChild(sp.element);
    PC.node().appendChild(pc.element);
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
