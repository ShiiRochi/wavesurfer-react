import React, { useState, useEffect, useRef } from "react";
import Types from "prop-types";

import WaveSurferContext from "../contexts/WaveSurferContext";
import WaveForm from "../components/WaveForm";
import createWavesurfer from "../utils/createWavesurfer";
import getWaveFormOptionsFromProps from "../utils/getWaveFormOptionsFromProps";
import createPlugin from "../utils/createPlugin";
import getDifference from "../utils/getDifference";

const WaveSurfer = ({ children, plugins, onMount }) => {
  const usedPluginsListCache = useRef([]);
  const [waveSurfer, setWaveSurfer] = useState(null);

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

      disabled.forEach(plugin => {
        if (!plugin.name) return;
        waveSurfer.destroyPlugin(plugin.name);
      });

      enabled.forEach(plugin => {
        if (!plugin.name) return;
        waveSurfer.addPlugin(plugin).initPlugin(plugin.name);
      });
    }
  }, [plugins]);

  useEffect(() => {
    let waveformProps = null;

    // get timeline and waveform props
    React.Children.forEach(children, element => {
      const { props } = element;
      // eslint-disable-next-line react/prop-types
      const { id, ...rest } = props;
      let derivedProps = null;
      if (element.type === WaveForm) {
        derivedProps = getWaveFormOptionsFromProps(rest);
        waveformProps = {
          ...derivedProps,
          container: "#" + id
        };
      }
    });

    // construct initial plugins list
    let pluginsList = [];

    if (plugins) {
      pluginsList = plugins.map(createPlugin);
    }

    usedPluginsListCache.current = pluginsList;

    if (waveSurfer) {
      waveSurfer.destroy();
      setWaveSurfer(null);
    }

    let ws = createWavesurfer({
      ...(waveformProps && waveformProps),
      plugins: pluginsList
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
  plugins: Types.arrayOf(Types.node),
  children: Types.any,
  onMount: Types.func
};

WaveSurfer.defaultProps = {
  children: null,
  plugins: []
};

export default WaveSurfer;
