import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import { PluginType } from "../types";

export default function createPlugin<GPlug extends GenericPlugin>(pluginObj: PluginType<GPlug>): GPlug {
  const { plugin, options, creator = 'create'} = pluginObj;

  const createMethod: any = plugin[creator as keyof typeof plugin];

  if (!plugin) throw new Error(`Please pass a valid plugin in plugin list`);
  if (!creator) throw new Error(`Please pass the creator function name in 'creator' property.`)

  if (typeof createMethod !== 'function') {
    throw new Error(`"${creator}" is not callable on given plugin. Please pass a valid 'creator' in plugins list.`)
  }

  return createMethod(options);
}
