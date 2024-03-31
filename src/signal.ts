import { TSignal, TSignalState } from "./TSignal";
import { TBinding, createBinding } from "./binding";

/**
 * A WriteableSignal is a signal whose value can be actively set
 */
type TWriteableSignal<T> = TSignal<T> & {
    emit: (value: T) => void;
};

/**
 * Function to create a WriteableSignal
 * @param initialValue initial value
 * @returns a TWriteableSignal
 */
function signal<T = unknown>(initialValue?: T): TWriteableSignal<T> {
    let _value: T = initialValue;
    let _bindings: TBinding[] = [];
    let _state: TSignalState = "working";

    /**
     * Returns the value of the signal
     * @param value the value of the signal
     * @returns 
     */
    const SIGNAL = function (value?: T) {
        return _value;
    };

    // informs all bindings about the new value change
    function notify(value, oldValue) {
        for (let binding of _bindings) {
            if (binding.state === "bound") {
                binding.handler(_value);
                if (binding.once) {
                    binding.dispose();
                }
            }
        }
    }

    // deletes all bindings that have already been disposed
    function cleanUpBindings() {
        _bindings = _bindings.filter(
            b => b.state !== "disposed"
        );
    }

    /**
     * Assigns a new value to the signal
     * @param value - the new value of the signal
     * @returns 
     */
    SIGNAL.emit = (value?: T) => {
        cleanUpBindings();
        if (_state === "disposed" || _state === "suspended") { return; }
        const oldValue = _value;
        _value = value as T;
        notify(_value, oldValue);
        return;
    };

    /**
     * Establishes a binding to a signal
     * @param Function handler - A handler that is called every time the signal gets a new value
     * @param boolean instant - if true, the binding will be triggered immediately
     * @returns A Binding object
     */
    SIGNAL.bind = (handler: Function, instant = true): TBinding => {
        const binding = createBinding(handler, {
            once: false
        });

        if (instant) {
            handler(_value);
        }
        _bindings.push(binding);
        return; //TODO
    };

    /**
     * Establishes a binding to a signal that is executed only once
     * @param Function handler - A handler that is called every time the signal gets a new value
     * @param boolean instant - if true, the binding will be triggered immediately
     * @returns A Binding object
     */
    SIGNAL.once = (handler: Function, instant = true): TBinding => {
        const binding = createBinding(handler, {
            once: true
        });

        if (instant) {
            handler(_value);
            binding.dispose();
        } else {
            _bindings.push(binding);
        }

        return binding;
    };

    /**
     * Destroys the signal. After that, it is only readable but has no function anymore
     */
    SIGNAL.dispose = (): void => { // ok
        _state = "disposed";
    };

    /**
     * Pauses the signal. While paused, it is non-functional.
     */
    SIGNAL.suspend = (): void => { // ok
        if (_state !== "disposed")
            _state = "suspended";
    };

    /**
     * Reactivates a paused signal.
     */
    SIGNAL.resume = (): void => { // ok 
        if (_state !== "disposed")
            _state = "working";
    };

    /**
     * Returns the state of the signal
     * @returns the current state of the signal
     */
    SIGNAL.state = (): TSignalState => {
        return _state;
    };

    return SIGNAL;
}

export { signal, TBinding, TWriteableSignal };