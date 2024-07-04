import React from "react";
import WaveSurferContext from "../contexts/WaveSurferContext";
import { WaveSurfer as WaveSurferRef } from "../utils/createWavesurfer";
import useWavesurfer from "../hooks/useWavesurfer";

import { PluginType } from "../types";
import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import { WaveSurferOptions } from "wavesurfer.js";

export interface WaveSurferProps<GPlug extends GenericPlugin> extends Omit<WaveSurferOptions, "plugins"> {
  children: React.ReactNode;
  plugins: PluginType<GPlug>[];
  onMount: (wavesurferRef: null | WaveSurferRef) => void;
}


// TODO: research on ref usage
function WaveSurfer<GPlug extends GenericPlugin>({ children, plugins = [], onMount, ...props }: WaveSurferProps<GPlug>) {
  const wavesurfer = useWavesurfer({
    plugins,
    onMount,
    ...props,
  });

  return (
    <WaveSurferContext.Provider value={wavesurfer}>
      {children}
    </WaveSurferContext.Provider>
  );
}

export default WaveSurfer;
