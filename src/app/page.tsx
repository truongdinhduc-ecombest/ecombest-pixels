"use client";

import useCanvas from "@/hooks/useCanvas";
import {
  addCanvasSettings,
  removeCanvasSettings,
  setCanvasViewport,
} from "@/utils/canvas.util";
import Canvas from "@/components/Canvas";
import { PixelSettings } from "@/components/PixelSettings";
import { getPixels } from "@/services/pixel.service";
import { useEffect } from "react";
import { Pixel } from "@/utils/pixel.util";

export default function Home() {
  const { canvas } = useCanvas("ecombest-pixels", {
    width: 1000,
    height: 1000,
    backgroundColor: "white",
  });

  useEffect(() => {
    if (canvas) {
      setCanvasViewport(canvas, { width: 500, height: 500 });
      var settings = addCanvasSettings(canvas);
      getPixels({}).then((result) => {
        result?.map((pixel: any) => {
          const { width, top, left, color } = pixel;
          const px = new Pixel({ width, top, left, color });
          canvas.add(px);
        });
      });
    }
    return () => {
      canvas && removeCanvasSettings(canvas, settings);
    };
  }, [canvas]);

  return (
    <main className="h-screen flex items-center justify-center p-0 bg-gray-500">
      <div className="w-full h-full flex items-center justify-center">
        <Canvas canvas={canvas} canvasId="ecombest-pixels" />
        <PixelSettings canvas={canvas} />
      </div>
    </main>
  );
}
