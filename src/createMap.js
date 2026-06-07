import { createMap, LayerSelection, Poi } from "esquisse";
import { Places, setPlaces } from "./singletons/places.js";
import poiPanel from "./singletons/poiPanel.js";
import parseHashCoordinates from "./tools/parseHashCoordinates.js";
import { render, html } from "./libs/preact.mjs";
import PoiViewer from "./components/PoiViewer.js";

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
  satellite: { tiles: [SATELLITE_TILES_URL] },
  batiment3d: { tiles: [BATIMENT3D_TILES_URL] },
  bicycle: { sourceUrl: BICYCLE_TILES_URL, baseStyle: BICYCLE_BASE_STYLE_URL },
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
