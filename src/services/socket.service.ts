import { API_BASE_URL } from "@/constants/API.constant";
import { IPixelOptions } from "@/interfaces/pixel.interface";
import { io } from "socket.io-client";

const socket = io(API_BASE_URL);

export const joinPixelSpace = (pixelSpaceId: string) => {
  socket.emit("joinPixelSpace", { pixelSpaceId });
};

export const joinedPixelSpace = (callback?: (...args: any[]) => void) => {
  socket.on("joinedPixelSpace", (data) => {
    callback?.(data?.totalOnlineUsers ?? 0);
  });
};

export const leavePixelSpace = (pixelSpaceId: string) => {
  socket.emit("leavePixelSpace", { pixelSpaceId });
};

export const leftPixelSpace = (callback?: (...args: any[]) => void) => {
  socket.on("leftPixelSpace", (data) => {
    callback?.(data?.totalOnlineUsers ?? 0);
  });
};

export const placePixel = (pixel: IPixelOptions) => {
  socket.emit("placePixel", pixel);
};

export const placedPixel = (callback: (pixel: IPixelOptions) => void) => {
  socket.on("placedPixel", (pixel) => {
    callback?.(pixel);
  });
};
