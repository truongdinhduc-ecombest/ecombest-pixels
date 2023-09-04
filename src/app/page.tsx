"use client";

import PixelSpace from "@/components/PixelSpace";
import { IPixelSpace } from "@/interfaces/pixelSpace.interface";
import { getPixelSpaces } from "@/services/pixelSpace.service";
import { useEffect, useState } from "react";

export default function Home() {
  const [pixelSpaces, setPixelSpaces] = useState<IPixelSpace[]>([]);

  useEffect(() => {
    getPixelSpaces({}).then((result) => {
      setPixelSpaces(result);
    });
  }, []);

  return (
    <div className="h-screen">
      <div className="flex gap-10 p-10">
        {pixelSpaces?.map((pixelSpace) => {
          return <PixelSpace key={pixelSpace?._id} pixelSpace={pixelSpace} />;
        })}
      </div>
    </div>
  );
}
