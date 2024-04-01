## Signal Options

- stopEmit - eine Direktive, die bestimmt, in welchen Fällen ein emit() tatsächlich zur Ausführung kommt
  - never (default) - egal was irgendwelche Handler zurückliefern, emit() wird immer durchgeführt
  - fail-any - wenn nur ein Handler failed, wird der emit() nicht ausgeführt
  - fail-all - nur wenn alle Handler failen, wird der emit() nicht ausgeführt

- guardSuccessTest - eine Methode, die beschreibt, wann ein Handler als Success gilt
  - default: (val) => { return val === true || typeof val === "undefined"}

Guards implementieren

Tests schreiben für guards
Readme schreiben

evtl ein debounce welches schnell aufeinander folgende Signals in der Menge begrenzt