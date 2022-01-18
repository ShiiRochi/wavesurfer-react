import React from "react";
import { WaveSurferParams } from "wavesurfer.js/types/params";
export interface WaveFormProps extends Partial<WaveSurferParams> {
  id: string;
  children?: React.ReactNode;
}
const WaveForm = ({ id = "waveform", children }: WaveFormProps) => {
  return <div id={id}>{children}</div>;
};

export default WaveForm;
