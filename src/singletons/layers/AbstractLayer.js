import map from "../map.js";

export default class AbstractLayer {
  constructor({ visibleOnLoad = false, baseStyle = BASE_MAP_URL } = {}) {
    this.layersIds = [];
    this.sourcesIds = [];
    this.beforeLayer = null;
    this.visibleOnLoad = visibleOnLoad;
    this.baseStyle = baseStyle;
  }

  addSource(id, source) {
    id = "custom-" + id;
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
    layer.id = "custom-" + layer.id;
    layer.source = "custom-" + layer.source;
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

  async show() {
    await map.changeBaseMap(this.baseStyle);
    this.layersIds.forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", "visible");
      }
    });
  }

  async hide() {
    // await map.changeBaseMap(BASE_MAP_URL);
    this.layersIds.forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", "none");
      }
    });
  }
}
