import satellite from "./layers/sattelite.js";
import batiment3d from "./layers/batiment3d.js";
import bicycle from "./layers/bicycle.js";
import plan from "./layers/plan.js";

class LayerSelection {
  constructor() {
    this.layers = {
      plan: { layer: plan, name: "Plan" },
      satellite: { layer: satellite, name: "Satellite" },
      batiment3d: { layer: batiment3d, name: "Batiment 3d" },
      bicycle: { layer: bicycle, name: "Vélo (alpha)" },
    };
    this.active = "plan";
    this._listeners = new Set();
  }

  get current() {
    return this.layers[this.active]?.layer;
  }

  setActive(key) {
    if (key === this.active) return;
    this.active = key;
    this._listeners.forEach((fn) => fn(this.active));
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }
}

export default new LayerSelection();
