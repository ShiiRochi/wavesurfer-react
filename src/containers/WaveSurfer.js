import React, { useState, useEffect, useRef } from "react";
import Types from "prop-types";

import WaveSurferContext from "../contexts/WaveSurferContext";
import WaveForm from "../components/WaveForm";
import createWavesurfer from "../utils/createWavesurfer";
import getWaveFormOptionsFromProps from "../utils/getWaveFormOptionsFromProps";
import createPlugin from "../utils/createPlugin";

const WaveSurfer = ({ children, plugins, onMount }) => {
  const usedPluginsListCache = useRef([]);
  const [waveSurfer, setWaveSurfer] = useState(null);

  useEffect(() => {
    let waveformProps = null;

    // get timeline and waveform props
    React.Children.forEach(children, element => {
      const { props } = element;
      // eslint-disable-next-line react/prop-types
      const { id, ...rest } = props;
      let derivedProps = null;
      if (element.type === WaveForm && !waveformProps) {
        derivedProps = getWaveFormOptionsFromProps(rest);
        waveformProps = {
          container: `${id}`,
          ...derivedProps
        };
      }
    });

    // construct initial plugins list
    let pluginsList = [];

    if (plugins) {
      pluginsList = plugins.map(createPlugin);
    }

    usedPluginsListCache.current = pluginsList.map(plugin => plugin.name);

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

  useEffect(() => {
    if (!waveSurfer) return;

    return () => {
      waveSurfer.destroy();
    };
  }, [waveSurfer]);

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
