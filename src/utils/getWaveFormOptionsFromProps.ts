import { WaveSurferParams } from "wavesurfer.js/types/params";
import { WaveFormProps } from "../components/WaveForm";


export const waveFormPropsList = [
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
] as const;

const getWaveFormOptionsFromProps = (props: WaveFormProps): Omit<WaveSurferParams, 'container'> => {
  if (!props) return {};

  return waveFormPropsList.reduce<Record<typeof waveFormPropsList[number], any>>((waveFormOptions, optionName) => {
    if (!Object.prototype.hasOwnProperty.call(props,optionName)) {
      return waveFormOptions;
    }

    return {
      ...waveFormOptions,
      [optionName]: props[optionName]
    };
  }, {} as Record<typeof waveFormPropsList[number], any>);
};

export default getWaveFormOptionsFromProps;
