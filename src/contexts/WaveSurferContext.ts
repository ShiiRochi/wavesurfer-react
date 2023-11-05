import { createContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
const WaveSurferContext = createContext<readonly [WaveSurfer, GenericPlugin[]] | null>(null);

export default WaveSurferContext;
