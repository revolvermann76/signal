import { signal, computed } from "../index";

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

    test('binding works', () => {
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

    test('suspended binding works', () => {
        const testValue = "Whatever";
        const s = signal();
        const prom = new Promise((res, rej) => {
            const binding = s.bind(value => {
                res(value);
            }, false);
            binding.suspend();
            s.emit(testValue);
        });

        const timeOut = new Promise((res, rej) => {
            setTimeout(() => {
                res("timeout");
            }, 30)
        })

        return Promise.race([prom, timeOut]).then((result) => {
            expect(result).toBe("timeout")
        });
    });

    test('resume binding works', () => {
        const testValue = "Whatever";
        const s = signal();
        const prom = new Promise((res, rej) => {
            const binding = s.bind(value => {
                res(value);
            }, false);
            binding.suspend();
            binding.resume();
            s.emit(testValue);
        });

        const timeOut = new Promise((res, rej) => {
            setTimeout(() => {
                res("timeout");
            }, 30)
        })

        return Promise.race([prom, timeOut]).then((result) => {
            expect(result).toBe(testValue)
        });
    });

    test('dispose binding works', () => {
        const testValue = "Whatever";
        const s = signal();
        const prom = new Promise((res, rej) => {
            const binding = s.bind(value => {
                res(value);
            }, false);
            binding.dispose();
            s.emit(testValue);
        });

        const timeOut = new Promise((res, rej) => {
            setTimeout(() => {
                res("timeout");
            }, 30)
        })

        return Promise.race([prom, timeOut]).then((result) => {
            expect(result).toBe("timeout")
        });
    });

    test('suspended signal works', () => {
        const testValue = "Whatever";
        const s = signal();
        s.suspend();
        const prom = new Promise((res, rej) => {
            const binding = s.bind(value => {
                res(value);
            }, false);
            s.emit(testValue);
        });

        const timeOut = new Promise((res, rej) => {
            setTimeout(() => {
                res("timeout");
            }, 30)
        })

        return Promise.race([prom, timeOut]).then((result) => {
            expect(result).toBe("timeout")
        });
    });

    test('resumed signal works', () => {
        const testValue = "Whatever";
        const s = signal();
        s.suspend();
        s.resume();
        const prom = new Promise((res, rej) => {
            const binding = s.bind(value => {
                res(value);
            }, false);
            s.emit(testValue);
        });

        const timeOut = new Promise((res, rej) => {
            setTimeout(() => {
                res("timeout");
            }, 30)
        })

        return Promise.race([prom, timeOut]).then((result) => {
            expect(result).toBe(testValue);
        });
    });

    test('dispose signal works', () => {
        const testValue = "Whatever";
        const s = signal();
        s.dispose();
        const prom = new Promise((res, rej) => {
            const binding = s.bind(value => {
                res(value);
            }, false);
            s.emit(testValue);
        });

        const timeOut = new Promise((res, rej) => {
            setTimeout(() => {
                res("timeout");
            }, 30)
        })

        return Promise.race([prom, timeOut]).then((result) => {
            expect(result).toBe("timeout")
        });
    });

    test('guard blocking works (simple value)', () => {
        const testValue = "Whatever";
        const s = signal<string>("", { stopEmit: "fail-any" });
        s.guard((value, oldValue) => {
            return false;
        })

        s.bind(value => {
            // will never happen
        }, false);

        return (new Promise((res, rej) => {
            s.emit(testValue).then(() => { }, (err) => {
                console.log(err)
                res("successfully blocked")
            })
        })).then((result) => {
            expect(result).toBe("successfully blocked")
        });
    });

    test('guard let through works (simple value)', () => {
        const testValue = "Whatever";
        const s = signal("", { stopEmit: "fail-any" });
        s.guard((value, oldValue) => {
            return value === testValue;
        })

        const prom = new Promise((res, rej) => {
            const binding = s.bind(value => {
                res(value);
            }, false);
            s.emit(testValue);
        });

        const timeOut = new Promise((res, rej) => {
            setTimeout(() => {
                res("timeout");
            }, 30)
        })

        return Promise.race([prom, timeOut]).then((result) => {
            expect(result).toBe(testValue)
        });
    });

    test('guard blocking works (promise)', () => {
        const testValue = "Whatever";
        const s = signal<string>("", { stopEmit: "fail-any" });
        let error;
        s.guard((value, oldValue) => {
            return new Promise((res, rej) => {
                rej("bad mood");
            });
        });

        s.guard((value, oldValue) => {
            return new Promise((res, rej) => {
                rej("harsh wheather");
            });
        });

        s.bind(value => {
            // will never happen
        }, false);

        return (new Promise((res, rej) => {
            s.emit(testValue).then(() => { }, (err) => {
                console.log(err);
                res("successfully blocked")
            })
        })).then((result) => {
            expect(result).toBe("successfully blocked")
        });
    });

    test('guard let through works (promise)', () => {
        const testValue = "Whatever";
        const s = signal("", { stopEmit: "fail-any" });
        s.guard((value, oldValue) => {
            return new Promise((res, rej) => {
                res("good mood")
            });
        })

        const prom = new Promise((res, rej) => {
            const binding = s.bind(value => {
                res(value);
            }, false);
            s.emit(testValue);
        });

        const timeOut = new Promise((res, rej) => {
            setTimeout(() => {
                res("timeout");
            }, 30)
        })

        return Promise.race([prom, timeOut]).then((result) => {
            expect(result).toBe(testValue)
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

