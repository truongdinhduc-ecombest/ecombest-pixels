import { fabric } from "fabric";
import { IPixelOptions } from "./interfaces";

export const getPixel = (options: IPixelOptions) => {
  const { width } = options;
  const pixel = new fabric.Rect({
    width,
    height: width,
    top: Math.floor(options.top / width) * width,
    left: Math.floor(options.left / width) * width,
    fill: options.fill,
    hasControls: false,
    selectable: false,
  });
  return pixel;
};
