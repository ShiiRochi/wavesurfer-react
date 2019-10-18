import { useEffect, useRef, useMemo } from 'react';

const useRegionEvent = (ref, eventName, callback) => {
    const callbackRef = useRef(null);

    useEffect(() => {
        if (!ref) {
            return ;
        }

        if (callback) {
            console.log(`Event: ${eventName} is set for region: ${ref.id}`);
            callbackRef.current = callback;

            ref.on(eventName, callbackRef.current);
        }
        return () => {
            console.log(`Event: ${eventName} is removed from region: ${ref.id}`);
            ref.un(eventName, callbackRef.current);
            callbackRef.current = null;
        };

    }, [ref, eventName, callback]);
};

export default useRegionEvent;
