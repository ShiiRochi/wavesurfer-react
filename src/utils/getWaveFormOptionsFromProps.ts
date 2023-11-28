import { WaveSurferOptions } from "wavesurfer.js";
import { WaveFormProps } from "../components/WaveForm";


export const waveFormPropsList = [
  "audioRate",
  "autoCenter",
  "backend",
  "barGap",
  "barHeight",
  "barRadius",
  "barWidth",
  "cursorColor",
  "cursorWidth",
  "fillParent",
  "height",
  "hideScrollbar",
  "interact",
  "media",
  "mediaControls",
  "minPxPerSec",
  "normalize",
  "progressColor",
  "splitChannels",
  "waveColor",

  "duration",

  "fetchParams"
] as const;

const getWaveFormOptionsFromProps = (props: WaveFormProps): Omit<WaveSurferOptions, 'container'> => {
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
