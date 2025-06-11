
# Code Stijl

We werken met Typscript, je mag nooit `any` gebruiken, als het echt niet anders kan, gebruik dan `unknown` en zet een commentaar waarom je dit doet. We gebruiken altijd `===` en nooit `==`. We gebruiken altijd `camelCase` voor variabelen en functies, en `PascalCase` voor classes.

## Indentatie

We gebruiken 4 spaties voor indentatie, geen tabs. Zorg dat tussen functies en classes altijd een lege regel zit, en dat er geen lege regels zijn aan het begin of einde van een bestand.

## Comments

Gebruik een jdoc commentaar voor functies en classes, en een inline commentaar voor extra uitleg waar nodig.

## Code Voorbeelden

### Variabelen

```typescript
let myVariable: string = "Hello, World!";
let myNumber: number = 42;
let myBoolean: boolean = true;
```

### Functies

```typescript
/**
 * Dit is een voorbeeld van een functie.
 * @param param1 - De eerste parameter.
 * @param param2 - De tweede parameter.
 */
function myFunction(param1: string, param2: number): void {
    // Dit is een inline commentaar
    console.log(`Param1: ${param1}, Param2: ${param2}`);
}
```

### Classes

```typescript
class MyClass {
    private #myProperty: string;

    constructor(myProperty: string) {
        this.#myProperty = myProperty;
    }

    public myMethod(): void {
        console.log(`My Property: ${this.myProperty}`);
    }
}
```
