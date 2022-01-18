import { WaveSurferParams } from "wavesurfer.js/types/params";


export const waveFormPropsList: [
  "audioRate",
  "audioContext",
  "audioScriptProcessor",
  "autoCenter",
  "backend",
  "backgroundColor",
  "barGap",
  "barHeight",
  "barMinHeight",
  "barRadius",
  "barWidth",
  "closeAudioContext",
  "cursorColor",
  "cursorWidth",
  "fillParent",
  "forceDecode",
  "height",
  "hideScrollbar",
  "interact",
  "loopSelection",
  "maxCanvasWidth",
  "mediaControls",
  "mediaType",
  "minPxPerSec",
  "normalize",
  "partialRender",
  "pixelRatio",
  "progressColor",
  "removeMediaElementOnDestroy",
  "renderer",
  "responsive",
  "scrollParent",
  "skipLength",
  "splitChannels",
  "waveColor",
  "autoCenterRate",
  "autoCenterImmediately",
  
  "drawingContextAttributes",
  "duration",
  
  "ignoreSilenceMode",
  
  "rtl",
  "splitChannelsOptions",
  "vertical",
  "xhr"
] = [
  "audioRate",
  "audioContext",
  "audioScriptProcessor",
  "autoCenter",
  "backend",
  "backgroundColor",
  "barGap",
  "barHeight",
  "barMinHeight",
  "barRadius",
  "barWidth",
  "closeAudioContext",
  "cursorColor",
  "cursorWidth",
  "fillParent",
  "forceDecode",
  "height",
  "hideScrollbar",
  "interact",
  "loopSelection",
  "maxCanvasWidth",
  "mediaControls",
  "mediaType",
  "minPxPerSec",
  "normalize",
  "partialRender",
  "pixelRatio",
  "progressColor",
  "removeMediaElementOnDestroy",
  "renderer",
  "responsive",
  "scrollParent",
  "skipLength",
  "splitChannels",
  "waveColor",
  "autoCenterRate",
  "autoCenterImmediately",
  
  "drawingContextAttributes",
  "duration",
  
  "ignoreSilenceMode",
  
  "rtl",
  "splitChannelsOptions",
  "vertical",
  "xhr"
];

const getWaveFormOptionsFromProps = (props: object): Omit<WaveSurferParams, 'container'> => {
  if (!props) return {};
  return waveFormPropsList.reduce((waveFormOptions, optionName) => {
    if (!Object.prototype.hasOwnProperty.call(props,optionName)) {
      return waveFormOptions;
    }

    return {
      ...waveFormOptions,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - ts doesnt recognize hasOwnProperty check
      [optionName]: props[optionName]
    };
  }, {});
};

export default getWaveFormOptionsFromProps;
