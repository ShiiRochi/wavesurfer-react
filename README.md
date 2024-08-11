<img src="https://github.com/user-attachments/assets/c1c71292-9758-477e-ad82-ad94557163a6" width="125"/>

<h1>Wavesurfer React</h1>

[![minified](https://badgen.net/bundlephobia/min/wavesurfer-react)](https://bundlephobia.com/package/wavesurfer-react)
[![minzipped](https://badgen.net/bundlephobia/minzip/wavesurfer-react)](https://bundlephobia.com/package/wavesurfer-react)
[![downloads](https://badgen.net/npm/dw/wavesurfer-react)](https://npmjs.com/package/wavesurfer-react)

A simple wrapper around an awesome library called [wavesurfer.js](https://wavesurfer-js.org).  

The purpose of the package is to provide an abstraction over wavesurfer.js API 
and to do it as close to react style of doing things as its maintainer(-s) can provide.

**LiveDemo:**

[<img src="https://img.shields.io/badge/Codesandbox-040404?style=for-the-badge&logo=codesandbox&logoColor=DBDBDB">](https://codesandbox.io/p/sandbox/wavesurfer-react-3-0-w8vr3m)

[<img alt="Static Badge" src="https://img.shields.io/badge/Live_Demo-black?style=for-the-badge&logo=yandexcloud&logoColor=red">
](https://wavesurfer-react.website.yandexcloud.net)

> [!IMPORTANT]  
> Since October 2023 I am occupied on a full-time job where it's not currently required to use any audio related modules.  
> I'll try to pay as much attention as possible for this repo, but not as much as previously because I need to prioritize things.  
> I'll keep this module to be as simple as possible and open to contributions.

# Table of Contents

- [Wavesurfer React](#wavesurfer-react)
   * [User Guide](#user-guide)
      + [Components](#components)
         - [WaveSurfer](#wavesurfer)
         - [WaveForm](#waveform)
         - [Region](#region)
         - [Marker](#region)
      + [Hooks](#hooks)
         - [useWavesurfer](#usewavesurfer)
         - [useRegionEvent](#useregionevent)
         - [useRegionsPluginEvent](#useregionpluginevent)
         - [useWaveSurferContext](#usewavesurfercontext)
   * [Known Issues and Workarounds](#known-issues-and-workarounds)

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
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
import MyCustomPlugin from 'my-custom-plugin-path';

const plugins = [
   {
      plugin: RegionsPlugin,
      key: "regions",
      options: { dragSelection: true }
   },
   {
      plugin: TimelinePlugin,
      key: "timeline",
      options: {
         container: "#timeline"
      }
   },
   {
      plugin: MyCustomPlugin,
      key: "my-custom-plugin",
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

To correctly track initialized plugins, `key` property is used in item of `plugins` array.

##### onMount prop
It is a function, that is called after WaveSurfer instance has been mounted.  
It has only one argument - WaveSurfer instance.

##### WaveSurfer Options
You can pass here all options that is used to configure wavesurfer, i.e. [full list of available options](https://wavesurfer-js.org/docs/options.html).

#### WaveForm
It is used as an alias for:
```html
<div id="waveform"></div>
```



#### Region
Think of it as a some kind of helper component. 
It can be used to imperatively control regions, appearing on WaveForm if you're using RegionsPlugin.  
If region is already present of WaveForm it creation will be avoided and existing instance is used.
On mount, it will try to find region with the same region identifier and then attaches itself to it.  
If the Region component did not find an appropriate region, then it creates a region itself.

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
Special component using Region under the hood to display only markers.
Marker await all props of Region except `end` prop.

### Hooks

Package provides the following set of hooks:
1. useWavesurfer
2. useRegionEvent
3. useRegionPluginEvent
4. useWaveSurferContext

#### useWavesurfer
This hook is used inside WaveSurfer and its purpose is to create wavesurfer instance and return it.  
It also handles a task of creating and destroying wavesurfer plugins, after `plugins` prop update detection.

You can use it standalone to create you own (more specific) wavesurfer component that will handle more than a component that is provided out-of-the-box.

#### useRegionEvent
Is used inside the `Region` component to subscribe to region-related events. 
Can be used by developers, if they wanna to, inside a HOC-like component over `Region` component 
that is provided by the package or any other component, that is rendered inside `WaveSurfer` component, 
but for the latter task you will have to get region instance first.

#### useRegionPluginEvent
Is used inside the `Region` component to subscribe to region plugin related events. 
Can be used by developers, if they wanna to, inside a HOC-like component over `Region` component 
that is provided by the package or any other component, that is rendered inside `WaveSurfer` component, 
but for the latter task you will have to get regions plugin instance first.

#### useWaveSurferContext
Returns a tuple of: 
1. wavesurfer instance, 
2. mapped object of enabled plugins keyed by the `key` property passed alongside a plugin, 
3. an array containing these plugins.

## Known Issues and Workarounds
### Regions desynchronization
Issues with regions synchronization when using redux and `Region` component. 
Try to not hard-bind redux-state with wavesurfer-react too tight or use an instance of wavesurfer to operate regions.

### Timeline issues
[**FIXED**](https://github.com/katspaugh/wavesurfer.js/pull/3327/files): Timeline is not visible after removing it from plugins array and adding again. I hope it is a temporal issue with the original package.
Comments related to this issue are:
[Comment #1](https://github.com/ShiiRochi/wavesurfer-react/issues/72#issuecomment-1793807986)  
[Comment #2](https://github.com/ShiiRochi/wavesurfer-react/issues/72#issuecomment-1793968082)  
[Comment #3](https://github.com/ShiiRochi/wavesurfer-react/issues/72#issuecomment-1794293542)

**INFO**: use `wavesurfer.js@^7.4.5` to have this issue fixed

**Solution** to this problem is **to execute** `wavesurfer.setOptions({})`, right after Timeline plugin is added again via `plugins` prop second time and further.

## Infographics

### Stars History

Thanks for your support and contributions!

[![Star History Chart](https://api.star-history.com/svg?repos=ShiiRochi/wavesurfer-react&type=Date)](https://star-history.com/#ShiiRochi/wavesurfer-react&Date)


## Credits

Logo: Facebook, <a href="https://commons.wikimedia.org/wiki/File:React-icon.svg">React-icon</a>, place another image at the center of this image by shiirochi@yandex.ru, <a href="https://creativecommons.org/licenses/by-sa/1.0/legalcode" rel="license">CC BY-SA 1.0</a>
