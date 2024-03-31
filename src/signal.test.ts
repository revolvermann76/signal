import { signal, computed } from "./index";

describe('testing signal', () => {
    test('signal generator is there', () => {
        expect(typeof signal).toBe("function");
    });

    test('we created a signal', () => {
        const s = signal();
        expect(typeof s).toBe("function");
    });

    test('set initial value and read the same value', () => {
        const testValue = "Whatever";
        const s = signal(testValue);
        expect(s()).toBe(testValue);
    });

    test('dispatched a signal and read the same value', () => {
        const s = signal();
        const testValue = "Whatever";
        s.dispatch(testValue);
        expect(s()).toBe(testValue);
    });

    test('check if simple subscription works', () => {
        const testValue = "Whatever";
        const s = signal();
        return (new Promise((res, rej) => {
            s.bind(value => {
                res(value);
            }, false)
            s.dispatch(testValue);
        })).then(data => {
            expect(data).toBe(testValue);
        });
    });

});

describe('testing computed', () => {
    test('computed generator is there', () => {
        expect(typeof computed).toBe("function");
    });

    const s1 = signal<number>(4);
    const s2 = signal<number>(3);
    const c = computed(() => { return s1() * s2() }, [s1, s2]);
    test('we created a computing computed', () => {
        expect(c()).toBe(12);
    });

    test('computed updates correctly', () => {
        s2.dispatch(4);
        expect(c()).toBe(16);
    });


    test('check if simple subscription works', () => {
        return (new Promise((res, rej) => {
            c.bind(value => {
                res(value);
            }, false)
            s1.dispatch(2);
        })).then(data => {
            expect(data).toBe(8);
        });
    });


});

