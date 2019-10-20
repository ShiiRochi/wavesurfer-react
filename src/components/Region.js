import { useContext, useState, useEffect, useRef } from 'react';
import useRegionEvent from "../hooks/useRegionEvent";
import WaveSurferContext from "../contexts/WaveSurferContext";

export const Region = ({ onOver, onLeave, onClick, onDoubleClick, onIn, onOut, onRemove, onUpdate, onUpdateEnd, ...props }) => {
    const waveSurfer = useContext(WaveSurferContext);

    const isRenderedCache = useRef(false);

    const [regionRef, setRegionRef] = useState(null);

    useEffect(() => {
        return () => {
            if (regionRef) {
                regionRef.remove();
            }
        }
    }, [regionRef])

    useEffect(() => {
        if (!isRenderedCache.current && waveSurfer) {
            isRenderedCache.current = true;

            let region = waveSurfer.addRegion(props);

            setRegionRef(region);
        }
        // eslint-disable-next-line
    }, [waveSurfer]);

    useRegionEvent(regionRef, 'click', onClick);

    useRegionEvent(regionRef, 'over', onOver);

    useRegionEvent(regionRef, 'leave', onLeave);

    useRegionEvent(regionRef, 'dbclick', onDoubleClick)

    useRegionEvent(regionRef, 'in', onIn)

    useRegionEvent(regionRef, 'out', onOut)

    useRegionEvent(regionRef, 'remove', onRemove)

    useRegionEvent(regionRef, 'update', onUpdate);

    useRegionEvent(regionRef, 'update-end', onUpdateEnd)

    return null;
};

export default Region;
