// AbstractLineLayer.js
import AbstractLayer from "./AbstractLayer.js";
import {
  buildBorderLayer,
  buildFillLayer,
  buildDashedCenterLayer,
} from "../../tools/layers.js";

export default class AbstractLineLayer extends AbstractLayer {
  constructor({ source, sourceLayer, sourceConfig, baseWidth, baseStyle }) {
    super({ baseStyle });
    this._source = source;
    this._sourceLayer = sourceLayer;
    this._baseWidth = baseWidth;

    if (sourceConfig) {
      this.addSource(source, sourceConfig);
    }
  }

  get _defaultLayerProperties() {
    return {
      source: this._source,
      sourceLayer: this._sourceLayer,
      width: this._baseWidth,
    };
  }

  border(options) {
    return buildBorderLayer({ ...this._defaultLayerProperties, ...options });
  }

  fill(options) {
    return buildFillLayer({ ...this._defaultLayerProperties, ...options });
  }

  dashedCenter(options) {
    return buildDashedCenterLayer({
      ...this._defaultLayerProperties,
      ...options,
    });
  }

  solidLane({ id, filter, color, outlineColor = "#FFFFFF" }) {
    return [
      this.border({ id, filter, color: outlineColor }),
      this.fill({ id, filter, color }),
    ];
  }

  dashedLanePrimary({
    id,
    filter,
    color,
    innerColor = "#FFFFFF",
    detailZoom = 13,
    dashArray = [3, 3],
    overviewDashArray = [1, 2],
  }) {
    return [
      this.border({ id, filter, color, minzoom: detailZoom }),
      this.fill({ id, filter, color: innerColor, minzoom: detailZoom }),
      this.dashedCenter({ id, filter, color, dashArray, minzoom: detailZoom }),
      // Zoom faible : juste les pointillés à la largeur de la base
      this.fill({
        id: id + "-overview",
        filter,
        color,
        maxzoom: detailZoom,
      }),
      // Zoom élevé : style complet
    ];
  }

  dashedLaneWithoutborder({
    id,
    filter,
    color,
    innerColor = "#FFFFFF",
    detailZoom = 13,
    dashArray = [3, 3],
    overviewDashArray = [1, 2],
  }) {
    return [
      this.fill({ id, filter, color: innerColor }),
      this.dashedCenter({ id, filter, color, dashArray, minzoom: detailZoom }),
      // Zoom faible : juste les pointillés à la largeur de la base
      this.dashedCenter({
        id: id + "-overview",
        filter,
        color,
        dashWidth: this._baseWidth,
        dashArray: overviewDashArray,
        maxzoom: detailZoom,
      }),
      // Zoom élevé : style complet
    ];
  }

  borderLane({ id, filter, color, innerColor = "#FFFFFF", detailZoom = 13 }) {
    return [
      this.border({ id, filter, color, minzoom: detailZoom }),
      this.fill({ id, filter, color: innerColor }),
      // Zoom élevé : style complet
    ];
  }

  addLayers(layers) {
    for (const layer of layers) {
      this.addLayer(layer);
    }
  }
}
