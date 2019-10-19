import React, { useRef, createContext, useContext, useState } from "react";
import WaveSurferFactory from "wavesurfer.js";

import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min";

import { useEffect } from "react";
import useRegionEvent from "../hooks/useRegionEvent";

const WaveSurferContext = createContext(null);

const createSurfer = options => WaveSurferFactory.create(options);

const createMinimapPlugin = options => MinimapPlugin.create(options);

const createTimelinePlugin = options => TimelinePlugin.create(options);

const createRegionsPlugin = (options) => RegionsPlugin.create(options);

const createMicrophonePlugin = (options) => MicrophonePlugin.create(options);

export const Region = ({ onOver, onLeave, onClick, onDoubleClick, onIn, onOut, onRemove, onUpdate, onUpdateEnd, ...props }) => {
  const waveSurfer = useContext(WaveSurferContext);

  const isRenderedCache = useRef(false);

  const [regionRef, setRegionRef] = useState(null);

  useEffect(() => {
    return () => {
      if (regionRef) {
        regionRef.remove();
      }
    }
  }, [regionRef])

  useEffect(() => {
    if (!isRenderedCache.current && waveSurfer) {
      isRenderedCache.current = true;

      let region = waveSurfer.addRegion(props);

      setRegionRef(region);
    }
  }, [waveSurfer]);

  useRegionEvent(regionRef, 'click', onClick);

  useRegionEvent(regionRef, 'over', onOver);

  useRegionEvent(regionRef, 'leave', onLeave);

  useRegionEvent(regionRef, 'dbclick', onDoubleClick)

  useRegionEvent(regionRef, 'in', onIn)

  useRegionEvent(regionRef, 'out', onOut)

  useRegionEvent(regionRef, 'remove', onRemove)

  useRegionEvent(regionRef, 'update', onUpdate);

  useRegionEvent(regionRef, 'update-end', onUpdateEnd)

  return null;
};

export const WaveForm = ({ id, children }) => {

  return <div id={id}>{children}</div>;
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
    const [ waveSurfer, setWaveSurfer ] = useState(null);
    // const waveSurfer = useRef(null);

    useEffect(  () => {
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

      const timelinePluginIndex = plugins.findIndex(plugin => {
        if (typeof plugin === "string") return plugin === 'timeline';

        if (typeof plugin === 'object') return plugin.name === 'timeline';

        return false;
      });

      const activePluginsNamesList = enabledPlugins.map(plugin => {
        if (typeof plugin === "string") return plugin;

        return plugin.name;
      });

      // if timeline is not present in plugins list,
      //  then add timeLineProps as only options
      // if timeline is present in plugins list and it is a string,
      //  then add timeLineProps as only options
      // if timeline is present in plugins list and it is an object,
      //  then merge timeLineProps with defined options for timeline
      if (timeLineProps) {
        if (timelinePluginIndex !== -1) {
          if (typeof plugins[timelinePluginIndex] === "string") {
            enabledPlugins[timelinePluginIndex] = { name: 'timeline', options: timeLineProps};
          } else if (typeof plugins[timeLineProps] === 'object') {
            enabledPlugins[timelinePluginIndex] = {
              ...plugins[timeLineProps],
              ...timeLineProps
            };
          }
        } else {
          enabledPlugins[timelinePluginIndex] = { name: 'timeline', options: timeLineProps};
        }
      }

      // load all required modules
      // await Promise.all(...activePluginsNamesList.map(pluginName => {
      //   switch (pluginName) {
      //     case 'regions':
      //       return RegionsPlugin();
      //   }
      // }));


      let options = {
        ...(waveFormProps && waveFormProps),
        plugins: enabledPlugins.reduce((pluginsList, currentPlugin) => {
          try {
            if (typeof currentPlugin === "string") {
              switch (currentPlugin) {
                case 'regions':
                  return [...pluginsList, createRegionsPlugin({})];
                case 'minimap':
                  return [...pluginsList, createMinimapPlugin({})];
                case 'timeline':
                  return [...pluginsList, createTimelinePlugin({})];
                case 'microphone':
                  return [...pluginsList, createMicrophonePlugin({})];
              }
            } else if (typeof currentPlugin === "object") {
              switch (currentPlugin.name) {
                case 'regions':
                  return [...pluginsList, createRegionsPlugin(currentPlugin.options)];
                case 'minimap':
                  return [...pluginsList, createMinimapPlugin(currentPlugin.options)];
                case 'timeline':
                  return [...pluginsList, createTimelinePlugin(currentPlugin.options)];
                case 'microphone':
                  return [...pluginsList, createMicrophonePlugin(currentPlugin.options)];
              }
            }
          } catch (e) {
            console.log('error:', e);
            return pluginsList;
          }

          return pluginsList;
        }, [])
      };

      if (waveSurfer) {
        waveSurfer.destroy();
        setWaveSurfer(null);
      }

      let ws = createSurfer(options)

      setWaveSurfer(ws);

      if (ref) {
        ref.current = ws;
      }
      // we do such huge calculations only on mount
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (waveSurfer) {
        // const currentActivePlugins = waveSurfer.getActivePlugins();
      }
    }, [plugins])

    useEffect(() => {
      if (!waveSurfer) return;

      return () => {
        waveSurfer.destroy();
      };
    }, [waveSurfer]);

    return (
        <WaveSurferContext.Provider value={waveSurfer}>
          {children}
        </WaveSurferContext.Provider>
    );
  }
);

WaveSurfer.defaultProps = {
  children: null,
  plugins: []
};

export default WaveSurfer;
