# Wavesurfer React
A simple wrapper around an awesome library called [wavesurfer.js](https://wavesurfer-js.org).  

The purpose of the package is to provide an abstraction over wavesurfer.js API 
and to do it as close to react style of doing things as its maintainer(-s) can provide.

**LiveDemo:**

[<img src="https://img.shields.io/badge/Codesandbox-040404?style=for-the-badge&logo=codesandbox&logoColor=DBDBDB">](https://codesandbox.io/s/wavesurfer-react-20-gqvb6)

# Table of Contents

- [Wavesurfer React](#wavesurfer-react)
   * [User Guide](#user-guide)
      + [Components](#components)
         - [WaveSurfer](#wavesurfer)
         - [WaveForm](#waveform)
         - [Region](#region)
         - [Marker](#marker)
      + [Hooks](#hooks)
         - [useWavesurfer](#usewavesurfer)
         - [useRegionEvent](#useregionevent)
         - [useWaveSurferContext](#usewavesurfercontext)
   * [Known Issues and Workarounds](#known-issues-and-workarounds)
   * [Roadmap](#roadmap)

<br />

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
```jsx
import { WaveSurfer } from 'wavesurfer-react';
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";
import MyCustomPlugin from 'my-custom-plugin-path';

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
   },
   {
      plugin: MyCustomPlugin,
      options: {
         someGreatOption: 'someGreatValue'
      },
      creator: 'myCustomCreate'
   }
];

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

Rest given props are passed as region's data into wavesurfer.

#### Marker
Can be used to imperatively control markers.
For now, only `time` is updatable and is watched for further updates, that are coming from outside of component.

It accepts the following props:
1. `onClick` is emitted when marker is clicked  
2. `onDrag` is emitted when drag operation is started  
3. `onDrop` is emitted when element is released after drag

Rest passed props are used as marker's data

### Hooks

Package provides the following set of hooks:
1. useWavesurfer
2. useRegionEvent
3. useWaveSurferContext

#### useWavesurfer
This hook is used inside WaveSurfer and its purpose is to create wavesurfer instance and return it.  
It also handles a task of creating and destroying wavesurfer plugins, after `plugins` prop update detection.

You can use it standalone to create you own (more specific) wavesurfer component that will handle more than a component that is provided out-of-the-box.

#### useRegionEvent
Is used inside Region component to subscribe to region related events. 
Can be used by developers, if they wanna to, inside a HOC-like component over `Region` component 
that is provided by the package or any other component, that is rendered inside `WaveSurfer` component, 
but for the latter task you will have to get region instance first.

#### useWaveSurferContext
Is used inside `Region` component to get `wavesurfer` instance. Can be used inside any custom component you will create and render within the borders of `WaveSurfer` component.

## Known Issues and Workarounds
1. Issues with regions synchronization when using redux and `Region` component. 
   Try to not hard-bind redux-state with wavesurfer-react too tight or use an instance of wavesurfer to operate regions. 
2. [#2417: markers drag handlers not initialized with empty markers array in initial config](https://github.com/katspaugh/wavesurfer.js/issues/2417). Workaround is also presented there (and in demo link). You can use `onMount` to instantly clear artificial markers.


## Roadmap
 - [x] Easy plugin add and remove after mount*
 - [x] Typings: **PropTypes** vs Flow vs TypeScript
 - [x] TypeScript is coming, maybe... 
 - [x] Reduce amount of spelling mistakes in readme. 

P.S. Tasks that are marked with start are in theory possible.
