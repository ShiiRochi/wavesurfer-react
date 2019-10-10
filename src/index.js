import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import WaveSurferProvider, {
  TimeLine,
  WaveForm
} from "./components/WaveSurfer";

import "./styles.css";

const waveSurferPlugins = [
    'minimap',
    { name: 'regions', options: { dragSelection: { enableDragSelection: true } } }
];

function App() {
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.load("/bensound-ukulele.mp3");

      wavesurferRef.current.on("ready", () => {
        console.log("WaveSurfer is ready");
      });

      wavesurferRef.current.on("loading", data => {
        console.log(data);
      });
    }
  }, [wavesurferRef]);


  return (
    <div className="App">
      <WaveSurferProvider plugins={waveSurferPlugins} ref={wavesurferRef}>
        <WaveForm />
        <TimeLine />
      </WaveSurferProvider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
