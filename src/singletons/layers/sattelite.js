import AbstractLayer from "./AbtractLayer.js";
class Sattelite extends AbstractLayer {
  constructor() {
    super();

    this.addSource("satellite", {
      type: "raster",
      tiles: [
        "https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
          "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg" +
          "&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
      ],
      tileSize: 256,
      attribution: "© IGN-Géoportail",
    });

    this.addLayer({
      id: "satellite",
      type: "raster",
      source: "satellite",
      layout: {
        visibility: "none",
      },
    });
  }
}

const satellite = new Sattelite();
export default satellite;
