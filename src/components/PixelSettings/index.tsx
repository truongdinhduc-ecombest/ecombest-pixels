import { addPixelSettings } from "@/utils/canvas.util";
import { useEffect, useState } from "react";

interface Props {
  canvas?: fabric.Canvas;
  pixelSpace?: any;
}

export function PixelSettings(props: Props) {
  const { canvas, pixelSpace } = props;
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
      setWaitingTime(pixelSpace?.waitingTime ?? 0);
      (canvas as any).pixelPlaceable = false;
    };
    const placeablePixel = () => {
      setWaitingTime(0);
      (canvas as any).pixelPlaceable = true;
    };
    if (canvas && pixelSpace?.pixelSettings) {
      addPixelSettings(canvas, pixelSpace.pixelSettings);
      canvas.on("pixel:placed", placePixel);
      canvas.on("pixel:placeable", placeablePixel);
    }
    return () => {
      canvas?.off("pixel:placed", placePixel);
      canvas?.off("pixel:placeable", placeablePixel);
    };
  }, [canvas, pixelSpace]);

  const onChangeColor = (color: string) => {
    (canvas as any).hoverPixel.set({ fill: color });
  };

  return (
    <div
      className={`absolute bottom-2 flex items-center space-x-2 px-4 py-2 shadow-2xl shadow-black rounded bg-white ${
        waitingTime > 0 ? "opacity-50" : ""
      }`}
    >
      <input
        name="pixel-color"
        className="h-10 w-10"
        defaultValue={pixelSpace?.pixelSettings?.color}
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
