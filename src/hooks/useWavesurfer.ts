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

function createPlugins<GPlug extends GenericPlugin>(curr: GPlug[], next: PluginType<GPlug>[]): GPlug[] {
    const result: GPlug[] = [];

    const stack = [...next];

    while (stack.length >= 1) {
        const node = stack.shift()!;

        // @ts-expect-error currently it is okay
        const currPluginInstanceIndex = curr.findIndex(plug => plug instanceof node.plugin);

        if (currPluginInstanceIndex !== -1) {
            result.push(curr[currPluginInstanceIndex] as GPlug);
        } else {
            result.push(createPlugin(node));
        }
    }

    return result;
}

export default function useWavesurfer<GPlug extends GenericPlugin>({ container, plugins = [], onMount, ...props }: UseWaveSurferParams<GPlug>) {
    const [pluginsMap, setPluginsMap] = useState<GPlug[]>([]);

    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

    useEffect(() => {
        if (!container) return;

        const _plugins: GPlug[] = createPlugins(pluginsMap, plugins);

        const ws = createWavesurfer({
            container,
            ...props,
            plugins: _plugins,
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
            const _plugins: GPlug[] = createPlugins(pluginsMap, plugins);

            const { disabled, enabled } = getDifference(
              pluginsMap,
              _plugins
            );

            // destroy plugin, wavesurfer self removes it from plugin array
            disabled.forEach(plug => plug.destroy())

            enabled.forEach((plugin) => {
                if (pluginsMap.findIndex(pl => pl === plugin) !== -1) return;

                console.log('register plugin', plugin);

                wavesurfer?.registerPlugin(plugin);
            });

            setPluginsMap(_plugins);
        }
    }, [plugins]);

    return [wavesurfer as WaveSurfer, pluginsMap] as const;
}
