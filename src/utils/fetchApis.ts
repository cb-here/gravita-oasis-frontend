import axios from "@/lib/axiosInstance";
import { cleanParams } from "./cleanParams";

export const fetchDocuments = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
  },
  config?: object
) => {
  const response = await axios.get(`/documents`, {
    params: cleanParams(params),
    ...config, // spread other configs (e.g., headers)
  });
  return response.data?.Response;
};
