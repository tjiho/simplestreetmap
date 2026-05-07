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
  }

  onLoadOrNow(fn) {
    if (this.loaded()) {
      fn();
    } else {
      this.on("load", fn);
    }
  }
}

const map = new Map();
export default map;
