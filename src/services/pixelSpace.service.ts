import { API_URLS } from "@/constants/API.constant";
import { callService } from "@/utils/service.util";
import { stringify } from "qs";

export const getPixelSpace = (id: string) => {
  return callService({
    url: `${API_URLS.pixelSpace}/${id}`,
    method: "get",
  });
};

export const getPixelSpaces = (filter: object) => {
  return callService({
    url: `${API_URLS.pixelSpace}/get-many?${stringify(filter)}`,
    method: "get",
  });
};
