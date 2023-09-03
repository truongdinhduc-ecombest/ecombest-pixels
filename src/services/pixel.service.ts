import { API_URLS } from "@/constants/API.constant";
import { callService } from "@/utils/service.util";
import { stringify } from "qs";

export const getPixels = (filter: object) => {
  return callService({
    url: `${API_URLS.pixel}/get-many?${stringify(filter)}`,
    method: "get",
  });
};

export const createPixel = (pixel: object) => {
  return callService({
    url: `${API_URLS.pixel}/create-one`,
    method: "post",
    data: pixel,
  });
};
