import React, { useState, useEffect } from "react";
import WaveSurferFactory from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MinimapPlugin from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min";
import MediaSessionPlugin from "wavesurfer.js/dist/plugin/wavesurfer.mediasession.min";
import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min";
import ElanPlugin from "wavesurfer.js/dist/plugin/wavesurfer.elan.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";

import WaveSurferContext from '../contexts/WaveSurferContext';
import WaveForm from "../components/WaveForm";
import TimeLine from "../components/Timeline";
import getWaveFormOptionsFromProps from "../utils/getWaveFormOptionsFromProps";

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

// TODO: idea --> maybe onMount event will be better, then ref passing
const WaveSurfer = ({ children, plugins, onMount }) => {
    const [ waveSurfer, setWaveSurfer ] = useState(null);

    useEffect(  () => {
      let timeLineProps = null;
      let waveFormProps = null;

      React.Children.forEach(children, element => {
        const { props } = element;
        const { id: _id, ...restElementProps } = props;
        // TODO: feature --> create getTimelineOptionsFromProps
        if (element.type === TimeLine) {
          timeLineProps = {
            container: `#${_id}`
          };
        }
        if (element.type === WaveForm) {
          const derivedWaveFormOptions = getWaveFormOptionsFromProps(restElementProps);

          waveFormProps = {
            container: `#${_id}`,
            ...derivedWaveFormOptions
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

      if (onMount) {
        onMount(ws);
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
};

WaveSurfer.defaultProps = {
  children: null,
  plugins: []
};

export default WaveSurfer;
