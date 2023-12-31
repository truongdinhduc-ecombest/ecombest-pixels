import { addPixelSettings } from "@/utils/canvas.util";
import { useEffect, useState } from "react";

interface Props {
  canvas?: fabric.Canvas;
  pixelSettings?: any;
}

export function PixelSettings(props: Props) {
  const { canvas, pixelSettings } = props;
  const [waitingTime, setWaitingTime] = useState(0);

  useEffect(() => {
    if (waitingTime <= 0 && canvas) {
      (canvas as any).pixelPlaceable = true;
      return;
    }
    const timer = setTimeout(() => setWaitingTime(waitingTime - 1), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [waitingTime, canvas]);

  useEffect(() => {
    const placePixel = () => {
      setWaitingTime(pixelSettings?.waitingTime ?? 0);
      if (pixelSettings?.waitingTime > 0) {
        (canvas as any).pixelPlaceable = false;
      }
    };
    const placeablePixel = () => {
      setWaitingTime(0);
      (canvas as any).pixelPlaceable = true;
    };
    if (canvas && pixelSettings) {
      addPixelSettings(canvas, pixelSettings);
      canvas.on("pixel:placed", placePixel);
      canvas.on("pixel:placeable", placeablePixel);
    }
    return () => {
      canvas?.off("pixel:placed", placePixel);
      canvas?.off("pixel:placeable", placeablePixel);
    };
  }, [canvas, pixelSettings]);

  const onChangeColor = (color: string) => {
    (canvas as any).hoverPixel.set({ fill: color });
  };

  return (
    <div
      className={`absolute bottom-4 flex items-center space-x-2 p-2 shadow-2xl shadow-black rounded bg-white ${
        waitingTime > 0 ? "opacity-50" : ""
      }`}
    >
      <input
        name="pixel-color"
        className="h-8 w-8"
        defaultValue={pixelSettings?.color}
        type="color"
        onChange={(event) => {
          onChangeColor(event.target.value);
        }}
        disabled={waitingTime > 0}
      />
      <div className="w-10 text-center">{`${Math.floor(waitingTime / 60)}:${
        waitingTime % 60 < 10 ? `0${waitingTime % 60}` : waitingTime % 60
      }`}</div>
    </div>
  );
}
