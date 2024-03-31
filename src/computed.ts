import { TSignal } from "./TSignal";

/**
 * Ein ComputedSignal ist ein Signal, dessen Wert durch Verknüpfung anderer Signals entsteht
 */
type TComputedSignal = TSignal & {
}

/**
 * Function zum Erstellen eines ComputedSignals
 * @param fn 
 * @param trigger 
 * @returns 
 */
function computed(fn: Function, trigger: TSignal[]): TComputedSignal {
    return; //TODO
}


export { TComputedSignal, computed }