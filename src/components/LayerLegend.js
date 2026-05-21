import { html, useState, useEffect } from "../libs/preact.mjs";
import layerSelection from "../singletons/layerSelection.js";

export default function LayerLegend() {
  const [, setActiveLayer] = useState(layerSelection.active);
  useEffect(() => layerSelection.subscribe(setActiveLayer), []);

  const active = layerSelection.current;
  if (!active || typeof active.legend !== "function") return null;

  return html`<div class="layer-legend-container">${active.legend()}</div>`;
}
