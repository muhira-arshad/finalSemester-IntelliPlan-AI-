declare module "three/examples/jsm/geometries/TextGeometry.js" {
  import { ExtrudeGeometry, ExtrudeGeometryParameters } from "three";
  import { Font } from "three/examples/jsm/loaders/FontLoader.js";

  export interface TextGeometryParameters extends ExtrudeGeometryParameters {
    font: Font;
    size?: number;
    height?: number;
    curveSegments?: number;
    bevelEnabled?: boolean;
    bevelThickness?: number;
    bevelSize?: number;
    bevelOffset?: number;
    bevelSegments?: number;
  }

  export class TextGeometry extends ExtrudeGeometry {
    constructor(text: string, parameters: TextGeometryParameters);
  }
}
