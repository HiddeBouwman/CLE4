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
  Teleport: new Sound("sounds/teleport.mp3"),
  finishMSG: new Sound("sounds/finishMSG.wav"),

  Box: new ImageSource("images/box.png"),
  pressurePlate: new ImageSource("images/pressure-plate-base.png"),
  Platform: new ImageSource("images/testplatform.webp"),
  BlackPlatform: new ImageSource("images/blackplatformtest.png"),
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