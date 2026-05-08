import AbstractLayer from "./AbtractLayer.js";
import map from "../map.js";

class Terrain extends AbstractLayer {
  constructor() {
    super();

    this.addSource("terrain", {
      type: "raster-dem",
      url: "pmtiles://https://static.ppsfleet.navy/osm-data/france-elevation.pmtiles",
      encoding: "terrarium",
      //tileSize: 512,
      maxzoom: 10,
    });

    map.onLoadOrNow(() => {
      map.setTerrain({ source: "terrain", exaggeration: 1.2 });
      map.setSky({
        "sky-color": "#cfe8ff",
        "horizon-color": "#ffffff",
        "fog-color": "#ffffff",
        "fog-ground-blend": 0.5,
      });
    });

    this.addLayer(
      {
        id: "hillshade",
        type: "hillshade",
        source: "terrain",

        paint: { "hillshade-exaggeration": 0.35 },
      },
      "road_area_pier",
    );
  }
}

const terrain = new Terrain();
export default terrain;
