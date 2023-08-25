import { CANVAS_ATTRIBUTES, KEY_CODES } from "@/canvas/constants";
import { IEvent } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { getPixel } from "@/pixel/utils";

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

export const addCanvasKeyboardSettings = (
  canvas: fabric.Canvas,
  isPreview?: boolean
) => {
  const keydownSettings = (event: KeyboardEvent) => {
    switch (event.key) {
      case KEY_CODES.delete: {
        const activeObject = canvas.getActiveObject();
        if (isPreview) {
          if (activeObject && (activeObject as any).isAdditional) {
            canvas.remove(activeObject).renderAll();
          }
        } else {
          if (activeObject) {
            canvas.remove(activeObject).renderAll();
          }
        }
        return;
      }

      case KEY_CODES.shift: {
        (canvas as any).isGroupingMode = true;
        return;
      }

      default: {
        return;
      }
    }
  };

  const keyupSettings = (event: KeyboardEvent) => {
    switch (event.key) {
      case KEY_CODES.shift: {
        (canvas as any).isGroupingMode = false;
        return;
      }

      default: {
        return;
      }
    }
  };

  window.addEventListener("keydown", keydownSettings);
  window.addEventListener("keyup", keyupSettings);

  return [
    { type: "keydown", listener: keydownSettings },
    { type: "keyup", listener: keyupSettings },
  ];
};

export const removeCanvasKeyboardSettings = (
  settings: {
    type: string;
    listener: (event: KeyboardEvent) => void;
  }[]
) => {
  settings.map((setting) => {
    window.removeEventListener(
      setting.type as "keydown" | "keypress" | "keyup",
      setting.listener
    );
  });
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
    const startPanning = (event: IEvent<MouseEvent>) => {
      if ((canvas as any).isPanningMode) {
        previousX = event.e.clientX;
        previousY = event.e.clientY;
        canvas.on("mouse:move", onPanning);
        canvas.on("mouse:up", onEndPanning);
      }
    };
    const onPanning = (event: IEvent<MouseEvent>) => {
      const x = event.e.clientX - previousX;
      const y = event.e.clientY - previousY;
      previousX = event.e.clientX;
      previousY = event.e.clientY;
      canvas.relativePan({ x, y });
    };
    const onEndPanning = (event: IEvent<MouseEvent>) => {
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    };

    // drawing
    if (event.target) {
    } else {
      const pointer = canvas.getPointer(event.e);
      const pixel = getPixel({
        width: 5,
        top: pointer.y,
        left: pointer.x,
        fill: ["red", "green", "blue"][Date.now() % 3],
      });
      canvas.add(pixel);
    }

    startPanning(event);
  };
  console.log(Date.now());
  canvas.on("mouse:wheel", mouseWheelSettings);
  canvas.on("mouse:down", mouseDownSettings);

  return [
    { type: "mouse:wheel", listener: mouseWheelSettings },
    { type: "mouse:down", listener: mouseDownSettings },
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
