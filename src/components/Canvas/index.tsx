"use client";

import { centerCanvasViewPort } from "@/utils/canvas.util";
import { useEffect, useRef, useState } from "react";

interface Props {
  canvas?: fabric.Canvas;
  canvasId: string;
}

export default function Canvas(props: Props) {
  const { canvas, canvasId } = props;
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeCanvas = () => {
      canvasContainer.current &&
        setDimensions({
          width: canvasContainer.current.offsetWidth,
          height: canvasContainer.current.offsetHeight,
        });
    };

    resizeCanvas();
    if (canvas && canvasContainer.current) {
      setDimensions({
        width: canvasContainer.current.offsetWidth,
        height: canvasContainer.current.offsetHeight,
      });
      window.addEventListener("resize", resizeCanvas);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvas, canvasContainer]);

  useEffect(() => {
    if (canvas) {
      canvas.setDimensions(dimensions);
      centerCanvasViewPort(canvas);
    }
  }, [dimensions, canvas]);

  return (
    <div
      ref={canvasContainer}
      className="w-full h-full flex justify-center items-center overflow-hidden"
    >
      <canvas id={canvasId}></canvas>
    </div>
  );
}
