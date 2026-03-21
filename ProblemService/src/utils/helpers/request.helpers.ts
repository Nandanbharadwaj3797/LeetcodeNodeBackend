import { AsyncLocalStorage } from "async_hooks";
import { v4 as uuidV4 } from "uuid";

type AsyncLocalStorageType = {
    correlationId: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<AsyncLocalStorageType>(); // Created an instance of AsyncLocalStorage


export const getCorrelationId = () => {
    const asyncStore = asyncLocalStorage.getStore();
    return asyncStore?.correlationId || 'system'; // Non-request logs use a stable system correlation id
}

export const runWithCorrelationId = <T>(
    callback: () => T,
    correlationId: string = `system-${uuidV4()}`
): T => {
    return asyncLocalStorage.run({ correlationId }, callback);
}
