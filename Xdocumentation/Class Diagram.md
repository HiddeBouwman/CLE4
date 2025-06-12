# Mermaid Diagram for Classes and Relationships
Download the Mermaid plugin from the VS Code marketplace to view this diagram. 
(in the workplace recomendations.)

```mermaid
classDiagram
    class Actor {
        +methodA()
    }
    class Game {
        +methodB()
    }
    class Player {
        +methodC()
    }
    class Level {
        +methodD()
    }
    class Platform {
        +methodE()
    }
    class ColoredPlatform {
        +methodF()
    }
    class Box {
        +methodG()
    }
    Actor <|-- Player
    Actor <|-- Box
    Actor <|-- Platform
    Platform <|-- ColoredPlatform
    Game "1" o-- "1" Engine : heeft
    Engine "1" o-- "*" Scene : beheert
    Scene "1" o-- "*" Actor : bevat
    Level "1" o-- "*" Actor : bevat


    
```
//voorbeeld
Actor <|-- Player
    Actor <|-- C
    Player <|-- D
