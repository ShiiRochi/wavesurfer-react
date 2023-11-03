import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";

const getDifference = <GPlug extends GenericPlugin>(arr1: GPlug[], arr2: GPlug[]) => {
  const nextArr1 = [...arr1];
  const nextArr2 = [...arr2];

  const disabled = nextArr1.filter(item => nextArr2.findIndex((nextItem) => nextItem === item) === -1);

  const enabled = nextArr2.filter(item => nextArr1.findIndex(nextItem => nextItem === item) === -1);

  return { disabled, enabled };
};

export default getDifference;
