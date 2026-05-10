import { html, useState, useEffect } from "../libs/preact.mjs";

import satellite from "../singletons/layers/sattelite.js";
import batiment3d from "../singletons/layers/batiment3d.js";
import bicycle from "../singletons/layers/bicycle.js";

const layers = {
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

  const allLayers = [
    { key: "plan", name: "Plan" },
    ...Object.entries(layers).map(([key, config]) => ({
      key,
      name: config.name,
    })),
  ];

  useEffect(() => {
    clearLayers();

    if (activeLayer in layers) {
      layers[activeLayer].layer.show();
    }
  }, [activeLayer]);

  function clearLayers() {
    for (const layer of Object.values(layers)) {
      layer.layer.hide();
    }
  }

  function handleLayerChange(layer) {
    if (layer === activeLayer) return;
    setActiveLayer(layer);
  }

  return html`
    <div class="layer-switcher">
      ${allLayers.map(
        ({ key, name }) => html`
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
