import { createContext } from 'react';
import WaveSurfer from 'wavesurfer.js/src/wavesurfer';
const WaveSurferContext = createContext<WaveSurfer | null>(null);

export default WaveSurferContext;
