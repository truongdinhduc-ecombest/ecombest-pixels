import { CANVAS_ATTRIBUTES, KEY_CODES } from "@/constants/canvas.constant";
import { IEvent } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { IPixelOptions, IPixelSettings } from "../interfaces/pixel.interface";
import { createPixel } from "@/services/pixel.service";
import { Pixel } from "./pixel.util";

export const setCanvasViewport = (
  canvas: fabric.Canvas,
  viewport: { width: number; height: number }
) => {
  const { width, height } = viewport;
  if (canvas.clipPath) {
    canvas.clipPath?.set({
      width: Number(width),
      height: Number(height),
    });
  } else {
    const clipPath = new fabric.Rect({
      ...viewport,
    });
    canvas.clipPath = clipPath;
  }
  centerCanvasViewPort(canvas);
};

export const centerCanvasViewPort = (canvas: fabric.Canvas) => {
  const clipPath = canvas.clipPath;
  if (clipPath) {
    const zoomX = (canvas.width ?? 1) / (canvas.clipPath?.width ?? 1);
    const zoomY = (canvas.height ?? 1) / (canvas.clipPath?.height ?? 1);
    const zoom = Math.min(zoomX, zoomY);
    let panX =
      (canvas.getWidth() / zoom / 2 -
        (clipPath.aCoords?.tl.x || 0) -
        (clipPath.width || 0) / 2) *
      zoom;
    let panY =
      (canvas.getHeight() / zoom / 2 -
        (clipPath.aCoords?.tl.y || 0) -
        (clipPath.height || 0) / 2) *
      zoom;

    canvas.setViewportTransform([zoom, 0, 0, zoom, panX, panY]);
  }
};

export const addCanvasSettings = (canvas: fabric.Canvas) => {
  const mouseWheelSettings = (event: IEvent<WheelEvent>) => {
    event.e.preventDefault();
    event.e.stopPropagation();
    const zoomLevel = canvas.getZoom();
    const viewportWidth = canvas?.clipPath?.width ?? 0;
    const viewporHeight = canvas?.clipPath?.height ?? 0;
    const point = {
      x: (canvas.width ?? 0) / 2,
      y: (canvas.height ?? 0) / 2,
    };
    if (event.e.deltaY < 0) {
      canvas.zoomToPoint(point, zoomLevel + CANVAS_ATTRIBUTES.zoomRatio);
    } else {
      if (
        zoomLevel * viewportWidth > CANVAS_ATTRIBUTES.minWidth &&
        zoomLevel * viewporHeight > CANVAS_ATTRIBUTES.minHeight
      ) {
        canvas.zoomToPoint(point, zoomLevel - CANVAS_ATTRIBUTES.zoomRatio);
      }
    }
  };

  const mouseDownSettings = (event: IEvent<MouseEvent>) => {
    // panning mode
    let previousX = 0;
    let previousY = 0;
    const onStartPanning = (event: IEvent<MouseEvent>) => {
      previousX = event.e.clientX;
      previousY = event.e.clientY;
      canvas.on("mouse:move", onPanning);
      canvas.on("mouse:up", onEndPanning);
    };
    const onPanning = (event: IEvent<MouseEvent | any>) => {
      const x = event.e.clientX - previousX;
      const y = event.e.clientY - previousY;
      previousX = event.e.clientX;
      previousY = event.e.clientY;
      canvas.relativePan({ x, y });
      (canvas as any).isPanningMode = true;
    };
    const onEndPanning = (event: IEvent<MouseEvent | any>) => {
      if ((canvas as any).isPanningMode) {
        (canvas as any).isPanningMode = false;
      } else {
        const pointer = canvas.getPointer(event.e);
        const viewportWidth = canvas?.clipPath?.width ?? 0;
        const viewporHeight = canvas?.clipPath?.height ?? 0;
        if (
          event.target ||
          pointer.x < 0 ||
          pointer.x > viewportWidth ||
          pointer.y < 0 ||
          pointer.y > viewporHeight ||
          !(canvas as any).pixelPlaceable
        ) {
        } else {
          const pixelSpaceId = (canvas as any).pixelSpaceId;
          if (pixelSpaceId) {
            const { width, color } = (canvas as any).pixelSettings;
            const top = Math.floor(pointer.y / width) * width;
            const left = Math.floor(pointer.x / width) * width;
            const pixel = new Pixel({
              width,
              color,
              top,
              left,
            });
            canvas.add(pixel);
            createPixel({ pixelSpaceId, width, top, left, color });
            canvas.fire("pixel:placed");
          }
        }
      }
      canvas.off("mouse:move", onPanning);
      canvas.off("mouse:up", onEndPanning);
    };
    onStartPanning(event);
  };

  // hover
  const mouseMoveSettings = (event: IEvent<MouseEvent>) => {
    const hoverPixel = (canvas as any).hoverPixel;
    if (hoverPixel) {
      const pointer = canvas.getPointer(event.e);
      const width = hoverPixel.width ?? 1;
      hoverPixel.set({
        top: Math.floor(pointer.y / width) * width,
        left: Math.floor(pointer.x / width) * width,
      });
      canvas.requestRenderAll();
    }
  };

  canvas.on("mouse:wheel", mouseWheelSettings);
  canvas.on("mouse:down", mouseDownSettings);
  canvas.on("mouse:move", mouseMoveSettings);

  return [
    { type: "mouse:wheel", listener: mouseWheelSettings },
    { type: "mouse:down", listener: mouseDownSettings },
    { type: "mouse:move", listener: mouseMoveSettings },
  ];
};

export const removeCanvasSettings = (
  canvas: fabric.Canvas,
  settings: {
    type: any;
    listener: (event: any) => void;
  }[]
) => {
  settings.map((setting) => {
    canvas.off(setting.type, setting.listener);
  });
};

export const addPixelSettings = (
  canvas: fabric.Canvas,
  pixelSettings: IPixelSettings
) => {
  (canvas as any).pixelSettings = pixelSettings;

  const { width, color } = pixelSettings;
  const hoverPixel = new Pixel({
    width,
    top: -width,
    left: -width,
    color,
  });
  (canvas as any).hoverPixel = hoverPixel;
  canvas.add(hoverPixel);
};
