const list = [
  "audioRate",
  "audioContext",
  "audioScriptProcessor",
  "autoCenter",
  "backend",
  "backgroundColor",
  "barGap",
  "barHeight",
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
  // we dont want it here and anywhere else, because...
  // plugins are taken from props
  // 'plugins',
  // container is constructed using id
  // 'container',
  "progressColor",
  "removeMediaElementOnDestroy",
  "renderer",
  "responsive",
  "scrollParent",
  "skipLength",
  "splitChannels",
  "waveColor",
  "xhr"
];

const getWaveFormOptionsFromProps = props => {
  if (!props) return {};
  return list.reduce((waveFormOptions, optionName) => {
    if (!props[optionName]) {
      return waveFormOptions;
    }

    return {
      ...waveFormOptions,
      [optionName]: props[optionName]
    };
  }, {});
};

export default getWaveFormOptionsFromProps;
