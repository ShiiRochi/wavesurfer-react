import Types from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { WaveSurferParams } from "wavesurfer.js/types/params";
import { PluginDefinition } from "wavesurfer.js/types/plugin";
import WaveForm from "../components/WaveForm";
import WaveSurferContext from "../contexts/WaveSurferContext";
import createPlugin from "../utils/createPlugin";
import createWavesurfer from "../utils/createWavesurfer";
import getDifference from "../utils/getDifference";
import getWaveFormOptionsFromProps from "../utils/getWaveFormOptionsFromProps";

export interface PluginType {
  plugin: object;
  options: any;
  creator?: string;
}
export interface WaveSurferProps {
  children: JSX.Element[];
  plugins: PluginType[];
  onMount: (wavesurferRef: WaveSurfer) => any;
}
const WaveSurfer = ({ children, plugins = [], onMount }: WaveSurferProps) => {
  const usedPluginsListCache = useRef<PluginDefinition[]>([]);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);

  useEffect(() => {
    return () => {
      if (waveSurfer) {
        waveSurfer.destroy();
        setWaveSurfer(null);
      }
    };
  }, []);

  useEffect(() => {
    if (waveSurfer) {
      let nextPluginsMap = plugins.map(createPlugin);

      const { disabled, enabled } = getDifference(
        usedPluginsListCache.current,
        nextPluginsMap
      );

      usedPluginsListCache.current = nextPluginsMap;

      disabled.forEach((plugin) => {
        if (!plugin.name) return;
        waveSurfer.destroyPlugin(plugin.name);
      });

      enabled.forEach((plugin) => {
        if (!plugin.name) return;
        waveSurfer.addPlugin(plugin).initPlugin(plugin.name);
      });
    }
  }, [plugins]);

  useEffect(() => {
    let waveformProps: WaveSurferParams | null = null;

    // get timeline and waveform props
    React.Children.forEach(children, (element) => {
      const { props } = element;

      const { id, ...rest } = props;
      let derivedProps = null;
      if (element?.type === WaveForm) {
        derivedProps = getWaveFormOptionsFromProps(rest);
        waveformProps = {
          ...derivedProps,
          container: "#" + id,
        };
      }
    });

    // construct initial plugins list
    let pluginsList: PluginDefinition[] = [];

    if (plugins) {
      pluginsList = plugins.map(createPlugin);
    }

    usedPluginsListCache.current = pluginsList;

    if (waveSurfer) {
      waveSurfer.destroy();
      setWaveSurfer(null);
    }

    let ws = createWavesurfer({
      container: "wavesurfer",
      ...(typeof waveformProps == "object" ? waveformProps : {}),
      plugins: pluginsList,
    });

    setWaveSurfer(ws);

    if (onMount) {
      onMount(ws);
    }
  }, []);

  return (
    <WaveSurferContext.Provider value={waveSurfer}>
      {children}
    </WaveSurferContext.Provider>
  );
};

WaveSurfer.propTypes = {
  plugins: Types.arrayOf(
    Types.shape({
      plugin: Types.any,
      options: Types.any,
    })
  ),
  children: Types.any,
  onMount: Types.func,
};

WaveSurfer.defaultProps = {
  children: null,
  plugins: [],
};

export default WaveSurfer;
