import { html, useState, useEffect } from "../libs/preact.mjs";
import layerSelection from "../singletons/layerSelection.js";

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
  const [activeLayer, setActiveLayer] = useState(layerSelection.active);
  useEffect(() => layerSelection.subscribe(setActiveLayer), []);

  useEffect(async () => {
    await clearLayers();

    if (activeLayer in layerSelection.layers) {
      layerSelection.layers[activeLayer].layer.show();
    }
  }, [activeLayer]);

  async function clearLayers() {
    for (const layer of Object.values(layerSelection.layers)) {
      await layer.layer.hide();
    }
  }

  function handleLayerChange(layer) {
    layerSelection.setActive(layer);
  }

  return html`
    <div class="layer-switcher">
      ${Object.entries(layerSelection.layers).map(
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
