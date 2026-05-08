import AbstractLayer from "./AbtractLayer.js";
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
        layout: {
          visibility: "none",
        },
      },
      "waterway-name",
    );

    // map.addSource("lidar", {
    //     type: 'raster-dem',
    //     url: 'pmtiles://https://static.ppsfleet.navy/osm-data/aubin.pmtiles',
    //     encoding: 'terrarium',
    //     tileSize: 512
    // })
    // map.addLayer({
    //     "id": "lidar",
    //     type: 'hillshade',
    //     source: 'lidar',
    //     paint: {
    //         'hillshade-method': 'multidirectional',
    //         'hillshade-highlight-color': ['#FF4000', '#FFFF00', '#40FF00', '#00FF80'],
    //         'hillshade-shadow-color': ['#00BFFF', '#0000FF', '#BF00FF', '#FF0080'],
    //         'hillshade-illumination-direction': [270, 315, 0, 45],
    //         'hillshade-illumination-altitude': [30, 30, 30, 30],
    //     }
    // })
    // map.addLayer({
    //     id: 'hillshade',
    //     type: 'hillshade',
    //     source: 'lidar',
    //     paint: { 'hillshade-exaggeration': 0.5 }
    // })
    //map.setTerrain({ source: 'lidar', exaggeration: 1 });
    // map.addControl(new maplibregl.TerrainControl({
    //     source: 'lidar',
    //     exaggeration: 1
    // }));
    // map.addLayer({
    //     id: "batiments_ign",
    //     type: "fill",
    //     source: "bdTopo",
    //     'source-layer': "batiment",
    //     paint: {
    //         "fill-color": "rgb(255, 0, 0)",
    //     }
    // })
  }
}

const batiment3d = new Batiment3d();
export default batiment3d;
