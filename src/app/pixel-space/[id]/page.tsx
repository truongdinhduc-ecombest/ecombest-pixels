"use client";

import useCanvas from "@/hooks/useCanvas";
import {
  addCanvasSettings,
  addPixelsToPixelSpace,
  removeCanvasSettings,
  setCanvasViewport,
} from "@/utils/canvas.util";
import Canvas from "@/components/Canvas";
import { PixelSettings } from "@/components/PixelSettings";
import { getPixels } from "@/services/pixel.service";
import { useEffect, useState } from "react";
import { getPixelSpace } from "@/services/pixelSpace.service";
import { useParams } from "next/navigation";

export default function PixelSpace() {
  const { id } = useParams();
  const [pixelSpace, setPixelSpace] = useState<any>();
  const { canvas } = useCanvas("ecombest-pixels", {
    backgroundColor: "white",
  });

  useEffect(() => {
    if (canvas && id) {
      getPixelSpace(id as string).then((pixelSpace) => {
        const { width, height, _id } = pixelSpace;
        setCanvasViewport(canvas, { width, height });
        setPixelSpace(pixelSpace);
        if (_id) {
          (canvas as any).pixelSpaceId = _id;
          getPixels({ pixelSpaceId: id }).then((pixels) => {
            addPixelsToPixelSpace(canvas, pixels);
          });
        }
      });
      var settings = addCanvasSettings(canvas);
    }
    return () => {
      canvas && removeCanvasSettings(canvas, settings);
    };
  }, [canvas, id]);

  return (
    <div className="h-screen flex items-center justify-center p-0 bg-gray-300">
      <div className="w-full h-full flex items-center justify-center">
        <Canvas canvas={canvas} canvasId="ecombest-pixels" />
        <PixelSettings
          canvas={canvas}
          pixelSettings={pixelSpace?.pixelSettings}
        />
      </div>
    </div>
  );
}
