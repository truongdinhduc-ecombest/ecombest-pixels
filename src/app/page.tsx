"use client";

import useCanvas from "@/canvas/useCanvas";
import {
  addCanvasSettings,
  removeCanvasSettings,
  setCanvasViewport,
} from "@/canvas/utils";
import Canvas from "@/components/Canvas";
import { useEffect } from "react";

export default function Home() {
  const { canvas } = useCanvas("ecombest-pixels", {
    width: 1000,
    height: 1000,
    backgroundColor: "white",
  });

  useEffect(() => {
    if (canvas) {
      setCanvasViewport(canvas, { width: 500, height: 500 });
      var settings = addCanvasSettings(canvas, { width: 5 });
    }
    return () => {
      canvas && removeCanvasSettings(canvas, settings);
    };
  }, [canvas]);

  return (
    <main className="h-screen flex items-center justify-center p-0 bg-gray-500">
      <div className="w-full h-full flex items-center justify-center">
        <Canvas canvas={canvas} canvasId="ecombest-pixels" />
      </div>
    </main>
  );
}
