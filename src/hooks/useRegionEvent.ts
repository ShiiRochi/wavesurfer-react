import { useEffect, useRef } from "react";
import { Region, RegionEvents } from "wavesurfer.js/dist/plugins/regions";

import { EventListener } from "../types";

export type RegionEventListener = (region: Region, ...rest: Parameters<EventListener<RegionEvents, keyof RegionEvents>>) => void;

function useRegionEvent<K extends keyof RegionEvents>(
  ref: Region | null | undefined,
  eventName: K,
  callback?: RegionEventListener
) {
  const callbackRef = useRef<EventListener<RegionEvents, keyof RegionEvents> | null>(null);

  useEffect(() => {
    if (!ref) {
      return;
    }

    if (callback) {
      callbackRef.current = (...args) => callback(ref, ...args);

      ref.on(eventName, callbackRef.current);
    }

    return () => {
      callbackRef.current && ref.un(eventName, callbackRef.current);
      callbackRef.current = null;
    };
  }, [ref, eventName, callback]);
}

export default useRegionEvent;
