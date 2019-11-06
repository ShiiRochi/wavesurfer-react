import React from "react";

const WaveForm = ({ id, children }) => {
    return <div id={id}>{children}</div>;
};

WaveForm.defaultProps = {
    id: "waveform",
    waveColor: "violet",
    progressColor: "purple",
    barHeight: 1,
    barRadius: 0,
    cursorColor: "#333",
    cursorWidth: 1,
};

export default WaveForm;
