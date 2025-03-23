import { createContext } from "react";
import { WaveSurferContextValue } from "../types";

const WaveSurferContext = createContext<WaveSurferContextValue>(null);

export default WaveSurferContext;