import { PIXEL_ATTRIBUTES } from "./constants";
import { fabric } from "fabric";
import { IPixelOptions } from "./interfaces";

export const Pixel = fabric.util.createClass(fabric.Object, {
  name: PIXEL_ATTRIBUTES.name,
  type: PIXEL_ATTRIBUTES.type,

  initialize: function (options: IPixelOptions) {},
});
