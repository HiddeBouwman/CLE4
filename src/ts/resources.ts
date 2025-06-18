import { FontSource, ImageFiltering, ImageSource, Loader, Resource, Sound } from "excalibur";


// voeg hier jouw eigen resources toe
const Resources = {

// Audio
  // Player audio
  Walking: new Sound("sounds/run.mp3"),
  Jump: new Sound("sounds/jump.wav"),
  deathSound1: new Sound("sounds/deathsound.mp3"),
  deathSound2: new Sound("sounds/deathsound2.mp3"),

  // UI audio


  // Object audio
  buttonSound: new Sound("sounds/button.mp3"),
  Push: new Sound("sounds/push.mp3"),
  Teleport: new Sound("sounds/teleport.mp3"),


  // Game audio (background music etc.)
  Menu: new Sound("sounds/level1.wav"),
  finishMSG: new Sound("sounds/finishMSG.wav"),


// Sprites
  // Player
  Fish: new ImageSource("images/fish.png"),


  // Floor
  Floor: new ImageSource("images/ground.png"),


  // Box
  Box: new ImageSource("images/box.png"),


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


  // Spikes
  SpikeTrap: new ImageSource("images/spikeBallTrap.webp"),
  SpikeBall: new ImageSource("images/spikeBall.png"),


  // Other stage objects
  Finish: new ImageSource("images/finish.png"),


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