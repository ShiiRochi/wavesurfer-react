import {useEffect, useRef, useState} from "react";
import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import createWavesurfer, {WaveSurfer as WaveSurferRef, WaveSurfer} from "../utils/createWavesurfer";
import createPlugin from "../utils/createPlugin";
import getDifference from "../utils/getDifference";
import { PluginType } from "../types";

export type UseWaveSurferParams<GPlug extends GenericPlugin> = {
    container?: string | HTMLElement,
    plugins: PluginType<GPlug>[],
    onMount: (wavesurferRef: null | WaveSurferRef) => any
};

export type PluginDictionary<GPlug extends GenericPlugin> = Record<string, GPlug>;


function createPluginsMap<GPlug extends GenericPlugin>(curr: PluginDictionary<GPlug>, plugins: PluginType<GPlug>[]): PluginDictionary<GPlug> {
    const result: PluginDictionary<GPlug> = {};

    const stack = [...plugins];

    while (stack.length >= 1) {
        const node = stack.shift()!;

        const hasThisPluginAlready = !!curr[node.key];

        if (hasThisPluginAlready) {
            result[node.key] = curr[node.key]!;
        } else {
            result[node.key] = createPlugin(node);
        }
    }

    return result;
}

export default function useWavesurfer<GPlug extends GenericPlugin>({ container, plugins = [], onMount, ...props }: UseWaveSurferParams<GPlug>) {
    const [pluginsMap, setPluginsMap] = useState<PluginDictionary<GPlug>>({});
    // is used to keep track of initialized plugins
    const initialized$ = useRef<string[]>([]);

    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

    useEffect(() => {
        if (!container) return;

        const _plugins = createPluginsMap(pluginsMap, plugins);

        initialized$.current = Object.keys(_plugins);

        const ws = createWavesurfer({
            container,
            ...props,
            plugins: Object.values(_plugins),
        })

        onMount?.(ws);

        setPluginsMap(_plugins);
        setWavesurfer(ws);

        return () => {
            ws.destroy();
        };
    }, [container]);

    useEffect(() => {
        if (wavesurfer) {
            const _plugins = createPluginsMap(pluginsMap, plugins);

            const { disabled, enabled } = getDifference(
              pluginsMap,
              _plugins
            );

            // destroy plugin, wavesurfer self removes it from plugin array
            Object.keys(disabled).forEach(plugKey => {
                disabled[plugKey]!.destroy();
            })

            Object.keys(enabled).forEach((pluginKey) => {
                // do not initialize plugin under the same key twice or more times
                if (initialized$.current.includes(pluginKey)) return;

                console.log('register plugin', pluginKey, enabled[pluginKey]);

                wavesurfer?.registerPlugin(enabled[pluginKey]!);
            });

            // register only enabled plugins
            initialized$.current = Object.keys(enabled);

            setPluginsMap(_plugins);
        }
    }, [plugins]);

    return [wavesurfer as WaveSurfer, pluginsMap, Object.values(pluginsMap)] as const;
}
