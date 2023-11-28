import React from "react";
import { WaveSurferOptions } from "wavesurfer.js";
export interface WaveFormProps extends Partial<WaveSurferOptions> {
  id: string;
  children?: React.ReactNode;
}
const WaveForm = ({ id = "waveform", children }: WaveFormProps) => {
  return <div id={id}>{children}</div>;
};

export default WaveForm;
