import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import WaveSurferProvider, {
  TimeLine,
  WaveForm
} from "./components/WaveSurfer";

import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";

import "./styles.css";

function App() {
  const wavesurferRef = useRef(null);

  useEffect(() => {
    wavesurferRef.current.on("ready", () => {
      console.log("WaveSurfer is ready");
    });

    wavesurferRef.current.on("loading", data => {
      console.log(data);
    });
  }, [wavesurferRef]);

  return (
    <div className="App">
      <WaveSurferProvider plugins={["minimap", "regions"]} ref={wavesurferRef}>
        <WaveForm />
        <TimeLine id="wave-timeline" />
      </WaveSurferProvider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
