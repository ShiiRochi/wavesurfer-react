export default function createPlugin(pluginObj) {
  const { plugin, options, creator = "create" } = pluginObj;

  if (!plugin || !plugin[creator]) return null;

  return plugin[creator](options);
}
