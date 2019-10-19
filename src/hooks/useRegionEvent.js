import { useEffect, useRef } from 'react';

const useRegionEvent = (ref, eventName, callback) => {
    const callbackRef = useRef(null);

    useEffect(() => {
        if (!ref) {
            return ;
        }

        if (callback) {
            callbackRef.current = callback;

            ref.on(eventName, callbackRef.current);
        }
        return () => {
            ref.un(eventName, callbackRef.current);
            callbackRef.current = null;
        };

    }, [ref, eventName, callback]);
};

export default useRegionEvent;
