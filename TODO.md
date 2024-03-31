"disposed" bindings müssen aussortiert werden

ein Signal sollte Options entgegennehmen

- stopEmit - eine Direktive, die bestimmt, in welchen Fällen ein emit() tatsächlich zur Ausführung kommt
  - never (default) - egal was irgendwelche Handler zurückliefern, emit() wird immer durchgeführt
  - fail-any - wenn nur ein Handler failed, wird der emit() nicht ausgeführt
  - fail-all - nur wenn alle Handler failen, wird der emit() nicht ausgeführt

- listenerSuccessTest - eine Methode, die beschreibt, wann ein Handler als Success gilt
  - default: (val) => { return val === true || typeof val === "undefined"}