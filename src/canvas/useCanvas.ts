"use client";

import { fabric } from "fabric";
import { useEffect, useState } from "react";

export default function useCanvas(
  element: string | HTMLCanvasElement | null,
  options?: fabric.ICanvasOptions | undefined
) {
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  useEffect(() => {
    if (!canvas) {
      const newCanvas = new fabric.Canvas(element, options);
      setCanvas(newCanvas);
    }
  }, [element, options, canvas, setCanvas]);

  return { canvas };
}
