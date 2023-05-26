import "./style.scss";
import * as d3 from "d3";

import { observer } from "./src/observer.js";

const Observer = observer();
const attrSelector = d3.select("#attr-selector");
const checkboxes = d3.selectAll(".form-check-input");

attrSelector.on("change", () => {
  Observer.changeAttr();
});

checkboxes.on("change", () => {
  if (checkboxes.nodes().filter((c) => c.checked).length == 4) {
    checkboxes
      .nodes()
      .filter((c) => !c.checked)
      .forEach((c) => (c.disabled = true));
  } else {
    checkboxes
      .nodes()
      .filter((c) => !c.checked)
      .forEach((c) => (c.disabled = false));
  }
  let activeDims = checkboxes
    .nodes()
    .filter((c) => c.checked)
    .map((c) => c.id);
  Observer.changeDims(activeDims);
});

async function update() {
  const data = await d3.csv(
    "https://raw.githubusercontent.com/jjmmwon/WhatSongs/main/public/data/data.csv",
    d3.autoType
  );
  const DR = await d3.csv(
    "https://raw.githubusercontent.com/jjmmwon/WhatSongs/main/public/data/tsne.csv",
    d3.autoType
  );
  Observer.initialize(data, DR);
}

update();
