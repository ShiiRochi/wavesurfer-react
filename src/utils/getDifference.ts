import { PluginDefinition } from "wavesurfer.js/types/plugin";

const getDifference = (arr1: PluginDefinition[], arr2: PluginDefinition[]) => {
  let nextArr1 = [...arr1];
  let nextArr2 = [...arr2];

  const disabled = nextArr1.filter(item => {
    return nextArr2.findIndex((nextItem) => nextItem.name === item.name) === -1;
  });

  const enabled = nextArr2.filter(item => {
    return nextArr1.findIndex(nextItem => nextItem.name === item.name) === -1;
  });

  return { disabled, enabled };
  // map arr2 via reduce and remove each item, which name exists in arr1
};

export default getDifference;
