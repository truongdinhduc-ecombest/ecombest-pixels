import { IPixelSettings } from "./pixel.interface";

export interface IPixelSpace {
  _id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  pixelSettings: IPixelSettings;
}
