import { TSignal } from "./TSignal";
import { signal } from "./signal";

/**
 * Ein ComputedSignal ist ein Signal, dessen Wert durch Verknüpfung anderer Signals entsteht
 */
type TComputedSignal<T> = TSignal<T>;

/**
 * Function zum Erstellen eines ComputedSignals
 * @param computeFn 
 * @param trigger 
 * @returns 
 */
function computed<T = unknown>(computeFn: Function, trigger: TSignal<unknown>[]): TComputedSignal<T> {
    const _signal = signal<T>();

    const SIGNAL = function (): T {
        return _signal();
    }

    function reCompute() {
        let result = computeFn();
        _signal.dispatch(result);
    }

    trigger.forEach((trig: TSignal<unknown>) => {
        trig.bind(reCompute, false);
    })

    reCompute();

    SIGNAL.once = _signal.once;
    SIGNAL.bind = _signal.bind;
    SIGNAL.dispose = _signal.dispose;
    SIGNAL.suspend = _signal.suspend;
    SIGNAL.resume = _signal.resume;
    SIGNAL.state = _signal.state;

    return SIGNAL;
}

export { TComputedSignal, computed }