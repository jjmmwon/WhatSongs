import "./style.scss";
import * as d3 from "d3";

import { observer } from "./src/observer.js";

const Observer = observer();
const attrSelector = d3.select("#attr-selector");
attrSelector.on("change", () => {
  Observer.changeAttr();
});

async function update() {
  const data = await d3.csv("/data/data.csv", d3.autoType);
  const DR = await d3.csv("/data/tsne.csv", d3.autoType);
  Observer.initialize(data, DR);
}

update();
