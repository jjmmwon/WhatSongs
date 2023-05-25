import "./style.scss";
import * as d3 from "d3";

import { observer } from "./src/observer.js";

const Observer = observer();

async function update() {
  const data = await d3.csv("/data/data.csv", d3.autoType);
  const DR = await d3.csv("/data/tsne.csv", d3.autoType);
  Observer.initialize(data, DR);
}

update();
