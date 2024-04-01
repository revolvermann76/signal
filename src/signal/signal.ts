import { TSignal, TSignalState } from "./TSignal";
import { TBinding, createBinding } from "./binding";

/**
 * A WriteableSignal is a signal whose value can be actively set
 */
type TWriteableSignal<T> = TSignal<T> & {
    emit: (value: T) => Promise<void>;
};

type TSignalOptions = {
    stopEmit?: "never" | "fail-any" | "fail-all";
    guardSuccessTest?: (unknown) => boolean;
}

type TGuard<T = unknown> = (newValue: T, oldValue: T) => unknown;

const defaultGuardSuccessTest = (val) => {
    return val === true || typeof val === "undefined";
}

/**
 * Function to create a WriteableSignal
 * @param initialValue initial value
 * @param options 
 * @returns a TWriteableSignal
 */
function signal<T = unknown>(initialValue?: T, options?: TSignalOptions): TWriteableSignal<T> {
    let _value: T = initialValue;
    let _bindings: TBinding[] = [];
    let _state: TSignalState = "working";
    let _guards: TGuard[] = [];

    const _options = options || {};
    _options.stopEmit = _options.stopEmit || "never";
    _options.guardSuccessTest = _options.guardSuccessTest || defaultGuardSuccessTest;

    /**
     * Returns the value of the signal
     * @param value the value of the signal
     * @returns 
     */
    const SIGNAL = function (value?: T) {
        return _value;
    };

    async function checkGuards(value, oldValue): Promise<void> {

        // if we have no guards or emit should never be stopped we return succesful
        if (_options.stopEmit === "never" || _guards.length === 0) {
            return;
        }

        let responses = [];
        let promises: Promise<unknown>[] = [];

        // let's collect all responses of all guards
        for (let guard of _guards) {
            responses.push(guard(value, oldValue));
        }

        // some responses are no promises
        // run through responses and transform them into promises if needed
        for (let i = 0; i < responses.length; i++) {
            const response = responses[i];
            if (response instanceof Promise) {
                promises.push(response);
            } else {
                const success = _options.guardSuccessTest(response);
                promises.push(
                    success ? Promise.resolve(response) : Promise.reject(response)
                );
            }
        }

        // collect all successes and all fails
        const successes = [];
        const fails = [];
        await Promise.allSettled(promises).then((results) => {
            results.forEach(
                (result) => {
                    if (result.status === "fulfilled") {
                        successes.push(result.value);
                    } else {
                        fails.push(result.reason);
                    }
                }
            )
        });

        if (_options.stopEmit === "fail-any") {
            // even one fail stops the emitting
            if (fails.length) {
                throw new Error(JSON.stringify(fails));
            }
        } else if (_options.stopEmit === "fail-all") {
            // we only have a real fail if everything fails
            if (successes.length === 0) {
                throw new Error(JSON.stringify(fails))
            }
        }

        // if we reach this point, the emitting is approved
        return;
    }

    // informs all bindings about the new value change
    function notify(value, oldValue) {
        // run through all bindings and collect the responses
        for (let binding of _bindings) {
            if (binding.state !== "bound") {
                continue;
            }

            try {
                binding.handler(value, oldValue)
            } catch (error) {
                // do nothing
            }
            if (binding.once) {
                binding.dispose();
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
        return binding;
    };

    /**
     * Destroys the signal. After that, it is only readable but has no function anymore
     */
    SIGNAL.dispose = (): void => { // ok
        _state = "disposed";
    };


    /**
     * Assigns a new value to the signal
     * @param value - the new value of the signal
     * @returns 
     */
    SIGNAL.emit = async (value?: T): Promise<void> => {
        cleanUpBindings();
        if (_state === "disposed" || _state === "suspended") {
            return; // nothing happens
        };

        try {
            const oldValue = _value;
            await checkGuards(value, oldValue);
            _value = value;
            notify(_value, oldValue);
        } catch (error) {
            throw error;
        }
    };

    /**
     * Register a fn to stop a signal
     * @param guard 
     */
    SIGNAL.guard = (guard: TGuard): void => {
        _guards.push(guard);
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

    /**
     * Pauses the signal. While paused, it is non-functional.
     */
    SIGNAL.suspend = (): void => { // ok
        if (_state !== "disposed")
            _state = "suspended";
    };

    return SIGNAL;
}

export { signal, TWriteableSignal, TSignalOptions, TGuard };
