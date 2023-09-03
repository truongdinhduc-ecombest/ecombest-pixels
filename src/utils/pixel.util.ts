import { IPixelOptions } from "@/interfaces/pixel.interface";
import { fabric } from "fabric";

export const Pixel = fabric.util.createClass(fabric.Rect, {
  name: "Pixel",
  type: "pixel",

  initialize: function (options: IPixelOptions) {
    const { width, color, top, left } = options;
    this.set({
      width,
      height: width,
      top,
      left,
      fill: color,
      hasControls: false,
      selectable: false,
    });
  },
});

(fabric as any).Pixel = Pixel;
