import map from "./map.js";
import overpassSearch from "../tools/overpassSearch.js";
import poiPanel from "./poiPanel.js";
import PoiViewer from "../components/PoiViewer.js";

const POI_LAYERS = ["poi-named"];

class PoiInfo {
  constructor() {
    this.popup = null;
    this.controller = null;

    map.on("load", () => {
      this.addPoiLayer();

      map.on("click", (e) => this.handleClick(e));

      map.on("mousemove", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: POI_LAYERS,
        });
        map.getCanvas().style.cursor = features.length ? "pointer" : "";
      });
    });
  }

  addPoiLayer() {
    map.addSource("poi", {
      type: "vector",
      url: "pmtiles://https://static.ppsfleet.navy/osm-data/poi.pmtiles",
    });

    // map.addLayer({
    //   "id": "test-poi",
    //   "type": "circle",
    //   "source": "poi",
    //   "source-layer": "poi"
    // })

    const amenityIcons = {
      restaurant: "restaurant-11",
      cafe: "cafe-11",
      bar: "bar-11",
      pub: "beer-11",
      pharmacy: "pharmacy-11",
      hospital: "hospital-11",
      school: "school-11",
      bank: "bank-11",
      fast_food: "fast-food-11",
    };

    const iconExpression = [
      "match",
      ["get", "amenity"],
      ...Object.entries(amenityIcons).flat(),
      "marker-11", // fallback
    ];

    map.addLayer({
      id: "poi-named",
      type: "symbol",
      source: "poi",
      "source-layer": "poi",
      minzoom: 15,
      layout: {
        "icon-image": iconExpression,
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

    // map.addLayer({
    //   id: 'poi-named',
    //   type: 'symbol',
    //   source: 'poi',
    //   'source-layer': 'poi',
    //   minzoom: 15,
    //   filter: ['all', ['==', '$type', 'Point'], ['has', 'name']],
    //   layout: {
    //     'icon-image': ['match', ['get', 'amenity'],
    //       'restaurant', 'restaurant-11',
    //       'cafe', 'cafe-11',
    //       'fast_food', 'fast-food-11',
    //       'bar', 'bar-11',
    //       'bakery', 'bakery-11',
    //       'bank', 'bank-11',
    //       'pharmacy', 'pharmacy-11',
    //       'hospital', 'hospital-11',
    //       'school', 'school-11',
    //       'fuel', 'fuel-11',
    //       'parking', 'parking-11',
    //       'cinema', 'cinema-11',
    //       'theatre', 'theatre-11',
    //       'museum', 'museum-11',
    //       'hotel', 'lodging-11',
    //       'supermarket', 'grocery-11',
    //       'convenience', 'grocery-11',
    //       'clothes', 'clothing-store-11',
    //       'hairdresser', 'hairdresser-11',
    //       'place_of_worship', 'place-of-worship-11',
    //       'park', 'park-alt1-11',
    //       'library', 'library-11',
    //       'post_office', 'post-11',
    //       'police', 'police-11',
    //       'toilets', 'toilet-11',
    //       'marker2-11'
    //     ],
    //     'icon-size': 1,
    //     'icon-allow-overlap': false,
    //     'text-field': ['get', 'name'],
    //     'text-size': 12,
    //     'text-offset': [0, 1.2],
    //     'text-anchor': 'top',
    //     'text-max-width': 8,
    //     'text-optional': true
    //   },
    //   paint: {
    //     'text-color': '#333',
    //     'text-halo-color': '#fff',
    //     'text-halo-width': 1.5
    //   }
    // })
  }

  handleClick(e) {
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];
    const features = map.queryRenderedFeatures(bbox, { layers: POI_LAYERS });

    if (!features.length) {
      this.closePopup();
      poiPanel.close();
      return;
    }

    const feature = features[0];
    const viewer = new PoiViewer();
    viewer.feature = feature;
    poiPanel.open(viewer);
  }

  showPopup(coords, html) {
    this.closePopup();
    this.popup = new maplibregl.Popup({
      maxWidth: "320px",
      className: "poi-popup",
    })
      .setLngLat(coords)
      .setHTML(html)
      .addTo(map);
  }

  closePopup() {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }
  }
}

const poiInfo = new PoiInfo();
export default poiInfo;
