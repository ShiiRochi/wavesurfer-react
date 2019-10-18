import React, { useRef, useEffect, useCallback, useState} from "react";
import styled from 'styled-components';
import ReactDOM from "react-dom";
import WaveSurferProvider, {
  Region,
  TimeLine,
  WaveForm
} from "./components/WaveSurfer";

import "./styles.css";

const Buttons = styled.div`
  display: inline-block;
`;

const Button = styled.button`
`;

const waveSurferPlugins = [
    'minimap',
    { name: 'regions', options: { dragSelection: true } }
];

/**
 * @param min
 * @param max
 * @returns {*}
 */
function generateNum (min, max) {
    return Math.random() * (max - min + 1) + min;
};

/**
 * @param distance
 * @param min
 * @param max
 * @returns {([*, *]|[*, *])|*[]}
 */
function generateTwoNumsWithDistance(distance, min, max) {
    const num1 = generateNum(min, max);
    const num2 = generateNum(min, max);
    // if num2 - num1 < 10
    if (num2 - num1 >= 10) {
        return [num1, num2];
    }
    return generateTwoNumsWithDistance(distance, min, max)
}

function App() {
  const wavesurferRef = useRef(null);

  const [regions, setRegions] = useState([
      {
          id: 'region-1',
          start: 0.5,
          end: 10,
          color: 'rgba(0, 0, 0, .5)',
          data: {
              systemRegionId: 31
          }
      },
      {
          id: 'region-2',
          start: 5,
          end: 25,
          color: 'rgba(225, 195, 100, .5)',
          data: {
              systemRegionId: 32
          },
      },
      {
          id: 'region-3',
          start: 15,
          end: 35,
          color: 'rgba(25, 95, 195, .5)',
          data: {
              systemRegionId: 33
          },
      }
  ]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.load("/bensound-ukulele.mp3");

      wavesurferRef.current.on("ready", () => {
        console.log("WaveSurfer is ready");
      });

      wavesurferRef.current.on("region-removed", (region) => {
        console.log("region-removed --> ", region);
      });

      wavesurferRef.current.on("loading", data => {
        console.log('loading --> ', data);
      });

      wavesurferRef.current.on('region-created', region => {
          console.log('region-created --> ', region);
      });
    }
  }, [wavesurferRef]);

  const generateRegion = useCallback(
      () => {
          if (!wavesurferRef.current) return;
          const minTimestampInSeconds = 0;
          const maxTimestampInSeconds = wavesurferRef.current.getDuration();
          const distance = generateNum(0, 10);
          const [ min, max ] = generateTwoNumsWithDistance(distance, minTimestampInSeconds, maxTimestampInSeconds);

          const r = generateNum(0, 255);
          const g = generateNum(0, 255);
          const b = generateNum(0, 255);

          setRegions([...regions, {
              id: `custom-${generateNum(0, 9999)}`,
              start: min,
              end: max,
              color: `rgba(${r}, ${g}, ${b}, 0.5)`
          }]);

      },
      [regions, wavesurferRef],
  );

  const removeLastRegion = useCallback(
      () => {
          let nextRegions = [...regions];

          nextRegions.pop();

          setRegions(nextRegions);
      },
      [regions]
  );

  const play = useCallback(() => {
      wavesurferRef.current.playPause();
  }, [])

  return (
    <div className="App">
      <WaveSurferProvider plugins={waveSurferPlugins} ref={wavesurferRef}>
        <WaveForm>
            {
                regions.map(regionProps => (
                    <Region
                        onUpdateEnd={console.log}
                        key={regionProps.id}
                        {...regionProps}
                    />
                ))
            }
        </WaveForm>
        <TimeLine />
      </WaveSurferProvider>
        <Buttons>
            <Button onClick={generateRegion}>
                Generate region
            </Button>
            <Button onClick={play}>
                Play / Pause
            </Button>
            <Button onClick={removeLastRegion}>
                Remove last region
            </Button>
        </Buttons>

    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
