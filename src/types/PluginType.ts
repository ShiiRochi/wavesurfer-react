import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";

export interface PluginType<GPlug extends GenericPlugin> {
  key: string;
  plugin: GPlug;
  options: any;
  creator?: string;
}