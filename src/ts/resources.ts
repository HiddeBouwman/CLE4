import {
  FontSource,
  ImageFiltering,
  ImageSource,
  Loader,
  Resource,
  Sound,
} from "excalibur";


// voeg hier jouw eigen resources toe
const Resources = {
  Fish: new ImageSource("images/fish.png"),
  Floor: new ImageSource("images/ground.png"),
  Finish: new ImageSource("images/finish.png"),
  Portal: new ImageSource("images/portal.png"),
  SpikeTrap: new ImageSource("images/spikeBallTrap.webp"),
  SpikeBall: new ImageSource("images/spikeBall.png"),
  Teleport: new Sound("sounds/teleport.mp3"),
  Jump: new Sound("sounds/jump.wav"),
  finishMSG: new Sound("sounds/finishMSG.wav"),
  Menu: new Sound("sounds/level1.wav"),
  Walking: new Sound("sounds/run.mp3"),
  Push: new Sound("sounds/push.mp3"),
  buttonSound: new Sound("sounds/button.mp3"),

  Box: new ImageSource("images/box.png"),
  pressurePlateBase: new ImageSource("images/objects/pressure-plate/pressure-plate-base.png"),
  PressurePlateGreen: new ImageSource("images/objects/pressure-plate/pressure-plate-green/pressure-plate.png"),
  PressurePlateGreenActivated: new ImageSource("images/objects/pressure-plate/pressure-plate-green/pressure-plate-activated.png"),
  Platform: new ImageSource("images/testplatform.webp"),
  BlackPlatform: new ImageSource("images/blackplatformtest.png"),

  PurplePlatformHorizontalStationary: new ImageSource("images/objects/moving-platform/purple-platforms/purple-platform-small-horizontal-stationary.png"),
  // PurplePlatformHorizontalLeft: new ImageSource("images/objects/moving-platform/purple-platforms/purple-platform-small-horizontal-left.png"),
  // PurplePlatformHorizontalRight: new ImageSource("images/objects/moving-platform/purple-platforms/purple-platform-small-horizontal-right.png"),
  PurplePlatformVerticalStationary: new ImageSource("images/objects/moving-platform/purple-platforms/purple-platform-small-vertical-stationary.png"),
  // PurplePlatformVerticalUp: new ImageSource("images/objects/moving-platform/purple-platforms/purple-platform-small-vertical-up.png"),
  // PurplePlatformVerticalDown: new ImageSource("images/objects/moving-platform/purple-platforms/purple-platform-small-vertical-down.png"),
  YellowPlatformHorizontalStationary: new ImageSource("images/objects/moving-platform/yellow-platforms/yellow-platform-small-horizontal-stationary.png"),
  // YellowPlatformHorizontalLeft: new ImageSource("images/objects/moving-platform/yellow-platforms/yellow-platform-small-horizontal-left.png"),
  // YellowPlatformHorizontalRight: new ImageSource("images/objects/moving-platform/yellow-platforms/yellow-platform-small-horizontal-right.png"),
  YellowPlatformVerticalStationary: new ImageSource("images/objects/moving-platform/yellow-platforms/yellow-platform-small-vertical-stationary.png"),
  // YellowPlatformVerticalUp: new ImageSource("images/objects/moving-platform/yellow-platforms/yellow-platform-small-vertical-up.png"),
  // YellowPlatformVerticalDown: new ImageSource("images/objects/moving-platform/yellow-platforms/yellow-platform-small-vertical-down.png"),
  NeutralPlatform: new ImageSource("images/objects/moving-platform-neutral-platform-small.png"),

  //   Font: new FontSource("fonts/KiwiSoda.ttf", "My Font", {
  //     filtering: ImageFiltering.Pixel,
  //     size: 16,
  //   }),
  BackgroundFront: new ImageSource("images/backgrounds/background-front-layer.png"),
  BackgroundSecond: new ImageSource("images/backgrounds/background-second-layer.png"),
  BackgroundThird: new ImageSource("images/backgrounds/background-third-layer.png"),
  BackgroundBack: new ImageSource("images/backgrounds/background-back-layer.png"),
  BackgroundSky: new ImageSource("images/backgrounds/background-sky.png"),
  BackgroundBottomFill: new ImageSource("images/backgrounds/background-bottom-fill.png"),


};

const ResourceLoader = new Loader();
for (let res of Object.values(Resources)) {
  ResourceLoader.addResource(res);
}

export { ResourceLoader, Resources };