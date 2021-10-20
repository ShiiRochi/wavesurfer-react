const waveFormPropsList = [
  'audioContext',
  'audioScriptProcessor',
  'audioRate',
  'autoCenter',
  'autoCenterRate',
  'autoCenterImmediately',
  'backend',
  'backgroundColor',
  'barHeight',
  'barRadius',
  'barGap',
  'barMinHeight',
  'cursorColor',
  'cursorWidth',
  'dragSelection',
  'drawingContextAttributes',
  'duration',
  'fillParent',
  'forceDecode',
  'height',
  'hideScrollbar',
  'hideCursor',
  'ignoreSilenceMode',
  'interact',
  'loopSelection',
  'maxCanvasWidth',
  'mediaContainer',
  'mediaControls',
  'mediaType',
  'minPxPerSec',
  'normalize',
  'partialRender',
  'pixelRatio',
  // we dont want it here and anywhere else, because...
  // plugins are taken from props
  // 'plugins',
  // container is constructed using id
  // 'container',
  'progressColor',
  'removeMediaElementOnDestroy',
  'renderer',
  'responsive',
  'rtl',
  'scrollParent',
  'skipLength',
  'splitChannels',
  'splitChannelsOptions',
  'vertical',
  'waveColor',
  'xhr'
];

const getWaveFormOptionsFromProps = props => {
  if (!props) return {};
  return waveFormPropsList.reduce((waveFormOptions, optionName) => {
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
