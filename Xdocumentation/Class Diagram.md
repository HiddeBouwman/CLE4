# Mermaid Diagram for Classes and Relationships
Download the Mermaid plugin from the VS Code marketplace to view this diagram. 
(in the workplace recomendations.)

```mermaid
classDiagram
    class A {
        +methodA()
    }
    class B {
        +methodB()
    }
    class C {
        +methodC()
    }
    class D {
        +methodD()
    }

    A <|-- B
    A <|-- C
    B <|-- D
```
