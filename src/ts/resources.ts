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
//   FishMap: new ImageSource("images/global.png"),
//   FisherMan: new ImageSource("images/Fisherman_idle.png"),
//   Beach: new ImageSource("images/beach.png"),
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