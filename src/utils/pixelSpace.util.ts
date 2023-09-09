import { IPixelOptions } from "@/interfaces/pixel.interface";
import { IPixelSpace } from "@/interfaces/pixelSpace.interface";
import { fabric } from "fabric";
import { Pixel } from "./pixel.util";
import { setCanvasViewport } from "./canvas.util";

export const loadPixelSpace = (
  pixelSpaceCanvas: fabric.Canvas,
  pixelSpace: IPixelSpace,
  pixels: IPixelOptions[]
) => {
  const { width, height, backgroundColor } = pixelSpace;
  const canvas = new fabric.StaticCanvas(null, {
    width: width ?? 0,
    height: height ?? 0,
    backgroundColor,
  });

  const pixelPositions: any = {};
  pixels?.map((pixel: any) => {
    const { width, top, left, color } = pixel;
    const px = new Pixel({ width, top, left, color });
    canvas.add(px);
    pixelPositions[`${left}-${top}`] = true;
  });

  (pixelSpaceCanvas as any).pixelPositions = pixelPositions;

  fabric.Image.fromURL(canvas.toDataURL(), (image) => {
    pixelSpaceCanvas.setBackgroundImage(image, () => {
      if (image.width && image.height) {
        setCanvasViewport(pixelSpaceCanvas, {
          width: image.width,
          height: image.height,
        });
      }
    });
  });
};
