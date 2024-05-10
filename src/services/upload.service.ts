import { apiClient } from "@/lib/api";

const uploadFile = async (data: any) => {
  const response = await apiClient.post(`/upload`, data, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};

const uploadImage = async (data: any) => {
  const response = await apiClient.post(`/upload/favicon`, data, {
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export { uploadFile, uploadImage };
