import { addPixelSettings } from "@/utils/canvas.util";
import { useEffect, useState } from "react";

interface Props {
  canvas?: fabric.Canvas;
}

export function PixelSettings(props: Props) {
  const { canvas } = props;
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter <= 0 && canvas) {
      (canvas as any).pixelPlaceable = true;
      return;
    }
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [counter, canvas]);

  useEffect(() => {
    const placePixel = () => {
      setCounter(10);
      (canvas as any).pixelPlaceable = false;
    };
    if (canvas) {
      addPixelSettings(canvas, { width: 10, color: "#ff0000" });
      canvas.on("pixel:placed", placePixel);
    }
    return () => {
      canvas?.off("pixel:placed", placePixel);
    };
  }, [canvas]);

  const onChangeColor = (color: string) => {
    (canvas as any).pixelSettings.color = color;
    (canvas as any).hoverPixel.set({ fill: color });
  };

  return (
    <div
      className={`absolute bottom-2 flex items-center space-x-2 px-4 py-2 shadow-2xl shadow-black rounded bg-white ${
        counter > 0 ? "opacity-50" : ""
      }`}
    >
      <input
        name="pixel-color"
        className="h-10 w-10"
        defaultValue={"#ff0000"}
        type="color"
        onChange={(event) => {
          onChangeColor(event.target.value);
        }}
        disabled={counter > 0}
      />
      <div className="w-10 text-center">{`${Math.floor(counter / 60)}:${
        counter % 60 < 10 ? `0${counter % 60}` : counter % 60
      }`}</div>
    </div>
  );
}
