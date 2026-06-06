export function enablePoiClick(map, poiLayer) {
  const target = new EventTarget();

  map.onLoadOrNow(() => {
    map.on("click", (e) => {
      const bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5],
      ];
      const features = map.queryRenderedFeatures(bbox, {
        layers: poiLayer.layersIds,
      });

      if (!features.length) {
        target.dispatchEvent(new CustomEvent("poi:close"));
        return;
      }

      target.dispatchEvent(
        new CustomEvent("poi:select", {
          detail: { feature: features[0], lngLat: e.lngLat },
        }),
      );
    });

    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: poiLayer.layersIds,
      });
      map.getCanvas().style.cursor = features.length ? "pointer" : "";
    });
  });

  return target;
}
