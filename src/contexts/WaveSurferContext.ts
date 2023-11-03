import { createContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
const WaveSurferContext = createContext<WaveSurfer | null>(null);

export default WaveSurferContext;
