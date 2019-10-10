import React, { useRef } from "react";
import WaveSurferFactory from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js";
import { useEffect } from "react";

const createSurfer = options => WaveSurferFactory.create(options);

const createMinimapPlugin = options => MinimapPlugin.create(options);

const createTimelinePlugin = options => TimelinePlugin.create(options);

const createRegionsPlugin = (options) => WaveSurferFactory.regions.create(options);

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
  ({ children, innerRef, plugins, ...props }, ref) => {
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

      let enabledPlugins = [...plugins];

      if (timeLineProps) {
        enabledPlugins = [...enabledPlugins, { name: 'timeline', options: timeLineProps }];
      }


      let options = {
        ...(waveFormProps && waveFormProps),
        plugins: enabledPlugins.reduce((pluginsList, currentPlugin) => {
          try {
            if (typeof currentPlugin === "string") {
              switch (currentPlugin) {
                case 'regions':
                  return [...pluginsList, RegionsPlugin.create({})];
                case 'minimap':
                  return [...pluginsList, MinimapPlugin.create({})];
                case 'timeline':
                  return [...pluginsList, TimelinePlugin.create({})];
              }
            } else if (typeof currentPlugin === "object") {
              switch (currentPlugin.name) {
                case 'regions':
                  return [...pluginsList, RegionsPlugin.create(currentPlugin.options)];
                case 'minimap':
                  return [...pluginsList, MinimapPlugin.create(currentPlugin.options)];
                case 'timeline':
                  return [...pluginsList, TimelinePlugin.create(currentPlugin.options)];
              }
            }
          } catch (e) {
            console.log('error:', e);
            return pluginsList;
          }

          return pluginsList;
        }, [])
      };

      if (waveSurfer.current) {
        waveSurfer.current.destroy();
        waveSurfer.current = null;
      }

      waveSurfer.current = createSurfer(options);

      if (ref) {
        ref.current = waveSurfer.current;
      }
    }, [plugins]);

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
  plugins: []
};

export default WaveSurfer;
