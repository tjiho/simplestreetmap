import { html, useState, useEffect } from "../libs/preact.mjs";

import satellite from "../singletons/layers/sattelite.js";
import batiment3d from "../singletons/layers/batiment3d.js";
import bicycle from "../singletons/layers/bicycle.js";
import plan from "../singletons/layers/plan.js";
const layers = {
  plan: {
    layer: plan,
    name: "Plan",
  },
  satellite: {
    layer: satellite,
    name: "Satellite",
  },
  batiment3d: {
    layer: batiment3d,
    name: "Batiment 3d",
  },
  bicycle: {
    layer: bicycle,
    name: "Vélo (alpha)",
  },
};

function LayerButton({ layerKey, name, isActive, onClick }) {
  return html`
    <button
      class="layer-switcher__option ${isActive
        ? "layer-switcher__option--active"
        : ""}"
      onClick=${() => onClick(layerKey)}
    >
      ${name}
    </button>
  `;
}

export default function LayerSwitcher() {
  const [activeLayer, setActiveLayer] = useState("plan");

  useEffect(async () => {
    await clearLayers();

    if (activeLayer in layers) {
      layers[activeLayer].layer.show();
    }
  }, [activeLayer]);

  async function clearLayers() {
    for (const layer of Object.values(layers)) {
      await layer.layer.hide();
    }
  }

  function handleLayerChange(layer) {
    if (layer === activeLayer) return;
    setActiveLayer(layer);
  }

  return html`
    <div class="layer-switcher">
      ${Object.entries(layers).map(
        ([key, { name }]) => html`
          <${LayerButton}
            layerKey=${key}
            name=${name}
            isActive=${activeLayer === key}
            onClick=${handleLayerChange}
          />
        `,
      )}
    </div>
  `;
}
