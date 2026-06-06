import Plan from "./layers/plan.js";
import Sattelite from "./layers/sattelite.js";
import Batiment3d from "./layers/batiment3d.js";
import Bicycle from "./layers/bicycle.js";

export class LayerSelection {
  constructor({ map, baseStyle }) {
    this.layers = {
      plan: { layer: new Plan({ map, baseStyle }), name: "Plan" },
      satellite: { layer: new Sattelite({ map, baseStyle }), name: "Satellite" },
      batiment3d: { layer: new Batiment3d({ map, baseStyle }), name: "Batiment 3d" },
      bicycle: { layer: new Bicycle({ map }), name: "Vélo (alpha)" },
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
