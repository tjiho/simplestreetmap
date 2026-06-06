import { searchByCoords } from "../api/search.js";

export class Places {
  constructor({ map, container }) {
    this.map = map;
    this.parent = container || document.getElementById("places");
    this.selected = [];
    this.OnSelected = [];
    this.abortControllers = new Map();

    const currentPlaces = new URLSearchParams(window.location.search).getAll(
      "places",
    );

    map.on("load", () => {
      currentPlaces.forEach((place) => {
        const args = place.split(",");
        this.add(+args[0], +args[1], args[2]);
      });
    });

    map.on("contextmenu", (e) => {
      this.add(e.lngLat.lat, e.lngLat.lng);
    });
  }

  add(lat, lng, name) {
    const element = document.createElement("c-place");
    if (name) {
      element.setAttribute("name", name);
    } else {
      const controller = new AbortController();
      const key = `${lat},${lng}`;
      this.abortControllers.set(key, controller);

      searchByCoords(lat, lng, controller.signal)
        .then((value) => {
          element.setAttribute("name", value.features[0].properties.label);
          this.abortControllers.delete(key);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Reverse search failed:", error);
          }
          this.abortControllers.delete(key);
        });
    }

    this.parent.appendChild(element);
    element.coordinates = { lat, lng };

    element.addEventListener("click", (e) => {
      this.selectPlace(e, element);
    });

    return element;
  }

  selectPlace(event, element) {
    this.selected.forEach((el) => el.removeAttribute("selected"));
    this.selected = [];
    element.setAttribute("selected", "");
    this.selected.push(element);
  }
}

let _instance = null;

export function setPlaces(instance) {
  _instance = instance;
  return instance;
}

// Compat singleton pour useSearch.js qui fait `import places from "..."`.
const proxy = {
  add(...args) {
    if (!_instance) {
      throw new Error(
        "places singleton not initialized — call setPlaces() in the bootstrap first.",
      );
    }
    return _instance.add(...args);
  },
};

export default proxy;
