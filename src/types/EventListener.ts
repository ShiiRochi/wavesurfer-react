import { GeneralEventTypes } from "wavesurfer.js/dist/event-emitter";

export type EventListener<EventTypes extends GeneralEventTypes, EventName extends keyof EventTypes> = (...args: EventTypes[EventName]) => void;