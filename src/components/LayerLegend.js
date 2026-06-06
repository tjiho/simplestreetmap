import { html, useState, useEffect } from "../libs/preact.mjs";
import { layerSelection } from "../createMap.js";
import { legendSample } from "../tools/legend.js";

export default function LayerLegend() {
  const [, setActiveLayer] = useState(layerSelection.active);
  useEffect(() => layerSelection.subscribe(setActiveLayer), []);

  const active = layerSelection.current;
  if (!active || typeof active.legend !== "function") return null;

  const data = active.legend();
  if (!data || !data.groups || !data.groups.length) return null;

  const groups = [...data.groups].reverse();

  return html`
    <div class="layer-legend-container">
      <ul class="layer-legend">
        ${groups.map(
          (group) => html`
            <li class="layer-legend__group">
              <h3 class="layer-legend__category">${group.category}</h3>
              <ul class="layer-legend__items">
                ${[...group.items].reverse().map(
                  (item) => html`
                    <li class="layer-legend__item">
                      ${legendSample(item)}
                      <span class="layer-legend__label">${item.label}</span>
                    </li>
                  `,
                )}
              </ul>
            </li>
          `,
        )}
      </ul>
    </div>
  `;
}
