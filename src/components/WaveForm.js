import React from "react";

const WaveForm = ({ id, children }) => {
    return <div id={id}>{children}</div>;
};

WaveForm.defaultProps = {
    id: "waveform",
    audioRate: 1,
    autoCenter: true,
    backend: "WebAudio",
    barHeight: 1,
    barRadius: 0,
    closeAudioContext: false,
    cursorColor: "#333",
    cursorWidth: 1,
    fillParent: true,
    forceDecode: false,
    height: 128,
    hideScrollbar: false,
    interact: true,
    loopSelection: true,
    maxCanvasWidth: 4000,
    mediaControls: false,
    mediaType: "audio",
    minPxPerSec: 50,
    normalize: false,
    partialRender: false,
    pixelRatio: window.devicePixelRatio,
    plugins: [],
    progressColor: "purple",
    removeMediaElementOnDestroy: true,
    responsive: false,
    scrollParent: false,
    skipLength: 2,
    splitChannels: false,
    waveColor: "violet",
    xhr: {},
};

export default WaveForm;
