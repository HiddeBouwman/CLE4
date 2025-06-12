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
  Floor: new ImageSource("images/floor.png"),
  Finish: new ImageSource("images/finish.png"),
  Box: new ImageSource("images/box.png"),
  pressurePlate: new ImageSource("images/pressure-plate-base.png"),
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