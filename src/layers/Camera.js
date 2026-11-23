import { AbstractLayer } from "esquisse";

// Caméras de surveillance (man_made=surveillance), tuiles générées par tippecanoe
// dans camera.pmtiles (source-layer "poi", zoom 12 à 17).
export default class Camera extends AbstractLayer {
  constructor({ map, sourceUrl, baseStyle } = {}) {
    super({ map, baseStyle });
    // Sous les labels du fond de carte, comme Bicycle
    this.beforeLayer = "waterway-name";

    this.addSource("camera", {
      type: "vector",
      url: sourceUrl,
    });

    // ALPR = lecture automatique de plaques
    const isAlpr = [
      "in",
      "ALPR",
      ["coalesce", ["get", "surveillance:type"], ""],
    ];

    this.addLayer({
      id: "camera",
      type: "circle",
      source: "camera",
      "source-layer": "poi",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          12,
          2.5,
          17,
          7,
        ],
        "circle-color": ["case", isAlpr, "#7b1fa2", "#d32f2f"],
        "circle-stroke-color": "#fff",
        "circle-stroke-width": 1.5,
      },
    });
  }
}
