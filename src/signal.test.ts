import { signal } from "./index";


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
        s(testValue);
        expect(s()).toBe(testValue);
    });

    test('check if simple subscription works', () => {
        const testValue = "Whatever";
        const s = signal();
        return (new Promise((res, rej) => {
            s.bind(value => {
                res(value);
            }, false)
            s(testValue);
        })).then(data => {
            expect(data).toBe(testValue);
        });
    });

});
