import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";

export default function createWavesurfer(options: WaveSurferOptions): WaveSurfer {
  return WaveSurfer.create(options);
}

export { WaveSurfer };
