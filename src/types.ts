import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import { GeneralEventTypes } from "wavesurfer.js/dist/event-emitter";

export interface PluginType<GPlug extends GenericPlugin> {
    key: string;
    plugin: GPlug;
    options: any;
    creator?: string;
}

export type EventListener<EventTypes extends GeneralEventTypes, EventName extends keyof EventTypes> = (...args: EventTypes[EventName]) => void;
