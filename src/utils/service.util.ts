import axios, { AxiosRequestConfig } from "axios";

export const callService = async (config: AxiosRequestConfig) => {
  try {
    const response = await axios({
      ...config,
      headers: {
        "Access-Control-Allow-Origin": "*/*",
        Accept: "*/*",
      },
    });
    return response?.data?.data;
  } catch (error: any) {
    alert(error?.response?.data?.message ?? "Something went wrong.");
    throw error;
  }
};
