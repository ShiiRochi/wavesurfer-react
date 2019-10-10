import React, { useRef } from "react";
import WaveSurferFactory from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import { useEffect } from "react";

const createSurfer = options => WaveSurferFactory.create(options);

export const WaveForm = ({ id }) => {
  return <div id={id} />;
};

WaveForm.defaultProps = {
  waveColor: "violet",
  progressColor: "purple",
  id: "waveform"
};

export const TimeLine = ({ id }) => {
  return <div id={id} />;
};

TimeLine.defaultProps = {
  id: "timeline"
};

const WaveSurfer = React.forwardRef(
  ({ children, minimap, innerRef, plugins, ...props }, ref) => {
    const waveSurfer = useRef(null);

    useEffect(() => {
      let timeLineProps = null;
      let waveFormProps = null;

      React.Children.forEach(children, element => {
        const { props } = element;
        if (element.type === TimeLine) {
          const { id: timeLineContainer } = props;
          timeLineProps = {
            container: `#${timeLineContainer}`
          };
        }
        if (element.type === WaveForm) {
          const { id: waveFormContainer, waveColor, progressColor } = props;
          waveFormProps = {
            container: `#${waveFormContainer}`,
            waveColor,
            progressColor
          };
        }
      });

      let plugins = [];

      if (timeLineProps) {
        plugins = [...plugins, TimelinePlugin.create(timeLineProps)];
      }

      if (minimap) {
        plugins = [...plugins, MinimapPlugin.create()];
      }

      let options = {
        ...(waveFormProps && waveFormProps),
        plugins
      };

      if (waveSurfer.current) {
        waveSurfer.current.destroy();
        waveSurfer.current = null;
      }

      waveSurfer.current = createSurfer(options);

      if (ref) {
        ref.current = waveSurfer.current;
      }

      waveSurfer.current.load("/bensound-ukulele.mp3");
    }, [minimap]);

    useEffect(() => {
      if (!waveSurfer.current) return;

      return () => {
        waveSurfer.current.destroy();
      };
    }, [waveSurfer]);

    return children;
  }
);

WaveSurfer.defaultProps = {
  children: null,
  minimap: false
};

export default WaveSurfer;
