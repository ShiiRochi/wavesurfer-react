import { createContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import { PluginDictionary } from "../hooks/useWavesurfer";

export type WaveSurferContextValue = readonly [WaveSurfer, PluginDictionary<GenericPlugin>, GenericPlugin[]];

const WaveSurferContext = createContext<WaveSurferContextValue | null>(null);

export default WaveSurferContext;
