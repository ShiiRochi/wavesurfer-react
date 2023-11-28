import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import { PluginDictionary } from "../hooks/useWavesurfer";

const fromPairs = <T>(arr: Array<[string, T]>): Record<string, T> => arr.reduce((acc, item) => {
  acc[item[0]] = item[1];

  return acc;
}, {} as Record<string, T>);

const getDifference = <GPlug extends GenericPlugin>(arr1: PluginDictionary<GPlug>, arr2: PluginDictionary<GPlug>) => {
  const nextArr1 = Object.entries(arr1);
  const nextArr2 = Object.entries(arr2);

  const disabled = nextArr1.filter(([item]) => nextArr2.findIndex(([nextItem]) => nextItem === item) === -1);

  const enabled = nextArr2.filter(([item]) => nextArr1.findIndex(([nextItem]) => nextItem === item) === -1);

  return { disabled: fromPairs(disabled), enabled: fromPairs(enabled) };
};

export default getDifference;
