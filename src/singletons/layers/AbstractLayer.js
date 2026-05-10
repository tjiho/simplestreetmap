import map from "../map.js";

export default class AbstractLayer {
  constructor({ visibleOnLoad = false } = {}) {
    this.layersIds = [];
    this.sourcesIds = [];
    this.beforeLayer = null;
    this.visibleOnLoad = visibleOnLoad;
  }

  addSource(id, source) {
    if (this.sourcesIds.includes(id)) {
      console.warn(`Source "${id}" already exists. Skipping.`);
      return;
    }
    this.sourcesIds.push(id);

    map.onLoadOrNow(() => {
      if (!map.getSource(id)) {
        map.addSource(id, source);
      }
    });
  }

  addLayer(layer, before = null) {
    if (this.layersIds.includes(layer.id)) {
      console.warn(`Layer "${layer.id}" already exists. Skipping.`);
      return;
    }
    this.layersIds.push(layer.id);

    map.onLoadOrNow(() => {
      if (!map.getLayer(layer.id)) {
        if (!this.visibleOnLoad) {
          layer.layout = {
            visibility: "none",
          };
        }
        map.addLayer(layer, this.beforeLayer || before);
      }
    });
  }

  show() {
    this.layersIds.forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", "visible");
      }
    });
  }

  hide() {
    this.layersIds.forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", "none");
      }
    });
  }
}
