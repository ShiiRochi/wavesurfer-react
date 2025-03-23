import {useContext} from "react";
import WaveSurferContext from "../contexts/WaveSurferContext";

export default function useWavesurferContext() {
    return useContext(WaveSurferContext);
}
