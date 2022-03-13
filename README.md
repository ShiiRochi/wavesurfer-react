# Wavesurfer React
A simple wrapper around an awesome library called [wavesurfer.js](https://wavesurfer-js.org).  

The purpose of the package is to provide an abstraction over wavesurfer.js API 
and to do it as close to react style of doing things as its maintainer(-s) can provide.

```js
// Plugins prop format
// now you have to pass always an array of objects, where each can contain three properties,
// only one of them is required - plugin;
// plugin property is a plugin class, imported from wavesurfer.js
// example:
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";

const plugins = [
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

It is a list of plugins to use by WaveSurfer and has the following format:
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

The `plugins` prop is watched inside WaveSurfer.  
If plugin was disabled (it's not enlisted in `plugins` prop) it will be destroyed, 
otherwise added to wavesurfer plugins list and immediately initialized.

##### onMount prop
It is a function, that is called after WaveSurfer instance has been mounted.  
It has only one argument - WaveSurfer instance.


#### WaveForm
It is used to configure WaveForm.

It accepts all options, passed into WaveSurfer.create, but except **plugins**.  
[Read the full list of available options](https://wavesurfer-js.org/docs/options.html).

#### Region
Think of it as a some kind of helper component. 
It can be used to imperatively control regions, appearing on WaveForm if you're using RegionsPlugin.  
If region is already present of WaveForm it creation will be avoided and existing instance is used.
On mount, it will try to find region with the same region identifier and then attaches itself to it.  
If region component did not find appropriate region, then it creates a region itself.

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

#### Marker
Can be used to imperatively control markers.
For now, only `time` is updatable and is watched for further updates, that are coming from outside of component.

It accepts the following props:
1. `onClick` is emitted when marker is clicked  
2. `onDrag` is emitted when drag operation is started  
3. `onDrop` is emitted when element is released after drag

Rest passed props are used as marker's data

## Known Issues and Workaround
1. Issues with regions synchronization when using redux and `Region` component. 
   Try to not hard-bind redux-state with wavesurfer-react too tight or use an instance of wavesurfer to operate regions. 
2. [#2417: markers drag handlers not initialized with empty markers array in initial config](https://github.com/katspaugh/wavesurfer.js/issues/2417). Workaround is also presented there (and in demo link). You can use `onMount` to instantly clear artificial markers.


## Demo
You can see how this package is intended to be used 
[here](https://codesandbox.io/s/wavesurfer-react-20-gqvb6?from-embed)

## Roadmap
 - [x] Easy plugin add and remove after mount*
 - [x] Typings: **PropTypes** vs Flow vs TypeScript
 - [x] TypeScript is coming, maybe... 
 - [ ] Reduce amount of spelling mistakes in readme. 

P.S. Tasks that are marked with start are in theory possible.
