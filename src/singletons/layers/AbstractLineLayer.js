// AbstractLineLayer.js
import AbstractLayer from "./AbstractLayer.js";
import {
  buildBorderLayer,
  buildFillLayer,
  buildDashedCenterLayer,
} from "../../tools/layers.js";
import { html } from "../../libs/preact.mjs";
import { legendSample } from "../../tools/legend.js";

export default class AbstractLineLayer extends AbstractLayer {
  constructor({ source, sourceLayer, sourceConfig, baseWidth, baseStyle }) {
    super({ baseStyle });
    this._source = source;
    this._sourceLayer = sourceLayer;
    this._baseWidth = baseWidth;
    this.lines = [];

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

  solidLanePrimary({ id, filter, color, outlineColor = "#FFFFFF" }) {
    return [
      this.border({ id, filter, color: outlineColor, borderWidth: 1 }),
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
      this.border({ id, filter, color, minzoom: detailZoom, borderWidth: 2 }),
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

  dashedLaneSecondary({
    id,
    filter,
    color,
    innerColor = "#FFFFFF",
    detailZoom = 13,
    dashArray = [3, 3],
    overviewDashArray = [1, 2],
  }) {
    return [
      this.border({ id, filter, color, minzoom: detailZoom, borderWidth: 1 }),
      this.fill({ id, filter, color: innerColor, minzoom: detailZoom }),
      this.dashedCenter({ id, filter, color, dashArray, minzoom: detailZoom }),
      // Zoom faible : juste les pointillés à la largeur de la base
      this.fill({
        id: id + "-overview",
        filter,
        color: "#FFF",
        maxzoom: detailZoom,
      }),
      this.dashedCenter({ id, filter, color, dashArray, minzoom: detailZoom }),
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
      this.border({ id, filter, color, minzoom: detailZoom, borderWidth: 1 }),
      this.fill({ id, filter, color: innerColor }),
      // Zoom élevé : style complet
    ];
  }

  addLayers(layers) {
    for (const layer of layers) {
      this.addLayer(layer);
    }
  }

  _buildItemLayers(item) {
    switch (item.style) {
      case "solidLanePrimary":
        return this.solidLanePrimary(item);
      case "dashedLanePrimary":
        return this.dashedLanePrimary(item);
      case "dashedLaneSecondary":
        return this.dashedLaneSecondary(item);
      case "borderLane":
        return this.borderLane(item);
      default:
        throw new Error(`Unknown line style: ${item.style}`);
    }
  }

  buildLayers() {
    for (const group of this.lines) {
      for (const item of group.items) {
        this.addLayers(this._buildItemLayers(item));
      }
    }
  }

  legend() {
    const groups = [...this.lines].reverse();
    return html`
      <ul class="layer-legend">
        ${groups.map(
          (group) => html`
            <li class="layer-legend__group">
              <h3 class="layer-legend__category">${group.category}</h3>
              <ul class="layer-legend__items">
                ${[...group.items].reverse().map(
                  (item) => html`
                    <li class="layer-legend__item">
                      ${legendSample(item)}
                      <span class="layer-legend__label">${item.label}</span>
                    </li>
                  `,
                )}
              </ul>
            </li>
          `,
        )}
      </ul>
    `;
  }
}
