declare module "three/examples/jsm/loaders/FontLoader.js" {
  import { Loader } from "three";
  import { Font } from "three/examples/jsm/loaders/FontLoader.js";

  export class FontLoader extends Loader {
    load(
      url: string,
      onLoad: (font: Font) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }

  export interface FontData {
    glyphs: any;
    boundingBox: any;
    resolution: number;
    underlineThickness: number;
    underlinePosition: number;
    cssFontWeight: string;
    cssFontStyle: string;
  }

  export class Font {
    constructor(data: FontData);
  }
}
