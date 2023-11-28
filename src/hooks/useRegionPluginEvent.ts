import { useEffect, useRef } from "react";
import RegionsPlugin, { RegionsPluginEvents } from "wavesurfer.js/dist/plugins/regions";

import { EventListener } from "../types";

export type RegionPluginEventListener = (...rest: Parameters<EventListener<RegionsPluginEvents, keyof RegionsPluginEvents>>) => void;

// TODO: try to merge it with useRegionEvent
function useRegionPluginEvent<K extends keyof RegionsPluginEvents>(
  ref: RegionsPlugin | null | undefined,
  eventName: K,
  callback?: RegionPluginEventListener
) {
  const callbackRef = useRef<EventListener<RegionsPluginEvents, keyof RegionsPluginEvents> | null>(null);

  useEffect(() => {
    if (!ref) {
      return;
    }

    if (callback) {
      callbackRef.current = (...args) => callback(...args);

      ref.on(eventName, callbackRef.current);
    }

    return () => {
      callbackRef.current && ref.un(eventName, callbackRef.current);
      callbackRef.current = null;
    };
  }, [ref, eventName, callback]);
}

export default useRegionPluginEvent;
