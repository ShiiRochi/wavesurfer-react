const waveFormPropsList = [
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
  "dragSelection",
  "drawingContextAttributes",
  "duration",
  "hideCursor",
  "ignoreSilenceMode",
  "mediaContainer",
  "rtl",
  "splitChannelsOptions",
  "vertical",
  "xhr"
];

const getWaveFormOptionsFromProps = props => {
  if (!props) return {};
  return waveFormPropsList.reduce((waveFormOptions, optionName) => {
    if (!props.hasOwnProperty(optionName)) {
      return waveFormOptions;
    }

    return {
      ...waveFormOptions,
      [optionName]: props[optionName]
    };
  }, {});
};

export default getWaveFormOptionsFromProps;
