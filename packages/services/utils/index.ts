import { AxiosError } from 'axios';

export const handleError = (error?: unknown | AxiosError) => {
  return {
    message: error instanceof AxiosError ? error.message : undefined,
    status: error instanceof AxiosError ? error.response?.status : undefined,
    data: error instanceof AxiosError ? error.response?.data : undefined,
  };
};
