import { TBinding } from "./binding";

/**
 * Ein Signal ist ein reatives Element zur Datenhaltung
 */
type TSignal = {
    /**
     * Stellt ein Binding zu einem Signal her
     * @param Function handler - Ein Handler der jedes Mal gerufen wird, wenn das Signal einen neuen Wert bekommt
     * @param boolean instant - wenn true, wird das Binding sofort ausgelöst 
     * @returns Ein Binding-Objekt
     */
    bind: (handler: Function, instant?: boolean) => TBinding;

    /**
     * Stellt ein Binding zu einem Signal her welches nur ein einziges mal ausgeführt wird
     * @param Function handler - Ein Handler der jedes Mal gerufen wird, wenn das Signal einen neuen Wert bekommt
     * @param boolean instant - wenn true, wird das Binding sofort ausgelöst 
     * @returns Ein Binding-Objekt
     */
    once: (Function, boolean?) => TBinding;

    dispose: () => void;

    suspend: () => void;

    resume: () => void;


    /**
     * der Getter liefert den Wert des Signals
     */
    (): unknown;
}

export { TSignal }