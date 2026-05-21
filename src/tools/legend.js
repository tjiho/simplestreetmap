// tools/legend.js
import { html } from "../libs/preact.mjs";

const WIDTH = 60;
const HEIGHT = 14;
const Y = HEIGHT / 2;

function svg(children) {
  return html`
    <svg
      viewBox="0 0 ${WIDTH} ${HEIGHT}"
      width=${WIDTH}
      height=${HEIGHT}
      xmlns="http://www.w3.org/2000/svg"
    >
      ${children}
    </svg>
  `;
}

function line(attrs) {
  return html`<line x1="0" y1=${Y} x2=${WIDTH} y2=${Y} ...${attrs} />`;
}

export function legendSample({ style, color }) {
  switch (style) {
    case "solidLanePrimary":
      // border 1px blanc + fill couleur
      return svg(html`
        ${line({ stroke: "white", "stroke-width": 10 })}
        ${line({ stroke: color, "stroke-width": 8 })}
      `);

    case "dashedLanePrimary":
      // border 2px couleur + fill blanc + pointillés couleur au centre
      return svg(html`
        ${line({ stroke: color, "stroke-width": 12 })}
        ${line({ stroke: "white", "stroke-width": 8 })}
        ${line({ stroke: color, "stroke-width": 2, "stroke-dasharray": "3 3" })}
      `);

    case "dashedLaneSecondary":
      // border 1px couleur + fill blanc + pointillés couleur au centre
      return svg(html`
        ${line({ stroke: color, "stroke-width": 10 })}
        ${line({ stroke: "white", "stroke-width": 8 })}
        ${line({ stroke: color, "stroke-width": 2, "stroke-dasharray": "3 3" })}
      `);

    case "borderLane":
      // border 1px couleur + fill blanc
      return svg(html`
        ${line({ stroke: color, "stroke-width": 10 })}
        ${line({ stroke: "white", "stroke-width": 8 })}
      `);

    default:
      throw new Error(`Unknown line style: ${style}`);
  }
}
