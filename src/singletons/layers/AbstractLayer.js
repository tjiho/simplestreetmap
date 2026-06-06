export default class AbstractLayer {
  constructor({ map, visibleOnLoad = false, baseStyle = null } = {}) {
    if (!map) throw new Error("AbstractLayer: `map` is required");
    this.map = map;
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

    this.map.onLoadOrNow(() => {
      if (!this.map.getSource(id)) {
        this.map.addSource(id, source);
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

    this.map.onLoadOrNow(() => {
      if (!this.map.getLayer(layer.id)) {
        if (!this.visibleOnLoad) {
          layer.layout = {
            visibility: "none",
          };
        }
        this.map.addLayer(layer, this.beforeLayer || before);
      }
    });
  }

  async show() {
    if (this.baseStyle) await this.map.changeBaseMap(this.baseStyle);
    this.layersIds.forEach((id) => {
      if (this.map.getLayer(id)) {
        this.map.setLayoutProperty(id, "visibility", "visible");
      }
    });
  }

  async hide() {
    this.layersIds.forEach((id) => {
      if (this.map.getLayer(id)) {
        this.map.setLayoutProperty(id, "visibility", "none");
      }
    });
  }
}
