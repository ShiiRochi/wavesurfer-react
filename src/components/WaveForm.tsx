import React from "react";
export interface WaveFormProps {
  id: string;
  children: React.ReactNode;
}
const WaveForm = ({ id = "waveform", children }: WaveFormProps) => {
  return <div id={id}>{children}</div>;
};

export default WaveForm;
