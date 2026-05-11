import parseHashCoordinates from "../tools/parseHashCoordinates.js";

class Map extends maplibregl.Map {
  constructor() {
    console.log("Init map");
    const params = new URLSearchParams(window.location.search);
    const { lng, lat, zoom } = parseHashCoordinates(
      params.get("map") || "",
      1.4436,
      43.6042,
      13,
    );

    const protocol = new pmtiles.Protocol({ metadata: true });
    maplibregl.addProtocol("pmtiles", protocol.tile);

    super({
      container: "map",
      style: BASE_MAP_URL,
      center: [lng, lat],
      zoom,
    });
    this.currentStyleUrl = BASE_MAP_URL;

    const nav = new maplibregl.NavigationControl();

    const gps = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    const scale = new maplibregl.ScaleControl({
      maxWidth: 80,
      unit: "metric",
    });

    this.addControl(nav, "bottom-right");
    this.addControl(gps, "bottom-right");
    this.addControl(scale);

    this.on("moveend", function () {
      const { lng, lat } = map.getCenter();
      const zoom = map.getZoom();

      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("map", `${zoom}/${lat}/${lng}`);
      history.replaceState(
        null,
        null,
        `${document.location.pathname}?${searchParams}`,
      );
    });

    this.on("load", () => {
      this.setProjection({
        type: "globe",
      });
      document.getElementById("map").style.backgroundColor = "#000";
    });
  }

  onLoadOrNow(fn) {
    if (this.loaded()) {
      fn();
    } else {
      this.on("load", fn);
    }
  }

  changeBaseMap(url) {
    return new Promise((resolve) => {
      console.log("plop", url, this.currentStyleUrl);
      if (this.currentStyleUrl === url) {
        resolve();
        return;
      }
      this.setStyle(url, {
        diff: false,
        transformStyle: (previous, next) => ({
          ...next,
          sources: {
            ...next.sources,
            ...Object.fromEntries(
              Object.entries(previous.sources).filter(([id]) =>
                id.startsWith("custom-"),
              ),
            ),
          },
          layers: [
            ...next.layers,
            ...previous.layers.filter((l) => l.id.startsWith("custom-")),
          ],
        }),
      });
      this.currentStyleUrl = url;
      map.once("style.load", resolve);
    });
  }
}

const map = new Map();
export default map;
