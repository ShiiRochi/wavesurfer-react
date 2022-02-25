import { useEffect, useRef } from "react";
import { Region } from "wavesurfer.js/src/plugin/regions";
import { EventHandler } from "wavesurfer.js/types/util";

const useRegionEvent = (
  ref: Region | null | undefined,
  eventName: string,
  callback?: EventHandler
) => {
  const callbackRef = useRef<EventHandler | null>(null);

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
};

export default useRegionEvent;
