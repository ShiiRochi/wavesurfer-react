import { useEffect, useRef, useCallback } from 'react';

const useRegionEvent = (ref, eventName, callback) => {
    const callbackRef = useRef(null);


    useEffect(() => {
        if (!ref) {
            return ;
        }

        if (callback) {
            callbackRef.current = (...args) => callback(ref, ...args);

            ref.on(eventName, callbackRef.current);
        }

        return () => {
            ref.un(eventName, callbackRef.current);
            callbackRef.current = null;
        };

    }, [ref, eventName, callback]);
};

export default useRegionEvent;
