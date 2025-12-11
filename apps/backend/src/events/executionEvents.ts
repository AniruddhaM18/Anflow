import { EventEmitter } from "events";

export const executionEvents = new EventEmitter();
executionEvents.setMaxListeners(0); // unlimited listeners
