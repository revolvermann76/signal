# Signals

Signals is a publish-subscribe library.

## simple usage

```typescript
const mySignal = signal<number>(7); // 7 is the initial value of the signal

console.log(mySignal()); // 7

const binding = mySignal.bind((newValue: number, oldValue: number) => { 
    // this binding is getting called each time the value of the signal changes
	console.log(`Replaced ${oldValue} with ${newValue}`);
})

mySignal.emit(22)

// ==> Replaced 7 with 22

mySignal.suspend() // a suspended signal will pause its funktionality ...
mySignal.resume() // so let's resume it

binding.suspend() // you can suspend a binding too ...
binding.resume() // ... and resume it

const anotherBinding = mySignal.once((newValue: number, oldValue: number) => { 
    // this binding works exactly one time
	console.log(`Set ${newValue} and replaced ${oldValue}`);
})

binding.dispose() // You can dispose a single binding ...

mySignal.dispose() // ... or a whole signal
```

## guards

guards will stop a signal from emitting

```typescript
const mySignal = signal<number>(7, {
	stopEmit: "fail-any", // if any guard fails, the signal will not emit
	guardSuccessTest: (val) => { // a filter function that determines how a success looks like
	    return val === true;
	}
});

mySignal.guard((value)=>{
	return value === 13 ? false : true;
})

const binding = mySignal.bind((newValue: number, oldValue: number) => { 
    // this binding is getting called each time the value of the signal changes
	console.log(`Replaced ${oldValue} with ${newValue}`);
})

mySignal.emit(22) // ==> Replaced 7 with 22
mySignal.emit(13) // ==> nothing happens

fetchApprovement() {
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			resolve(true);
		}, 1000)
	})
}

mySignal.guard((value)=>{ // a promising guard
	return fetchApprovement();
})
```

## computed signals

signal the gets its value by other signals

```typescript
const signal1 = signal<number>(4);
const signal2 = signal<number>(3);
const myComputedSignal = computed(
	() => { // a function that calculates the value of this
		return signal1() * signal2() 
	}, 
	[signal1, signal2] // name the triggering signals
);

myComputedSignal.bind((newValue: number, oldValue: number) => { 
    // this binding is getting called each time the value of the signal changes
	console.log(`Replaced ${oldValue} with ${newValue}`);
})

signal2.emit(4) // ==> Replaced 12 with 16
```

