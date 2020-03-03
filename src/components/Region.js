import { useContext, useState, useEffect, useRef } from "react";
import useRegionEvent from "../hooks/useRegionEvent";
import WaveSurferContext from "../contexts/WaveSurferContext";

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
}) => {
  const waveSurfer = useContext(WaveSurferContext);

  const isRenderedCache = useRef(false);

  const [regionRef, setRegionRef] = useState(null);

  useEffect(() => {
    return () => {
      if (regionRef) {
        regionRef.remove();
      }
    };
  }, [regionRef]);

  // TODO: may need some improvements
  useEffect(() => {
    if (regionRef) {
      let update = ["start", "end", "color", "data", "drag", "resize"].reduce(
        (result, prop) => {
          if (regionRef[prop] !== props[prop]) {
            return {
              ...result,
              [prop]: props[prop]
            };
          }

          return result;
        },
        {}
      );

      regionRef.update(update);
    }
  }, [
    props.start,
    props.end,
    props.color,
    props.data,
    props.resize,
    props.drag
  ]);

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

  useRegionEvent(regionRef, "over", onOver);

  useRegionEvent(regionRef, "leave", onLeave);

  useRegionEvent(regionRef, "dbclick", onDoubleClick);

  useRegionEvent(regionRef, "in", onIn);

  useRegionEvent(regionRef, "out", onOut);

  useRegionEvent(regionRef, "remove", onRemove);

  useRegionEvent(regionRef, "update", onUpdate);

  useRegionEvent(regionRef, "update-end", onUpdateEnd);

  return null;
};

export default Region;
