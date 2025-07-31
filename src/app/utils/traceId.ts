import { AsyncLocalStorage } from "async_hooks";

// *AsyncLocalStorage to store trace ID for each request
const storage = new AsyncLocalStorage<{ traceId?: string }>();

// *Set the trace ID in AsyncLocalStorage
export const setTraceId = (traceId: string) => {
  storage.enterWith({ traceId });
};

// *Get the trace ID from AsyncLocalStorage
export const getTraceId = () => {
  return storage.getStore()?.traceId;
};
