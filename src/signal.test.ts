import { signal, computed } from "./index";

describe('testing signal', () => {
    test('signal generator exists', () => {
        expect(typeof signal).toBe("function");
    });

    test('we created a signal', () => {
        const s = signal();
        expect(typeof s).toBe("function");
    });

    test('set and read initial value', () => {
        const testValue = "Whatever";
        const s = signal(testValue);
        expect(s()).toBe(testValue);
    });

    test('emitted a signal and read the same value', () => {
        const s = signal();
        const testValue = "Whatever";
        return s.emit(testValue).then(data => {
            expect(s()).toBe(testValue);
        });
    });

    test('subscription works', () => {
        const testValue = "Whatever";
        const s = signal();
        return (new Promise((res, rej) => {
            s.bind(value => {
                res(value);
            }, false)
            s.emit(testValue);
        })).then(data => {
            expect(data).toBe(testValue);
        });
    });

});

describe('testing computed', () => {
    test('computed generator exists', () => {
        expect(typeof computed).toBe("function");
    });

    const s1 = signal<number>(4);
    const s2 = signal<number>(3);
    const c = computed(() => { return s1() * s2() }, [s1, s2]);
    test('computed value from two other signals', () => {
        expect(c()).toBe(12);
    });

    test('computed updates correctly', () => {
        return (new Promise((res, rej) => {
            c.bind(value => {
                res(value);
            }, false)
            s2.emit(4)
        })).then(data => {
            expect(data).toBe(16);
        });

    });


    test('subscription works', () => {
        return (new Promise((res, rej) => {
            c.bind(value => {
                res(value);
            }, false)
            s1.emit(2);
        })).then(data => {
            expect(data).toBe(8);
        });
    });
});

