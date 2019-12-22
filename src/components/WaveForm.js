import React from "react";

const WaveForm = ({ id, children }) => {
  return <div id={id}>{children}</div>;
};

WaveForm.defaultProps = {
  waveColor: "violet",
  progressColor: "purple",
  id: "waveform"
};

export default WaveForm;
