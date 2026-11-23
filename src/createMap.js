import {
  createMap,
  LayerSelection,
  Poi,
  Satellite,
  Batiment3d,
  Bicycle,
} from "esquisse";
import { Places, setPlaces } from "./singletons/places.js";
import poiPanel from "./singletons/poiPanel.js";
import parseHashCoordinates from "./tools/parseHashCoordinates.js";
import { render, html } from "./libs/preact.mjs";
import PoiViewer from "./components/PoiViewer.js";
import Camera from "./layers/Camera.js";

const params = new URLSearchParams(window.location.search);
const { lng, lat, zoom } = parseHashCoordinates(
  params.get("map") || "",
  DEFAULT_CENTER[0],
  DEFAULT_CENTER[1],
  DEFAULT_ZOOM,
);

export const map = createMap({
  maplibre: window.maplibregl,
  pmtiles: window.pmtiles,
  container: "map",
  baseStyle: BASE_MAP_URL,
  center: [lng, lat],
  zoom,
  syncUrl: true,
  globe: true,
});

export const poiLayer = new Poi({ map, sourceUrl: POI_TILES_URL });

export const layerSelection = new LayerSelection({
  map,
  baseStyle: BASE_MAP_URL,
  layers: {
    satellite: {
      layer: new Satellite({
        map,
        baseStyle: BASE_MAP_URL,
        tiles: [SATELLITE_TILES_URL],
      }),
      name: "Satellite",
    },
    batiment3d: {
      layer: new Batiment3d({
        map,
        baseStyle: BASE_MAP_URL,
        tiles: [BATIMENT3D_TILES_URL],
      }),
      name: "Batiment 3d",
    },
    bicycle: {
      layer: new Bicycle({
        map,
        sourceUrl: BICYCLE_TILES_URL,
        baseStyle: BICYCLE_BASE_STYLE_URL,
      }),
      name: "Vélo (alpha)",
    },
    camera: {
      layer: new Camera({
        map,
        sourceUrl: CAMERA_TILES_URL,
        baseStyle: BASE_MAP_URL,
      }),
      name: "Caméras",
    },
  },
});

// Les POI masqueraient les caméras : on les cache quand ce layer est actif.
layerSelection.subscribe((active) => {
  if (active === "camera") poiLayer.hide();
  else poiLayer.show();
});

setPlaces(new Places({ map }));

poiLayer.onClick((feature) => {
  if (!feature) {
    poiPanel.close();
    return;
  }
  const container = document.createElement("div");
  render(html`<${PoiViewer} feature=${feature} />`, container);
  poiPanel.open(container);
});

// Registered after poiLayer: its handler closes the panel on empty clicks,
// this one only opens it when a camera is hit.
layerSelection.layers.camera.layer.onClick((feature) => {
  if (!feature) return;
  const container = document.createElement("div");
  render(html`<${PoiViewer} feature=${feature} />`, container);
  poiPanel.open(container);
});
