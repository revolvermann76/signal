
import { TSignal, TSignalState } from "./TSignal";
import { TBinding, createBinding } from "./binding"


/**
 * Ein WriteableSignal ist ein Signal, dessen Wert man aktiv setzen kann
 */
type TWriteableSignal<T> = TSignal<T> & {

    emit: (value: T) => void;
};

/**
 * Funktion zum Erstellen eines WriteableSignal
 * @param initialValue initialer Wert
 * @returns ein TWriteableSignal
 */
function signal<T = unknown>(initialValue?: T): TWriteableSignal<T> {
    let _value: T = initialValue;
    let _bindings: TBinding[] = [];
    let _state: TSignalState = "working";

    /**
     * Liefert den Wert des Signals 
     * @param value der WErt des Signals
     * @returns 
     */
    const SIGNAL = function (value?: T) {
        return _value
    }

    // informiert alle Bindings über die neue Wertänderung
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

    // löscht alle Bindings, die bereits disposed wurden
    function cleanUpBindings() {
        _bindings = _bindings.filter(
            b => b.state !== "disposed"
        )
    }

    /**
     * Übergibt dem Signal einen neuen Wert
     * @param value - der neue Wert des Signals
     * @returns 
     */
    SIGNAL.emit = (value?: T) => {
        cleanUpBindings();
        if (_state === "disposed" || _state === "suspended") { return; }
        const oldValue = _value;
        _value = value as T;
        notify(_value, oldValue);
        return;
    }

    /**
     * Stellt ein Binding zu einem Signal her
     * @param Function handler - Ein Handler der jedes Mal gerufen wird, wenn das Signal einen neuen Wert bekommt
     * @param boolean instant - wenn true, wird das Binding sofort ausgelöst 
     * @returns Ein Binding-Objekt
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
    }

    /**
     * Stellt ein Binding zu einem Signal her welches nur ein einziges mal ausgeführt wird
     * @param Function handler - Ein Handler der jedes Mal gerufen wird, wenn das Signal einen neuen Wert bekommt
     * @param boolean instant - wenn true, wird das Binding sofort ausgelöst 
     * @returns Ein Binding-Objekt
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
    }

    /**
     * Zerstört das Signal. Danach ist es nur noch lesbar, hat aber keine Funktion mehr
     */
    SIGNAL.dispose = (): void => { // ok
        _state = "disposed";
    }

    /**
     * Pausiert das Signal. Solange es pausiert ist, ist es ohne Funktion.
     */
    SIGNAL.suspend = (): void => { // ok
        if (_state !== "disposed")
            _state = "suspended";
    }

    /**
     * Reactiviert ein pausiertes Signal.
     */
    SIGNAL.resume = (): void => { // ok 
        if (_state !== "disposed")
            _state = "working";
    }

    /**
     * Liefert den Zustand des Signals
     * @returns der aktuelle Zustand des Signals
     */
    SIGNAL.state = (): TSignalState => {
        return _state;
    }

    return SIGNAL;
}



export { signal, TBinding, TWriteableSignal }