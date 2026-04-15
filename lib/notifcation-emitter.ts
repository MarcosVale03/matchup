import { EventEmitter } from "events";

// Global singleton so the join route and SSE route share the same emitter
const globalEmitter = global as typeof global & {
    notificationEmitter?: EventEmitter;
};

if (!globalEmitter.notificationEmitter) {
    globalEmitter.notificationEmitter = new EventEmitter();
    globalEmitter.notificationEmitter.setMaxListeners(100);
}

export const notificationEmitter = globalEmitter.notificationEmitter;