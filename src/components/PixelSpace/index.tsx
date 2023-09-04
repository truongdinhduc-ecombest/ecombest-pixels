import { IPixelSpace } from "@/interfaces/pixelSpace.interface";
import Canvas from "../Canvas";
import useCanvas from "@/hooks/useCanvas";
import { useEffect } from "react";
import { addPixelsToPixelSpace, setCanvasViewport } from "@/utils/canvas.util";
import { getPixels } from "@/services/pixel.service";
import { useRouter } from "next/navigation";

interface Props {
  pixelSpace: IPixelSpace;
}

export default function PixelSpace(props: Props) {
  const { pixelSpace } = props;
  const { _id, name, width, height, backgroundColor, pixelSettings } =
    pixelSpace;
  const router = useRouter();
  const { canvas } = useCanvas(_id, {
    width: 1,
    height: 1,
    backgroundColor,
  });

  useEffect(() => {
    if (canvas && pixelSpace?._id) {
      const { width, height } = pixelSpace;
      setCanvasViewport(canvas, { width, height });
      getPixels({ pixelSpaceId: pixelSpace?._id }).then((pixels) => {
        addPixelsToPixelSpace(canvas, pixels);
      });
    }
  }, [canvas, pixelSpace]);

  const onClickPixelSpace = () => {
    router.push(`/pixel-space/${_id}`);
  };

  return (
    <div
      className="w-72 border-2 hover:bg-gray-300 cursor-pointer rounded-2xl overflow-hidden"
      onClick={onClickPixelSpace}
    >
      <div className="h-48 shadow-md shadow-black bg-gray-300">
        <Canvas canvas={canvas} canvasId={_id} />
      </div>
      <div className="my-2">
        <div className="text-center">{name}</div>
        <div className="text-center">{`${Math.round(
          width / pixelSettings.width
        )}x${Math.round(height / pixelSettings.width)}`}</div>
      </div>
    </div>
  );
}
