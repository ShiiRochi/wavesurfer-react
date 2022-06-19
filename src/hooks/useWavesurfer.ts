import {useEffect, useRef, useState} from "react";
import { PluginDefinition } from "wavesurfer.js/types/plugin";
import createWavesurfer, {WaveSurfer as WaveSurferRef, WaveSurfer} from "../utils/createWavesurfer";
import createPlugin from "../utils/createPlugin";
import getDifference from "../utils/getDifference";
import { PluginType } from "../types";

type UseWaveSurferParams = {
    container?: string | HTMLElement,
    plugins: PluginType[],
    onMount: (wavesurferRef: null | WaveSurferRef) => any
};

export default function useWavesurfer({ container, plugins = [], onMount, ...props }: UseWaveSurferParams) {
    const usedPluginsListCache = useRef<PluginDefinition[]>([]);
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

    useEffect(() => {
        if (!container) return;

        let _plugins: PluginDefinition[] = [];
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
            const nextPluginsMap = plugins.map(createPlugin);

            const { disabled, enabled } = getDifference(
                usedPluginsListCache.current,
                nextPluginsMap
            );

            usedPluginsListCache.current = nextPluginsMap;

            disabled.forEach((plugin) => {
                if (!plugin.name) return;
                wavesurfer?.destroyPlugin(plugin.name);
            });

            enabled.forEach((plugin) => {
                if (!plugin.name) return;
                wavesurfer?.addPlugin(plugin).initPlugin(plugin.name);
            });
        }
    }, [plugins]);

    return wavesurfer;
}
