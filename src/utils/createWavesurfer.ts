import WaveSurfer from "wavesurfer.js";
import { WaveSurferParams } from "wavesurfer.js/types/params";

export default function createWavesurfer(options: WaveSurferParams): WaveSurfer {
  return WaveSurfer.create(options);
}

export { WaveSurfer };
