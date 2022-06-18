import WaveSurferContext from "../contexts/WaveSurferContext";
import {useContext} from "react";

export default function useWavesurferContext() {
    return useContext(WaveSurferContext);
}
