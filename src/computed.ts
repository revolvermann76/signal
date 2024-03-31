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

    /**
     * Liefert den Wert des Signals 
     * @param value der WErt des Signals
     * @returns 
     */
    const SIGNAL = function (): T {
        return _signal();
    }

    // berechnet den Wert des Signals neu
    function reCompute() {
        let result = computeFn();
        _signal.emit(result);
    }

    // diese Signal wird an all seine Trigger angebunden
    trigger.forEach((trig: TSignal<unknown>) => {
        trig.bind(reCompute, false);
    })

    // initiale Berechnung des Wertes des Signals
    reCompute();

    /**
     * Stellt ein Binding zu einem Signal her
     * @param Function handler - Ein Handler der jedes Mal gerufen wird, wenn das Signal einen neuen Wert bekommt
     * @param boolean instant - wenn true, wird das Binding sofort ausgelöst 
     * @returns Ein Binding-Objekt
     */
    SIGNAL.bind = _signal.bind;

    /**
     * Stellt ein Binding zu einem Signal her welches nur ein einziges mal ausgeführt wird
     * @param Function handler - Ein Handler der jedes Mal gerufen wird, wenn das Signal einen neuen Wert bekommt
     * @param boolean instant - wenn true, wird das Binding sofort ausgelöst 
     * @returns Ein Binding-Objekt
     */
    SIGNAL.once = _signal.once;

    /**
     * Zerstört das Signal. Danach ist es nur noch lesbar, hat aber keine Funktion mehr
     */
    SIGNAL.dispose = _signal.dispose;

    /**
     * Pausiert das Signal. Solange es pausiert ist, ist es ohne Funktion.
     */
    SIGNAL.suspend = _signal.suspend;

    /**
     * Reactiviert ein pausiertes Signal.
     */
    SIGNAL.resume = _signal.resume;

    /**
     * Liefert den Zustand des Signals
     * @returns der aktuelle Zustand des Signals
     */
    SIGNAL.state = _signal.state;

    return SIGNAL;
}

export { TComputedSignal, computed }