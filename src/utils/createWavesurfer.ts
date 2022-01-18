import WaveSurferFactory from "wavesurfer.js";
import { WaveSurferParams } from "wavesurfer.js/types/params";

export default function createWavesurfer(options: WaveSurferParams) {
  return WaveSurferFactory.create(options);
}
