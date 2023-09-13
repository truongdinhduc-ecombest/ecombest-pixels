import { CANVAS_ATTRIBUTES } from "@/constants/canvas.constant";
import { IEvent } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { IPixelOptions, IPixelSettings } from "../interfaces/pixel.interface";
import { createPixel } from "@/services/pixel.service";
import { Pixel } from "./pixel.util";
import { placePixel } from "@/services/socket.service";

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
      width,
      height,
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
      const { clientX, clientY } = getClientCoordinates(event.e);
      previousX = clientX;
      previousY = clientY;
      canvas.on("mouse:move", onPanning);
      canvas.on("mouse:up", onEndPanning);
    };
    const onPanning = (event: IEvent<MouseEvent | any>) => {
      const { clientX, clientY } = getClientCoordinates(event.e);
      const x = clientX - previousX;
      const y = clientY - previousY;
      previousX = clientX;
      previousY = clientY;
      canvas.relativePan({ x, y });
      (canvas as any).isPanningMode = true;
    };
    const onEndPanning = (event: IEvent<MouseEvent | any>) => {
      if ((canvas as any).isPanningMode) {
        (canvas as any).isPanningMode = false;
      } else {
        const viewportWidth = canvas?.clipPath?.width ?? 0;
        const viewporHeight = canvas?.clipPath?.height ?? 0;
        const pointer = canvas.getPointer(event.e);
        const width = (canvas as any)?.hoverPixel?.width ?? 1;
        const top = Math.floor(pointer.y / width) * width;
        const left = Math.floor(pointer.x / width) * width;
        if (
          left < 0 ||
          left >= viewportWidth ||
          top < 0 ||
          top >= viewporHeight ||
          !(canvas as any)?.pixelPlaceable
        ) {
        } else {
          const pixelSpaceId = (canvas as any).pixelSpaceId;
          if (pixelSpaceId) {
            const currentPosition = (canvas as any).pixelPositions[
              `${left}-${top}`
            ];
            const width = (canvas as any).hoverPixel.width;
            const color = (canvas as any).hoverPixel.fill;
            const pixel = new Pixel({
              width,
              color,
              top,
              left,
            });
            if (currentPosition === true || currentPosition === undefined) {
              const hoverPixel = (canvas as any).hoverPixel;
              canvas.remove(hoverPixel);
              canvas.add(pixel, hoverPixel);
              (canvas as any).pixelPositions[`${left}-${top}`] = pixel;
            } else {
              (currentPosition as fabric.Rect)?.set?.({ fill: color });
            }
            createPixel({ pixelSpaceId, width, top, left, color })
              .then((newPixel) => {
                placePixel(newPixel);
              })
              .catch((error) => {
                canvas.remove(pixel);
                delete (canvas as any).pixelPositions[`${left}-${top}`];
                canvas.fire("pixel:placeable");
              });
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

const getClientCoordinates = (event: any) => {
  switch (event.type) {
    case "mousemove": {
      return { clientX: event?.clientX ?? 0, clientY: event?.clientY ?? 0 };
    }

    case "mousedown": {
      return { clientX: event?.clientX ?? 0, clientY: event?.clientY ?? 0 };
    }

    case "touchstart": {
      const { clientX, clientY } = event?.changedTouches?.[0];
      return { clientX: clientX ?? 0, clientY: clientY ?? 0 };
    }

    case "touchmove": {
      const { clientX, clientY } = event?.changedTouches?.[0];
      return { clientX: clientX ?? 0, clientY: clientY ?? 0 };
    }

    default: {
      return { clientX: 0, clientY: 0 };
    }
  }
};

export const addPixelToCanvas = (
  canvas: fabric.Canvas,
  newPixel: IPixelOptions
) => {
  const { width, color, top, left } = newPixel;
  const pixel = new Pixel({
    width,
    color,
    top,
    left,
  });
  const hoverPixel = (canvas as any).hoverPixel;
  canvas.remove(hoverPixel);
  canvas.add(pixel, hoverPixel);
  (canvas as any).pixelPositions[`${left}-${top}`] = pixel;
};
