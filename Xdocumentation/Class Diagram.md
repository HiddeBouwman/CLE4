# Mermaid Diagram for Classes and Relationships

Download the Mermaid plugin from the VS Code marketplace to view this diagram.
(in the workplace recommendations.)
[Mermaid Plugin](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)

```mermaid
classDiagram
    %% Excalibur Base Classes
    class Engine
    class Scene
    class Actor
    class Label

    %% Game Base Classes
    class Game {
        -mygamepad
        +constructor()
        -#startGame()
    }

    %% Scenes
    class StartMenu {
        -menuButtons: Label[]
        -selectedIndex: number
        -lastStickY: number
        -keyboardHandler: any
        +constructor()
        +onInitialize(engine)
        +onPreUpdate(engine: Engine)
        +highlightSelected()
        +activateSelected(engine: Engine)
        +onActivate()
        +onDeactivate()
    }

    class LevelOne {
        +levelKey: string
        -floor: Floor
        +player1: Player
        +player2: Player
        -cameraController: CameraController
        -parallax: ParallaxBackgroundManager
        +constructor()
        +onInitialize(engine: Engine)
        +onPreUpdate(engine: Engine, delta: number)
        +onActivate()
    }

    class LevelTwo {
        +constructor()
        +onActivate()
    }

    class LevelThree {
        +levelKey: string
        +floor: Floor
        +player1: Player
        +player2: Player
        -cameraController: CameraController
        -parallax: ParallaxBackgroundManager
        +constructor()
        +onInitialize(engine: Engine)
        +onPreUpdate(engine: Engine, delta: number)
        +onActivate()
    }

    class BackwardsLevel {
        +levelKey: string
        +floor: Floor
        +player1: Player
        +player2: Player
        -cameraController: CameraController
        -parallax: ParallaxBackgroundManager
        +constructor()
        +onInitialize(engine: Engine)
        +onPreUpdate(engine: Engine, delta: number)
        +onActivate()
    }

    class player1 {
        +constructor()
        +onInitialize(engine)
    }

    class player2 {
        +constructor()
        +onInitialize(engine)
    }

    class dressingRoom {
        +player1Cosmetic: Cosmetic
        +player2Cosmetic: Cosmetic
        +player1Actor: Actor
        +player2Actor: Actor
        -keyDebounceTimer: number
        -keyDebounceDelay: number
        -returnToMenuTimer: number
        -returnToMenuDelay: number
        +constructor()
        +onInitialize(engine: Engine)
        +onActivate()
        +onPreUpdate(engine: Engine, delta: number)
        +handleKeyboardInput(engine: Engine)
        +handleGamepadInput(engine: Engine)
    }

    %% Player and Components
    class Player {
        -controls: Controls
        +playerNumber: number
        -isOnGround: boolean
        -isBoosting: boolean
        -lastGroundCollision: number
        -moveSpeed: number
        -jumpPower: number
        -cosmetic: Cosmetic
        +constructor(x: number, y: number, playerNumber: number)
        +setSpawn(x: number, y: number)
        +onInitialize(engine: Engine)
        +onPreUpdate(engine: Engine, delta: number)
        +updateAnimation()
        +die(engine: Engine)
    }

    class Cosmetic {
        -playerNumber: number
        -cosmetics: Array<any>
        -selected: number
        -spritesheet: SpriteSheet
        -animation: Animation
        +constructor(playerNumber: number)
        +setupAsPreview(engine: Engine)
        +cyclePrevious()
        +cycleNext()
        +select()
        +setCosmetic()
    }

    %% Utility Classes
    class CameraController {
        -camera: Camera
        -scene: Scene
        +constructor(scene: Scene, camera: Camera)
        +update(player1?: Actor, player2?: Actor)
    }

    class LevelManager {
        +static initLevelStorage()
        +static unlockNextLevel()
        +static getUnlockedLevel()
        +static resetLevels()
    }

    %% Platform-Related Classes
    class Platform {
        #boostForPlayers: number[]
        #type: PlatformType
        +constructor(x: number, y: number, width: number, height: number, type: PlatformType, colliderWidth: number, colliderHeight: number, colliderOffset: Vector, boostForPlayers: number[])
        +onInitialize(engine: Engine)
        +onPreUpdate(engine, delta)
    }

    class PlatformType {
        <<enumeration>>
        DefaultPlatform
        PurplePlatform
        YellowPlatform
        PurpleYellowPlatform
    }

    class ElevatorPlatform {
        -elevating: boolean
        -originalY: number
        -maxHeight: number
        +constructor(x: number, y: number, width: number, height: number, playerNumber: number, colliderWidth: number, colliderHeight: number, colliderOffset: Vector, maxHeight: number)
        +startElevating()
        +stopElevating()
        +onPreUpdate(engine, delta)
    }

    class AlwaysMovingPlatform {
        -startPos: Vector
        -endPos: Vector
        -speed: number
        -pauseDuration: number
        -direction: boolean
        -pauseTimer: number
        +constructor(spawnPosX: number, spawnPosY: number, width: number, height: number, type: PlatformType, colliderWidth: number, colliderHeight: number, colliderOffset: Vector, start: Vector, end: Vector, speed: number, pauseDuration: number, boostForPlayers: number[], scale: Vector)
        +onPreUpdate(engine, delta)
    }

    class PressurePlatePlatform {
        -startPos: Vector
        -endPos: Vector
        -speed: number
        -pauseDuration: number
        -direction: boolean
        -pauseTimer: number
        -activated: boolean
        +constructor(spawnPosX: number, spawnPosY: number, width: number, height: number, type: PlatformType, colliderWidth: number, colliderHeight: number, colliderOffset: Vector, start: Vector, end: Vector, speed: number, pauseDuration: number, boostForPlayers: number[], scale: Vector)
        +activate()
        +deactivate()
        +onPreUpdate(engine, delta)
    }

    class PressurePlateReturnPlatform {
        -startPos: Vector
        -endPos: Vector
        -speed: number
        -direction: boolean
        -activated: boolean
        +constructor(spawnPosX: number, spawnPosY: number, width: number, height: number, type: PlatformType, colliderWidth: number, colliderHeight: number, colliderOffset: Vector, start: Vector, end: Vector, speed: number, boostForPlayers: number[], scale: Vector)
        +activate()
        +deactivate()
        +onPreUpdate(engine, delta)
    }

    class TwoPlatePlatform {
        -startPos: Vector
        -endPos: Vector
        -speed: number
        -pauseDuration: number
        -direction: boolean
        -pauseTimer: number
        -activatedCount: number
        -requiredCount: number
        +constructor(spawnPosX: number, spawnPosY: number, width: number, height: number, type: PlatformType, colliderWidth: number, colliderHeight: number, colliderOffset: Vector, start: Vector, end: Vector, speed: number, pauseDuration: number, boostForPlayers: number[], scale: Vector, requiredCount: number)
        +activate()
        +deactivate()
        +onPreUpdate(engine, delta)
    }

    %% Objects
    class Floor {
        -platforms: number[]
        +constructor(x: number, y: number, width: number, height: number, platforms?: number[])
        +onInitialize(engine)
    }

    class Box {
        -topPlatform: Actor
        -isPushing: boolean
        -pushSoundTimer: number
        -wasPushing: boolean
        -pushingPlayer: Player | null
        -pushDisconnectTimer: number
        -lastYVelocity: number
        +constructor(x: number, y: number)
        +onInitialize(engine)
        +onPreUpdate(engine, delta)
    }

    class Block {
        +constructor(x: number, y: number, duration: number)
        +onInitialize(engine)
    }

    class Fire {
        +constructor(x: number, y: number, direction: FireDirection)
        +onInitialize(engine: Engine)
    }

    class FireWall {
        -fires: Fire[]
        +constructor(x1: number, y1: number, x2: number, y2: number, direction?: FireDirection)
    }

    class JumpPlate {
        -jumpPower: number
        +constructor(x: number, y: number, jumpPower: number)
        +onInitialize(engine)
    }

    class DefaultPlate {
        -targets: any[]
        -targetBox: Box | null
        -active: boolean
        +constructor(positionX: number, positionY: number, type: number, targets: any, targetBox?: Box | null)
        +onInitialize(engine: Engine)
        +onPreUpdate(engine: Engine, delta: number)
    }

    class TrapPlate {
        -target: any
        -active: boolean
        +constructor(positionX: number, positionY: number, type: number, target: any)
        +onInitialize(engine: Engine)
        +onPreUpdate(engine: Engine, delta: number)
    }

    class PressurePlate {
        -target: any
        -active: boolean
        +constructor(positionX: number, positionY: number, type: number, target: any)
        +onInitialize(engine: Engine)
        +onPreUpdate(engine: Engine, delta: number)
    }

    class SpikeBallTrap {
        -spikeBall: Actor
        -chain: Actor
        -basePos: Vector
        -swingAngle: number
        -swingSpeed: number
        -chainLength: number
        -originalY: number
        -dropping: boolean
        -dropSpeed: number
        +constructor(x: number, y: number)
        +onInitialize(engine)
        +onPreUpdate(engine, delta)
        +drop()
    }

    class Finish {
        -player1Present: boolean
        -player2Present: boolean
        +constructor(x: number, y: number)
        +onInitialize(engine)
        +hitSomething(event)
        +playerLeaves(event)
    }

    class Portal {
        -player1Present: boolean
        -player2Present: boolean
        +coordinates: Vector
        +constructor(x: number, y: number, coordinates: Vector)
        +onInitialize(engine)
        +hitSomething(event)
    }

    class PortalExit {
        +constructor(x: number, y: number)
    }

    class ParallaxBackgroundManager {
        -scene: Scene
        -camera: Camera
        -engine: Engine
        -backgrounds: Actor[]
        +constructor(scene: Scene, camera: Camera, engine: Engine)
        +update()
    }

    %% Enums
    class Controls {
        <<enumeration>>
        player1
        player2
    }

    %% Resources
    class Resources {
        +static Door: ImageSource
        +static Player1: ImageSource
        +static Player2: ImageSource
        +static CharacterSheet: ImageSource
        +static Box: ImageSource
        +static Fire: ImageSource
        +static Teleport: Sound
        +static Menu: Sound
        +static gameMusic: Sound
        +static PlayerJump: Sound
        +static PlayerDeathSound1: Sound
        +static PlayerDeathSound3: Sound
        +static stopAllMusic()
        +static load()
    }

    %% Relationships - Inheritance
    Engine <|-- Game
    Scene <|-- StartMenu
    Scene <|-- LevelOne
    Scene <|-- LevelTwo
    Scene <|-- LevelThree
    Scene <|-- BackwardsLevel
    Scene <|-- player1
    Scene <|-- player2
    Scene <|-- dressingRoom
    Actor <|-- Player
    Actor <|-- Floor
    Actor <|-- Box
    Actor <|-- Platform
    Actor <|-- Block
    Actor <|-- Fire
    Actor <|-- JumpPlate
    Actor <|-- DefaultPlate
    Actor <|-- TrapPlate
    Actor <|-- PressurePlate
    Actor <|-- SpikeBallTrap
    Actor <|-- Finish
    Actor <|-- Portal
    Actor <|-- PortalExit
    Platform <|-- ElevatorPlatform
    Platform <|-- AlwaysMovingPlatform
    Platform <|-- PressurePlatePlatform
    Platform <|-- PressurePlateReturnPlatform
    Platform <|-- TwoPlatePlatform

    %% Relationships - Composition
    Game "1" o-- "*" Scene : contains
    Engine "1" o-- "*" Scene : manages
    Scene "*" o-- "*" Actor : contains
    Player "1" *-- "1" Cosmetic : has
    FireWall "1" *-- "*" Fire : contains

    %% Association relationships
    LevelOne "1" --> "1" CameraController : uses
    LevelOne "1" --> "1" ParallaxBackgroundManager : uses
    LevelThree "1" --> "1" CameraController : uses
    LevelThree "1" --> "1" ParallaxBackgroundManager : uses
    BackwardsLevel "1" --> "1" CameraController : uses
    BackwardsLevel "1" --> "1" ParallaxBackgroundManager : uses
    Player "*" --> "1" Controls : uses
    DefaultPlate "*" --> "*" Platform : activates
    DefaultPlate "*" --> "0..1" Box : detects
    TrapPlate "*" --> "1" SpikeBallTrap : triggers
    PressurePlate "*" --> "1" Platform : activates
    dressingRoom "1" --> "2" Cosmetic : manages
    ParallaxBackgroundManager "1" --> "*" Actor : manages
    
    %% Usage relationships
    Player ..> Resources : uses
    Platform ..> Resources : uses
    Finish ..> Resources : uses
    Portal ..> Resources : uses
    Fire ..> Resources : uses
    Scene ..> Resources : uses
````
