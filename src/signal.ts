
import { TSignal } from "./TSignal";
import { TBinding, createBinding } from "./binding"


/**
 * Ein WriteableSignal ist ein Signal, dessen Wert man aktiv setzen kann
 */
type TWriteableSignal<T> = TSignal & {
    /**
     * der Setter für das Signal
     */
    (value: T): void;

    /**
     * der Getter für das Signal
     */
    (): T;
};

/**
 * Erstellen eines TWriteableSignal
 * @param initialValue initialer Wert
 * @returns ein TWriteableSignal
 */
function signal<T>(initialValue?: T): TWriteableSignal<T> {
    let _value: T = initialValue;
    let _bindings: TBinding[] = [];
    let _state: "working" | "suspended" | "disposed" = "working";

    // informiert alle Bindings über die neue Wertänderung
    function notify(value, oldValue) {
        for (let subscriber of _bindings) {
            if (subscriber.state === "bound") {
                subscriber.handler(_value);
                if (subscriber.once) {
                    subscriber.dispose();
                }
            }
        }
    }

    const SIGNAL = function (value?: T) {
        if (arguments.length) { //Setter
            if (_state === "disposed" || _state === "suspended") { return; }
            const oldValue = _value;
            _value = value as T;
            notify(_value, oldValue);
            return;
        } else { //Getter
            return _value
        }
    }

    SIGNAL.bind = (handler: Function, instant = true): TBinding => {
        const binding = createBinding(handler, {
            once: false
        });

        if (instant) {
            handler(_value);
        }
        _bindings.push(binding);
        return; //TODO
    }

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
    }

    SIGNAL.dispose = (): void => { // ok
        _state = "disposed";
    }

    SIGNAL.suspend = (): void => { // ok
        if (_state !== "disposed")
            _state = "suspended";
    }

    SIGNAL.resume = (): void => { // ok 
        if (_state !== "disposed")
            _state = "working";
    }

    return SIGNAL;
}



export { signal, TBinding, TWriteableSignal }