import { createMap } from "./singletons/map.js";
import { createLayerSelection } from "./singletons/layerSelection.js";
import { Places, setPlaces } from "./singletons/places.js";
import poiPanel from "./singletons/poiPanel.js";
import PoiLayer from "./singletons/layers/poi.js";
import { enablePoiClick } from "./tools/enablePoiClick.js";
import parseHashCoordinates from "./tools/parseHashCoordinates.js";
import { render, html } from "./libs/preact.mjs";
import PoiViewer from "./components/PoiViewer.js";

const params = new URLSearchParams(window.location.search);
const { lng, lat, zoom } = parseHashCoordinates(
  params.get("map") || "",
  1.4436,
  43.6042,
  13,
);

const map = createMap({
  maplibre: window.maplibregl,
  pmtiles: window.pmtiles,
  container: "map",
  baseStyle: BASE_MAP_URL,
  center: [lng, lat],
  zoom,
  syncUrl: true,
  globe: true,
});

const poiLayer = new PoiLayer({ map });

createLayerSelection({ map, baseStyle: BASE_MAP_URL });

setPlaces(new Places({ map }));

const poiEvents = enablePoiClick(map, poiLayer);
poiEvents.addEventListener("poi:select", (e) => {
  const { feature } = e.detail;
  const container = document.createElement("div");
  render(html`<${PoiViewer} feature=${feature} />`, container);
  poiPanel.open(container);
});
poiEvents.addEventListener("poi:close", () => {
  poiPanel.close();
});

export { map, poiLayer };
