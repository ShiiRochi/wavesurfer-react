import type BasePlugin from "wavesurfer.js/dist/base-plugin";
import type RegionsPlugin from "wavesurfer.js/plugins/regions";

export const isRegionsPlugin = (plugin: BasePlugin<any, any>): plugin is RegionsPlugin => {
  return "addRegions" in plugin || "getRegions" in plugin || ("regions" in plugin && "regionsContainer" in plugin);
};
