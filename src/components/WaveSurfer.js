import React, { useRef, createContext, useContext, useState, useEffect } from "react";
import WaveSurferFactory from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min";
import MediaSessionPlugin from "wavesurfer.js/dist/plugin/wavesurfer.mediasession.min";
import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min";
import ElanPlugin from "wavesurfer.js/dist/plugin/wavesurfer.elan.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";

import useRegionEvent from "../hooks/useRegionEvent";

const WaveSurferContext = createContext(null);

const createSurfer = options => WaveSurferFactory.create(options);

const createMinimapPlugin = options => MinimapPlugin.create(options);

const createTimelinePlugin = options => TimelinePlugin.create(options);

const createRegionsPlugin = options => RegionsPlugin.create(options);

const createMicrophonePlugin = options => MicrophonePlugin.create(options);

const createMediaSessionPlugin = options => MediaSessionPlugin.create(options);

const createSpectrogramPlugin = options => SpectrogramPlugin.create(options);

const createElanPlugin = options => ElanPlugin.create(options);

const createCursorPlugin = options => CursorPlugin.create(options);

const pluginToCreatorMap = {
  minimap: createMinimapPlugin,
  timeline: createTimelinePlugin,
  regions: createRegionsPlugin,
  microphone: createMicrophonePlugin,
  mediasession: createMediaSessionPlugin,
  spectrogram: createSpectrogramPlugin,
  elan: createElanPlugin,
  cursor: createCursorPlugin,
};

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
    // eslint-disable-next-line
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


      let options = {
        ...(waveFormProps && waveFormProps),
        plugins: enabledPlugins.reduce((pluginsList, currentPlugin) => {
          try {
            if (typeof currentPlugin === "string") {
              return [...pluginsList, pluginToCreatorMap[currentPlugin]({})];
            } else if (typeof currentPlugin === "object") {
              return [...pluginsList, pluginToCreatorMap[currentPlugin.name](currentPlugin.options)];
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
      // TODO: feature --> add and remove plugins on plugins list change
      // we do such huge calculations only on mount
      // eslint-disable-next-line
    }, []);

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
