import AbstractLayer from "./AbstractLayer.js";
class Batiment3d extends AbstractLayer {
  constructor() {
    super();

    this.addSource("bdTopo", {
      type: "vector",
      tiles: ["https://data.geopf.fr/tms/1.0.0/BDTOPO/{z}/{x}/{y}.pbf"],
    });

    this.addLayer(
      {
        id: "batiments_ign_hauteur",
        type: "fill-extrusion",
        source: "bdTopo",
        "source-layer": "batiment",
        paint: {
          "fill-extrusion-height": ["get", "hauteur"],
          "fill-extrusion-opacity": 1,
          "fill-extrusion-color": "#F1E8D1",
        },
      },
      "waterway-name",
    );
  }
}

const batiment3d = new Batiment3d();
export default batiment3d;
