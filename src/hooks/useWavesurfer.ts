import {useEffect, useRef, useState} from "react";
import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import createWavesurfer, {WaveSurfer as WaveSurferRef, WaveSurfer} from "../utils/createWavesurfer";
import createPlugin from "../utils/createPlugin";
import getDifference from "../utils/getDifference";
import { PluginType } from "../types";

type UseWaveSurferParams<GPlug extends GenericPlugin> = {
    container?: string | HTMLElement,
    plugins: PluginType<GPlug>[],
    onMount: (wavesurferRef: null | WaveSurferRef) => any
};

export default function useWavesurfer<GPlug extends GenericPlugin>({ container, plugins = [], onMount, ...props }: UseWaveSurferParams<GPlug>) {
    const usedPluginsListCache = useRef<GPlug[]>([]);
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

    useEffect(() => {
        if (!container) return;

        let _plugins: GPlug[] = [];
        // construct initial plugins list

        if (plugins) {
            _plugins = plugins.map(createPlugin);
        }

        usedPluginsListCache.current = _plugins;

        const ws = createWavesurfer({
            container,
            ...props,
            plugins: _plugins,
        })

        onMount?.(ws);

        setWavesurfer(ws);

        return () => {
            ws.destroy();
        };
    }, [container]);

    // TODO: update waveform appearance
    // useEffect(() => {}, [props]);

    // TODO: think about whether its place is this hook?
    useEffect(() => {
        if (wavesurfer) {
            const nextPluginsMap = plugins.map(p => createPlugin(p));

            const { disabled, enabled } = getDifference(
                usedPluginsListCache.current,
                nextPluginsMap
            );

            usedPluginsListCache.current = nextPluginsMap;

            const activePlugins = wavesurfer?.getActivePlugins();


            // destroy plugin, wavesurfer self removes it from plugin array
            disabled
              .map(plug => activePlugins?.find(p => p === plug))
              .forEach(plug => {plug?.destroy();})

            enabled.forEach((plugin) => wavesurfer?.registerPlugin(plugin));
        }
    }, [plugins]);

    return wavesurfer;
}
