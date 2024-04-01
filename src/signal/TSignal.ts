import { TBinding } from "./binding";

type TSignalState = "working" | "suspended" | "disposed";

/**
 * A Signal is a reactive element for data management
 */
type TSignal<T> = {

    bind: (handler: Function, instant?: boolean) => TBinding;

    guard: (handler: Function) => void;

    once: (Function, boolean?) => TBinding;

    dispose: () => void;

    suspend: () => void;

    resume: () => void;

    state: () => TSignalState;

    /**
     * The getter returns the value of the signal
     */
    (): T;
};

export { TSignal, TSignalState };
