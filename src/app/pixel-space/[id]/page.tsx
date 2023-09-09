"use client";

import useCanvas from "@/hooks/useCanvas";
import {
  addCanvasSettings,
  addPixelToCanvas,
  removeCanvasSettings,
} from "@/utils/canvas.util";
import Canvas from "@/components/Canvas";
import { PixelSettings } from "@/components/PixelSettings";
import { getPixels } from "@/services/pixel.service";
import { useEffect, useState } from "react";
import { getPixelSpace } from "@/services/pixelSpace.service";
import { useParams } from "next/navigation";
import {
  joinPixelSpace,
  joinedPixelSpace,
  leavePixelSpace,
  leftPixelSpace,
  placedPixel,
} from "@/services/socket.service";
import { loadPixelSpace } from "@/utils/pixelSpace.util";

export default function PixelSpace() {
  const { id } = useParams();
  const [pixelSpace, setPixelSpace] = useState<any>();
  const [totalUsers, setTotalUsers] = useState(0);
  const { canvas } = useCanvas("ecombest-pixels", {
    backgroundColor: "white",
  });

  useEffect(() => {
    if (canvas && id) {
      getPixelSpace(id as string).then((pixelSpace) => {
        setPixelSpace(pixelSpace);
        if (pixelSpace?._id) {
          (canvas as any).pixelSpaceId = pixelSpace?._id;
          getPixels({ pixelSpaceId: pixelSpace?._id }).then((pixels) => {
            loadPixelSpace(canvas, pixelSpace, pixels);
          });
        }
      });
      var settings = addCanvasSettings(canvas);
    }
    return () => {
      canvas && removeCanvasSettings(canvas, settings);
    };
  }, [canvas, id]);

  useEffect(() => {
    if (pixelSpace?._id && canvas) {
      joinPixelSpace(pixelSpace?._id);
      joinedPixelSpace(setTotalUsers);
      leftPixelSpace(setTotalUsers);
      placedPixel((pixel) => {
        addPixelToCanvas(canvas, pixel);
      });
      window.onbeforeunload = function () {
        leavePixelSpace(pixelSpace?._id);
      };
    }
    return () => {
      pixelSpace?._id && leavePixelSpace(pixelSpace?._id);
    };
  }, [pixelSpace, canvas]);

  return (
    <div className="h-screen flex items-center justify-center p-0 bg-gray-300">
      <div className="w-full h-full flex items-center justify-center">
        <Canvas canvas={canvas} canvasId="ecombest-pixels" />
        <div className="absolute right-4 top-4 px-4 py-2 shadow-2xl shadow-black rounded bg-white">
          Online: {totalUsers}
        </div>
        <PixelSettings
          canvas={canvas}
          pixelSettings={pixelSpace?.pixelSettings}
        />
      </div>
    </div>
  );
}
