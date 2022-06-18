import React, { Children, useMemo } from "react";
import WaveForm from "../components/WaveForm";
import WaveSurferContext from "../contexts/WaveSurferContext";
import { WaveSurfer as WaveSurferRef } from "../utils/createWavesurfer";
import getWaveFormOptionsFromProps from "../utils/getWaveFormOptionsFromProps";
import useWavesurfer from "../hooks/useWavesurfer";

import { PluginType } from "../types";

export interface WaveSurferProps {
  children: React.ReactNode;
  plugins: PluginType[];
  onMount: (wavesurferRef: null | WaveSurferRef) => any;
}

// TODO: research on ref usage
const WaveSurfer = ({ children, plugins = [], onMount, ...props }: WaveSurferProps) => {
  // Search for WaveForm component props
  // it's making new logic compatible with old one
  const UNSTABLE_waveFormProps = useMemo(() => {
    let waveformProps = {};

    Children.forEach(children, (element: React.ReactNode) => {
      if (typeof element !== "object" || element === null || ["string", "number"].includes(typeof element)) {
        return;
      }

      // if child does not have either props, or type,
      // then return
      if (!("props" in element || "type" in element)) return;

      const props = element.props;

      const elType = element.type;

      if (elType === WaveForm) {
        const { id, ...rest } = props;

        waveformProps = getWaveFormOptionsFromProps(rest);

        waveformProps = {
          ...waveformProps,
          container: "#" + id,
        };
      }
    })

    return waveformProps;
  }, [children]);

  const wavesurfer = useWavesurfer({
    plugins,
    // TODO: remove in future
    onMount,
    ...props,
    ...UNSTABLE_waveFormProps,
  });

  return (
      <WaveSurferContext.Provider value={wavesurfer}>
        {children}
      </WaveSurferContext.Provider>
  );
};

WaveSurfer.defaultProps = {
  children: null,
  plugins: [],
};

export default WaveSurfer;
