import { createContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import { PluginDictionary } from "../hooks/useWavesurfer";

const WaveSurferContext = createContext<readonly [WaveSurfer, PluginDictionary<GenericPlugin>, GenericPlugin[]] | null>(null);

export default WaveSurferContext;
