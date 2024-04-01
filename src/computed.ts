import { TSignal } from "./TSignal";
import { TSignalOptions, signal } from "./signal";

/**
 * A ComputedSignal is a signal whose value is derived from the combination of other signals
 */
type TComputedSignal<T> = TSignal<T>;

/**
 * Function to create a ComputedSignal
 * @param computeFn 
 * @param trigger 
 * @returns 
 */
function computed<T = unknown>(computeFn: Function, trigger: TSignal<unknown>[], options?: TSignalOptions): TComputedSignal<T> {
    const _signal = signal<T>(undefined, options);

    /**
     * Returns the value of the signal 
     * @param value the value of the signal
     * @returns 
     */
    const SIGNAL = function (): T {
        return _signal();
    };

    // recalculates the value of the signal
    function reCompute() {
        let result = computeFn();
        _signal.emit(result);
    }

    // this signal is bound to all its triggers
    trigger.forEach((trig: TSignal<unknown>) => {
        trig.bind(reCompute, false);
    });

    // initial calculation of the value of the signal
    reCompute();

    /**
     * Establishes a binding to a signal
     * @param Function handler - A handler that is called every time the signal gets a new value
     * @param boolean instant - if true, the binding will be triggered immediately 
     * @returns A Binding object
     */
    SIGNAL.bind = _signal.bind;

    /**
     * Establishes a binding to a signal that is executed only once
     * @param Function handler - A handler that is called every time the signal gets a new value
     * @param boolean instant - if true, the binding will be triggered immediately 
     * @returns A Binding object
     */
    SIGNAL.once = _signal.once;

    /**
     * Destroys the signal. After that, it is only readable but has no function anymore
     */
    SIGNAL.dispose = _signal.dispose;

    /**
     * Pauses the signal. While paused, it is non-functional.
     */
    SIGNAL.suspend = _signal.suspend;

    /**
     * Reactivates a paused signal.
     */
    SIGNAL.resume = _signal.resume;

    /**
     * Returns the state of the signal
     * @returns the current state of the signal
     */
    SIGNAL.state = _signal.state;

    SIGNAL.guard = _signal.guard;

    return SIGNAL;
}

export { TComputedSignal, computed };