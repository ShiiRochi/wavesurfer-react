import React, { useState, useEffect, useRef } from "react";
import Types from "prop-types";

import WaveSurferContext from "./contexts/WaveSurferContext";
import createWavesurfer from "./utils/createWavesurfer";
import createPlugin from "./utils/createPlugin";
import getDifference from "./utils/getDifference";

const WaveSurfer = ({ children, plugins, onMount, form }) => {
  const usedPluginsListCache = useRef([]);
  const [waveSurfer, setWaveSurfer] = useState(null);

  useEffect(() => {
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
      ...(form && form),
      plugins: pluginsList
    });

    setWaveSurfer(ws);

    if (onMount) {
      onMount(ws);
    }

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

  return (
    <WaveSurferContext.Provider value={waveSurfer}>
      {children}
    </WaveSurferContext.Provider>
  );
};

WaveSurfer.propTypes = {
  plugins: Types.arrayOf(Types.node),
  form: Types.object,
  children: Types.any,
  onMount: Types.func
};

WaveSurfer.defaultProps = {
  children: null,
  plugins: []
};

export default WaveSurfer;
