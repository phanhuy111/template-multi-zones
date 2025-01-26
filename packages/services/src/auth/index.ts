import axios, { AxiosInstance } from 'axios';
import { handleError } from '../../utils';

type IAuthPayload = {
  loginCredential: string;
  password: string;
};

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const VERSION_API = process.env.NEXT_PUBLIC_VERSION_API || 'v1';
export const BACKEND_ENDPOINT = BACKEND_URL + `/api/identity/${VERSION_API}`;

export const loginUser = async ({
  payload,
}: {
  payload: IAuthPayload;
}) => {
  try {
    const ENDPOINT = `${BACKEND_ENDPOINT}/Authentication/login`;
    const res: any = await axios.post(ENDPOINT, {
      ...payload,
    });

    return res;
  } catch (error) {
    throw handleError(error);
  }
};