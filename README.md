#### Before reading further
> `master` branch is now a host for a second version of `wavesurfer-react` package. 
> If you want to see docs for the first version, then select `master-1` branch.  

# Wavesurfer React V2.0
A simple wrapper around an awesome library called [wavesurfer.js](https://wavesurfer-js.org).  

The purpose of the package is to provide an abstraction over wavesurfer.js API 
and to do it as close to react style of doing things as its maintainer(-s) can provide.

### Differences from V1.0
The main difference between **version 2** and **version 1** is the way of how plugins are passed to WaveSurfer component.

In `V1` all wavesurfer.js plugins are preimported. You just have to set name of a plugin and options for it. This decision could result in cases, when custom plugins can only be added via accessing reference of wavesurfer. Thus, `plugins` prop behaves like `initialPlugins`.

```js
// Version 1 plugins prop format
// either pass a string, that is a keyword associated with a plugin, 
// or pass an object, with "name" property, that is a plugin keyword and with "options" property 
// to configure it
const pluginsV1 = [
  "minimap",
  { name: "regions", options: { dragSelection: true } }
];
```

In `V2`, another approach was taken. Requirements for new system were: 
1. only a required set of plugins should be passed, (you import only what you need)
2. custom plugins should be available to be used with new plugins system,
3. plugins prop format should be easily controlled, so that dynamic disable/enable of plugins would be easy to implement.

```js
// Version 2 plugins prop format
// now you have to pass always an array of objects, where each can contain three properties,
// only one of them is required - plugin;
// plugin property is a plugin class, imported from wavesurfer.js
// example:
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";

const pluginsV2 = [
  {
    plugin: RegionsPlugin,
    options: { dragSelection: true }
  },
  {
    plugin: TimelinePlugin,
    options: {
      container: "#timeline"
    }
  },
  {
    plugin: CursorPlugin
  }
];
```

#### Remove of TimeLine component
Timeline component has been removed in `V2` becuase the only thing we could do with it is to set `id` attr, so that it was be foundable by TimelinePlugin.  

## User Guide
### Components
Package provides the following set of components:
1. WaveSurfer
2. WaveForm
3. Region

#### WaveSurfer
Core component of the package.   
It creates wavesurfer instance and watches for changes in plugins list.  
It accepts the following props set:
1. plugins
2. onMount

##### Plugins Prop
Is a list of plugins to use by WaveSurfer.
Has the following format:
```js
import { WaveSurfer } from 'wavesurfer-react';
import MyCustomPlugin from 'my-custom-plugin-path'; 

const myPlugin = {
    plugin: MyCustomPlugin,
    options: {
        someGreatOption: 'someGreatValue'
    },
    creator: 'myCustomCreate'
};

const plugins = [myPlugin];

<WaveSurfer plugins={plugins} />
```
The `plugins` prop is watched inside WaveSurfer and if changed, then WaveSurfer will react on that.  
If plugin was disabled (it's not enlisted in `plugins` prop) it will be destroyed, else added to wavesurfer plugins list and immediately initialized.

##### onMount prop
Is a function, that will be called after WaveSurfer instance has been mounted.  
Has only one argument - WaveSurfer instance.


#### WaveForm
This is used to configure WaveForm.
It accepts all options, passed into WaveSurfer.create, but except **plugins**.  
[Read the full list of available options](https://wavesurfer-js.org/docs/options.html).

#### Region
It is a some kind of a helper component. It can be used to imperatively control regions, appearing on WaveForm if you're using RegionsPlugin.  
If some of regions is already exist, then you will not face duplicates.   
On mount, it will try to find region with the same region identifier and then attaches itself to it.  
If region component did not find appropriate region, then it create region itself.

It accepts the following props:
1. onOver - is called when mouse enters a region
2. onLeave - is called when moused leaves a region
3. onClick - is called on a mouse click on a region
4. onDoubleClick - is called on double click
5. onIn - is called when playback enters a region
6. onOut - is called when playback leaves a region
7. onRemove - is called just before region remove
8. onUpdate - is called on each region's options update
9. onUpdateEnd - is called when dragging or resizing are finished

Rest passed props are passed as region's data into wavesurfer.

## Demo
You can see how this package is intended to be used 
[here](https://codesandbox.io/s/wavesurfer-react-20-gqvb6?from-embed)

## Roadmap
 - [x] Easy plugin add and remove after mount*
 - [x] Typings: **PropTypes** vs Flow vs TypeScript
 - [ ] Make researches on webpack usage possibility and profit of such decision for bundling. 
 - [ ] Reduce amount of spelling mistakes in readme. 

P.S. Tasks that are marked with start are in theory possible.
