import { TBinding } from "./binding";

type TSignalState = "working" | "suspended" | "disposed";

/**
 * Ein Signal ist ein reatives Element zur Datenhaltung
 */
type TSignal<T> = {

    bind: (handler: Function, instant?: boolean) => TBinding;


    once: (Function, boolean?) => TBinding;

    dispose: () => void;

    suspend: () => void;

    resume: () => void;

    state: () => TSignalState

    /**
     * der Getter liefert den Wert des Signals
     */
    (): T;
}

export { TSignal, TSignalState }