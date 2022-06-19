import { useEffect, useRef } from "react";
import {MarkerParams, Marker as IBaseMarker} from "wavesurfer.js/src/plugin/markers";
import {EventHandler} from "wavesurfer.js/types/util";
import useWavesurferContext from "../hooks/useWavesurferContext";

export interface IMarker extends IBaseMarker {
    el?: HTMLDivElement;
}

export interface MarkerProps extends MarkerParams {
    draggable?: boolean;
    onClick?: EventHandler;
    onDrop?: EventHandler;
    onDrag?: EventHandler;
}

// TODO: remove boilerplate in useEffects section, try to update useRegionEvent to support
//  all kinds of event handling within WaveSurfer ecosystem
export default function Marker({ onClick, onDrop, onDrag, ...data }: MarkerProps) {
    const ws = useWavesurferContext();

    // TODO: make some kind of useGetLatestWs...
    const ws$ = useRef(ws);
    useEffect(() => {
        ws$.current = ws;
    }, [ws])

    // This is the only legal/official way to identify marker
    // inside wavesurfer markers list and
    // to tie it with Marker component
    const isRendered = useRef<boolean>(false);
    const markerEl = useRef<IMarker | null>(null);

    useEffect(() => {
        if (!ws) return;

        if (!onClick) return;

        function handler (marker: IMarker, event: Event) {
            if (!markerEl.current) return;

            if (marker.el !== markerEl.current.el) return;

            onClick?.(marker, event);
        }

        ws.on("marker-click", handler);

        return () => {
            ws.un("marker-click", handler);
        };
    }, [ws, onClick]);

    useEffect(() => {
        if (!ws) return;

        if (!onDrag) return;

        function handler (marker: IMarker, event: Event) {
            if (!markerEl.current) return;

            if (marker.el !== markerEl.current.el) return;

            onDrag?.(marker, event);
        }

        ws.on("marker-drag", handler);

        return () => {
            ws.un("marker-drag", handler);
        };
    }, [ws, onDrag]);

    useEffect(() => {
        if (!ws) return;

        if (!onDrop) return;

        function handler (marker: IMarker, event: Event) {
            if (!markerEl.current) return;

            if (marker.el !== markerEl.current.el) return;

            onDrop?.(marker, event);
        }

        ws.on("marker-drop", handler);

        return () => {
            ws.un("marker-drop", handler);
        };
    }, [ws, onDrop]);

    useEffect(() => {
        if (!ws) return;
        // THERE CAN BE ONLY ONE
        // ...
        // ...
        // ...
        // marker creation for each Marker component.
        // If there is a better way, PRs welcome!
        if (isRendered.current) return;

        isRendered.current = true;

        // create marker: marker becomes visible at the same time
        markerEl.current = ws.addMarker(data);
    }, [ws]);

    useEffect(() => {
        if (!ws || !markerEl.current || !isRendered.current) return;

        // Проверяем что изменения реально имели место быть,
        // но снаружи, а не внутри
        // На данный момент, меняется только позиция
        if (data.time === markerEl.current?.time) return;

        // When wavesurfer will officially make markers fully updatable,
        // then it will be done in other way, for now it's enough.
        //
        // For enthusiasts, it is possible to deep dive into the process of marker creation and make a PR,
        // that will add full marker update support.
        // https://wavesurfer-js.org/api/file/src/plugin/markers/index.js.html

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const marker = ws.markers.markers.find(mark => mark.el === markerEl.current?.el);

        if (!marker) return;

        marker.time = data.time;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ws.markers._updateMarkerPosition({
            ...markerEl.current,
            time: data.time
        });
    }, [data?.time])

    // Maybe it will require to create some single source of truth for Markers,
    // as far as they are working via wavesurfer instance. That's making'em
    // different from Regions in the way of working.
    useEffect(() => () => {
        if (!ws$.current || !markerEl.current) return;

        const index = ws$.current.markers.markers.findIndex((marker: IMarker) => {
            return marker.el === markerEl.current?.el;
        });

        ws$.current.markers.remove(index);
   }, [])

    return null;
}
