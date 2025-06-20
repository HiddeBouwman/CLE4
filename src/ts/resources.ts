import { FontSource, ImageFiltering, ImageSource, Loader, Resource, Sound } from "excalibur";

// voeg hier jouw eigen resources toe
const Resources = {

// Every file that's in pseudocode is unused.

  // Audio
  // Player audio
  Player1GetsBoosted: new Sound("sounds/player/player1GetsBoost.mp3"),
  Player2GetsBoosted: new Sound("sounds/player/player2GetsBoost.mp3"),
  PlayerDeathSound1: new Sound("sounds/player/playerDeathSound1.mp3"),
  // PlayerDeathSound2: new Sound("sounds/player/playerDeathSound2.mp3"),
  PlayerDeathSound3: new Sound("sounds/player/playerDeathSound3.mp3"),
  // PlayerDeathSound4: new Sound("sounds/player/playerDeathSound4.mp3"),
  PlayerIdle1: new Sound("sounds/player/playerIdle1.mp3"),
  PlayerIdle2: new Sound("sounds/player/playerIdle2.mp3"),
  PlayerIdle3: new Sound("sounds/player/playerIdle3.mp3"),
  PlayerIdle4: new Sound("sounds/player/playerIdle4.mp3"),
  PlayerIdle5: new Sound("sounds/player/playerIdle5.mp3"),
  PlayerIdle6: new Sound("sounds/player/playerIdle6.mp3"),
  PlayerJump: new Sound("sounds/player/playerJump.wav"),
  PlayerLand1: new Sound("sounds/player/playerLand1.mp3"),
  PlayerLand2: new Sound("sounds/player/playerLand2.mp3"),
  PlayerLandSoft1: new Sound("sounds/player/playerLandSoft1.mp3"),
  PlayerLandSoft2: new Sound("sounds/player/playerLandSoft2.mp3"),
  PlayerPush: new Sound("sounds/player/playerPush.mp3"),
  PlayerRun: new Sound("sounds/player/playerRun.mp3"),
  // Walking: new Sound("sounds/player/run.mp3"),
  // Jump: new Sound("sounds/player/jump.wav"),
  // deathSound1: new Sound("sounds/player/deathsound.mp3"),
  // deathSound2: new Sound("sounds/player/deathsound2.mp3"),

  // UI audio



  // Object audio
  BoxMove: new Sound("sounds/objects/boxMove.mp3"),
  BoxMove2: new Sound("sounds/objects/boxMove2.mp3"),
  Button: new Sound("sounds/objects/button.mp3"),
  MetalSlam: new Sound("sounds/objects/metalSlam.mp3"),
  PlatformMoving: new Sound("sounds/objects/platformMoving.mp3"),
  PlatformStartMoving: new Sound("sounds/objects/platformStartMoving.mp3"),
  PlatformStopMoving: new Sound("sounds/objects/platformStopMoving.mp3"),
  PortalEnter: new Sound("sounds/objects/portalEnter.mp3"),
  PortalEnter2: new Sound("sounds/objects/portalEnter2.mp3"),
  RustyMove: new Sound("sounds/objects/rustyMove.mp3"),
  SpikeBallRoll: new Sound("sounds/objects/spikeBallRoll.mp3"),
  Teleport: new Sound("sounds/objects/portalEnter.mp3"),
  Teleport2: new Sound("sounds/objects/portalEnter2.mp3"),
  // buttonSound: new Sound("sounds/button.mp3"),
  // Push: new Sound("sounds/push.mp3"),
  // Teleport: new Sound("sounds/teleport.mp3"),

  // Game audio (background music etc.)
  Menu: new Sound("sounds/game/level1.wav"),
  finishMSG: new Sound("sounds/player/yippeee.mp3"),
  FinishMC: new Sound("sounds/objects/finish.wav"),
  gameMusic: new Sound("sounds/game/gameMusic.mp3"),
  changeSkin: new Sound("sounds/changeskin.mp3"),


// Sprites
  // Player
  CharacterSheet: new ImageSource("images/character.png"),
  Cosmetics: new ImageSource("cosmetics.png"),

  // Floor
  Floor: new ImageSource("images/ground.png"),

  // Box
  Box: new ImageSource("images/box.png"),

  // Block
  Block: new ImageSource("images/block.png"),

  // Pressure plate
  pressurePlateGreenBase: new ImageSource("images/objects/pressure-plate/pressure-plate-green/pressure-plate-green-base.png"),
  PressurePlateGreen: new ImageSource("images/objects/pressure-plate/pressure-plate-green/pressure-plate-green.png"),
  PressurePlateGreenActivated: new ImageSource("images/objects/pressure-plate/pressure-plate-green/pressure-plate-green-activated.png"),

  pressurePlateOrangeBase: new ImageSource("images/objects/pressure-plate/pressure-plate-orange/pressure-plate-orange-base.png"),
  PressurePlateOrange: new ImageSource("images/objects/pressure-plate/pressure-plate-orange/pressure-plate-orange.png"),
  PressurePlateOrangeActivated: new ImageSource("images/objects/pressure-plate/pressure-plate-orange/pressure-plate-orange-activated.png"),

  PressurePlateWeigtedBase: new ImageSource("images/objects/pressure-plate/pressure-plate-weighted/pressure-plate-weighted-base.png"),
  PressurePlateWeigted: new ImageSource("images/objects/pressure-plate/pressure-plate-weighted/pressure-plate-weighted.png"),
  PressurePlateWeigtedActivated: new ImageSource("images/objects/pressure-plate/pressure-plate-weighted/pressure-plate-weighted-activated.png"),

  // Platform
  DefaultPlatform: new ImageSource("images/objects/moving-platform/default-platform.png"),
  PurplePlatform: new ImageSource("images/objects/moving-platform/purple-platforms/purple-platform.png"),
  YellowPlatform: new ImageSource("images/objects/moving-platform/yellow-platforms/yellow-platform.png"),
  PurpleYellowPlatform: new ImageSource("images/objects/moving-platform/purple-yellow-platform.png"),

  // Teleport
  Portal: new ImageSource("images/portal.png"),
  PortalExit: new ImageSource("images.portalExit.png"),

  // Spikes and hazards
  SpikeTrap: new ImageSource("images/spikeBallTrap.webp"),
  SpikeBall: new ImageSource("images/spikeBall.png"),
  Fire: new ImageSource("images/objects/fire.png"),

  // Other stage objects
  Door: new ImageSource("images/door.png"),


  // Background
  BackgroundFront: new ImageSource("images/backgrounds/background-front-layer.png"),
  BackgroundSecond: new ImageSource("images/backgrounds/background-second-layer.png"),
  BackgroundThird: new ImageSource("images/backgrounds/background-third-layer.png"),
  BackgroundBack: new ImageSource("images/backgrounds/background-back-layer.png"),
  BackgroundSky: new ImageSource("images/backgrounds/background-sky.png"),
  BackgroundBottomFill: new ImageSource("images/backgrounds/background-bottom-fill.png"),


  //   Font: new FontSource("fonts/KiwiSoda.ttf", "My Font", {
  //     filtering: ImageFiltering.Pixel,
  //     size: 16,
  //   }),
};

const ResourceLoader = new Loader();
for (let res of Object.values(Resources)) {
  ResourceLoader.addResource(res);
}

export { ResourceLoader, Resources };