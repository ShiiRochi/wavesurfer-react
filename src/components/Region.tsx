import { useEffect, useRef, useState } from "react";
import {
  Region as RegionWS,
  RegionParams,
} from "wavesurfer.js/src/plugin/regions";
import { EventHandler } from "wavesurfer.js/types/util";
import useRegionEvent from "../hooks/useRegionEvent";
import useWavesurferContext from "../hooks/useWavesurferContext";

export interface RegionProps extends RegionParams {
  onClick?: EventHandler;
  onOver?: EventHandler;
  onLeave?: EventHandler;
  onDoubleClick?: EventHandler;
  onIn?: EventHandler;
  onOut?: EventHandler;
  onRemove?: EventHandler;
  onUpdate?: EventHandler;
  onUpdateEnd?: EventHandler;
  id: string;
}
export const Region = ({
  onOver,
  onLeave,
  onClick,
  onDoubleClick,
  onIn,
  onOut,
  onRemove,
  onUpdate,
  onUpdateEnd,
  ...props
}: RegionProps) => {
  const waveSurfer = useWavesurferContext();

  const isRenderedCache = useRef(false);

  const [regionRef, setRegionRef] = useState<RegionWS | null>(null);

  useEffect(() => {
    return () => {
      if (regionRef) {
        regionRef.remove();
      }
    };
  }, [regionRef]);

  // TODO: may need some improvements
  useEffect(
    () => {
      if (regionRef) {
        const update = UpdatableRegionProps.reduce<RegionParams>(
          (result, prop) => {
            if (regionRef[prop] !== props[prop]) {
              return {
                ...result,
                [prop]: props[prop],
              };
            }

            return result;
          },
          { id: props.id }
        );

        regionRef.update(update);
      }
    },
    UpdatableRegionProps.map((prop) => props[prop as keyof RegionParams])
  );

  useEffect(() => {
    if (!isRenderedCache.current && waveSurfer) {
      isRenderedCache.current = true;

      let region;

      region = waveSurfer.regions.list[props.id];

      if (!region) {
        region = waveSurfer.addRegion(props);
      }

      setRegionRef(region);
    }
    // eslint-disable-next-line
  }, [waveSurfer]);

  useRegionEvent(regionRef, "click", onClick);

  useRegionEvent(regionRef, "mouseenter", onOver);

  useRegionEvent(regionRef, "mouseleave", onLeave);

  useRegionEvent(regionRef, "dblclick", onDoubleClick);

  useRegionEvent(regionRef, "in", onIn);

  useRegionEvent(regionRef, "out", onOut);

  useRegionEvent(regionRef, "remove", onRemove);

  useRegionEvent(regionRef, "update", onUpdate);

  useRegionEvent(regionRef, "update-end", onUpdateEnd);

  return null;
};

export default Region;

const UpdatableRegionProps: [
  "start",
  "end",
  "loop",
  "color",
  "handleStyle",
  "resize",
  "drag",
  "drag",
  "end",
  "handleStyle",
  "id",
  "loop",
  "preventContextMenu",
  "resize",
  "start"
] = [
  "start",
  "end",
  "loop",
  "color",
  "handleStyle",
  "resize",
  "drag",
  "drag",
  "end",
  "handleStyle",
  "id",
  "loop",
  "preventContextMenu",
  "resize",
  "start",
];
