// Bicycle.js
import AbstractLineLayer from "./AbstractLineLayer.js";

class Bicycle extends AbstractLineLayer {
  constructor() {
    super({
      source: "velo",
      sourceLayer: "velo",
      sourceConfig: {
        type: "vector",
        url: "pmtiles://https://static.ppsfleet.navy/osm-data/velo.pmtiles",
      },
      baseWidth: [
        [5, 1],
        [13, 2],
        [15, 6],
        [17, 8],
        [19, 20],
      ],
      baseStyle: "https://static.ppsfleet.navy/osm-data/styles/positron.json",
    });

    this.beforeLayer = "waterway-name";

    const pisteFilter = ["==", "cat", "1.1"];
    const bandeFilter = ["==", "cat", "1.2"];

    // #1E88E5
    // #FFA726
    this.addLayers([
      ...this.borderLane({
        id: "rue-paisible",
        filter: ["==", "cat", "2.1"],
        //color: "#949494",
        color: "#9DAEFF",
      }),

      ...this.dashedLanePrimary({
        id: "partage-voiture",
        filter: ["==", "cat", "4"],
        color: "#1E88E5",
      }),

      ...this.borderLane({
        id: "partage-pieton-tertiary",
        filter: ["==", "cat", "3.3"],
        color: "#AB47BC",
      }),

      ...this.dashedLaneSecondary({
        id: "partage-pieton-secondary",
        filter: ["==", "cat", "3.2"],
        //color: "#a885ab",
        color: "#AB47BC",
      }),

      ...this.dashedLanePrimary({
        id: "partage-pieton-main",
        filter: ["==", "cat", "3.1"],
        color: "#AB47BC",
      }),

      ...this.dashedLanePrimary({
        id: "bande",
        filter: ["==", "cat", "1.2"],
        color: "#4ECA00",
      }),
      ...this.solidLanePrimary({
        id: "piste",
        filter: ["==", "cat", "1.1"],
        color: "#4ECA00",
      }),
    ]);
  }
}

export default new Bicycle();
