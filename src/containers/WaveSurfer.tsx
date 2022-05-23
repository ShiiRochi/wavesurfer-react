import React, { useEffect, useRef, useState } from "react";
import { WaveSurferParams } from "wavesurfer.js/types/params";
import { PluginDefinition } from "wavesurfer.js/types/plugin";
import WaveForm from "../components/WaveForm";
import WaveSurferContext from "../contexts/WaveSurferContext";
import createWavesurfer, { WaveSurfer as WaveSurferRef } from "../utils/createWavesurfer";
import getWaveFormOptionsFromProps from "../utils/getWaveFormOptionsFromProps";
import getDifference from "../utils/getDifference";
import createPlugin from "../utils/createPlugin";

export interface PluginType {
  plugin: object;
  options: any;
  creator?: string;
}

export interface WaveSurferProps {
  children: React.ReactNode;
  plugins: PluginType[];
  onMount: (wavesurferRef: WaveSurferRef) => any;
}

const WaveSurfer = ({ children, plugins = [], onMount }: WaveSurferProps) => {
  const usedPluginsListCache = useRef<PluginDefinition[]>([]);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurferRef | null>(null);

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
      const nextPluginsMap = plugins.map(createPlugin);

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
      if (typeof element !== "object" || element === null || ["string", "number"].includes(typeof element)) {
        return;
      }

      // if child does not have either props, or type,
      // then return
      if (!("props" in element || "type" in element)) return;

      const props = element.props;

      const elType = element.type;

      const { id, ...rest } = props;

      let derivedProps = null;

      if (elType === WaveForm) {
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

    const ws = createWavesurfer({
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

WaveSurfer.defaultProps = {
  children: null,
  plugins: [],
};

export default WaveSurfer;
