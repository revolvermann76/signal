/**
 * Repräsentiert ein Binding auf ein Signal
 */
type TBinding = {
    /**
     * Ein Binding kann pausiert werden
     */
    suspend: () => void;

    /**
     * Fortsetzen eines pausierten Bindings
     */
    resume: () => void;

    /**
     * Zerstören eines Bindings
     */
    dispose: () => void;

    state: "bound" | "disposed" | "suspended";

    once: boolean;

    handler: Function;
};


function createBinding(
    handler: Function,
    options?: {
        once?: boolean
    }
): TBinding {
    options = options || {};
    let _state: "bound" | "disposed" | "suspended" = "bound";
    const _handler = handler;
    const _once = typeof options.once === "boolean" ? options.once : false;
    return {
        suspend() {
            if (_state !== "disposed") {
                _state = "suspended";
            }
        },
        resume() {
            if (_state !== "disposed") {
                _state = "bound";
            }
        },
        dispose() {
            _state = "disposed";
        },
        get state() {
            return _state;
        },
        get once() {
            return _once;
        },
        get handler() {
            return _handler;
        }
    }
}


export { TBinding, createBinding }