import axios, { AxiosResponse } from 'axios';

export const fetchUrlText = async (url: string): Promise<string> => {
  const response: AxiosResponse<string, string> = await axios.get(url, {
    responseType: 'text',
    validateStatus: null,
  });
  return response.data;
};
