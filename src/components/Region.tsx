import { useEffect, useMemo, useRef, useState } from "react";
import RegionsPlugin, { Region as RegionWS, RegionParams } from "wavesurfer.js/plugins/regions";
import useRegionEvent, { RegionEventListener } from "../hooks/useRegionEvent";
import useWavesurferContext from "../hooks/useWavesurferContext";
import { UpdatableRegionProps } from "../constants/updatableRegionProps";
import useRegionPluginEvent, { RegionPluginEventListener } from "../hooks/useRegionPluginEvent";
import { isRegionsPlugin } from "../utils/isRegionsPlugin";

export interface RegionProps extends RegionParams {
  onClick?: RegionEventListener;
  onOver?: RegionEventListener;
  onLeave?: RegionEventListener;
  onDoubleClick?: RegionEventListener;
  onIn?: RegionPluginEventListener;
  onOut?: RegionPluginEventListener;
  onRemove?: RegionEventListener;
  onUpdate?: RegionEventListener;
  onUpdateEnd?: RegionEventListener;
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
  const [waveSurfer, ,plugins] = useWavesurferContext()!;

  const regPlugin = plugins.find((plugin) => isRegionsPlugin(plugin));

  const regionPlugin = useMemo(
    () => regPlugin,
    [plugins]
  );

  const isRenderedCache = useRef(false);

  const [regionRef, setRegionRef] = useState<RegionWS | null>(null);

  useEffect(() => {
    return () => {
      regionRef?.remove();
    };
  }, [regionRef]);

  useEffect(
    () => {
      // If there is a regionRef, then process update on any props update
      regionRef?.setOptions(UpdatableRegionProps.reduce(
        (result, prop) => {
          if (regionRef[prop] !== props[prop]) {
            return {
              ...result,
              [prop]: props[prop],
            };
          }

          return result;
        },
        { id: props.id } as Omit<RegionParams, 'minLength' | 'maxLength'>
      ));
    },
    UpdatableRegionProps.map((prop) => props[prop])
  );

  useEffect(() => {
    if (!isRenderedCache.current && waveSurfer) {
      isRenderedCache.current = true;

      let region = regionPlugin?.getRegions().find((r) => r.id === props.id);

      if (!region) {
        region = regionPlugin?.addRegion(props);
      }

      if (!region) return;

      setRegionRef(region);
    }
    // eslint-disable-next-line
  }, [waveSurfer, regionPlugin]);

  useRegionEvent(regionRef, "click", onClick);

  useRegionEvent(regionRef, "over", onOver);

  useRegionEvent(regionRef, "leave", onLeave);

  useRegionEvent(regionRef, "dblclick", onDoubleClick);

  useRegionPluginEvent(regionPlugin, "region-in", onIn);

  useRegionPluginEvent(regionPlugin, "region-out", onOut);

  useRegionEvent(regionRef, "remove", onRemove);

  useRegionEvent(regionRef, "update", onUpdate);

  useRegionEvent(regionRef, "update-end", onUpdateEnd);

  return null;
};

export default Region;
