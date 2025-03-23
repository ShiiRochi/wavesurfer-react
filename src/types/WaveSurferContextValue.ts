import WaveSurfer from "wavesurfer.js";
import { PluginDictionary } from "../hooks/useWavesurfer";
import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";

export type WaveSurferContextValue = readonly [WaveSurfer, PluginDictionary<GenericPlugin>, GenericPlugin[]] | null;