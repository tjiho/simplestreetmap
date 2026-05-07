import AbstractLayer from "./AbtractLayer.js";
import { poiIconExpression } from "../../tools/getIcon.js";

class PoiLayer extends AbstractLayer {
  constructor() {
    super();

    this.addSource("poi", {
      type: "vector",
      url: "pmtiles://https://static.ppsfleet.navy/osm-data/poi.pmtiles",
    });

    this.addLayer({
      id: "poi-named",
      type: "symbol",
      source: "poi",
      "source-layer": "poi",
      minzoom: 15,
      layout: {
        "icon-image": poiIconExpression,
        "icon-size": 1,
        "icon-allow-overlap": false,
        "text-padding": 2,
        "text-font": ["Open Sans Regular"],
        "text-anchor": "top",
        "text-field": [
          "case",
          ["has", "name:latin"],
          ["get", "name:latin"],
          ["get", "name"],
        ],
        "text-optional": true,
        "text-offset": [0, 1.4],
        "text-size": 10,
        "text-max-width": 9,
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": "#fff",
        "text-halo-width": 1.5,
      },
    });
  }
}

const poiLayer = new PoiLayer();
export default poiLayer;
