import axios from 'axios';
import FormData from 'form-data';
import { ReadStream } from 'fs';

export type HttpClientArgs = {
  baseURL: string;
};

export interface HttpBotClient {
  post: <B = unknown, R = unknown>(
    method: string,
    data: B,
  ) => Promise<{ data: R }>;
}

const createHttpClient = ({ baseURL }: HttpClientArgs): HttpBotClient => {
  const client = axios.create({
    baseURL,
  });
  return {
    post(method, data) {
      const formData = new FormData();

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'object' && !(value instanceof ReadStream))
            formData.append(key, JSON.stringify(value));
          else formData.append(key, value);
        });
      }
      return client.post(method, formData, {
        headers: formData.getHeaders(),
      });
    },
  };
};

export default createHttpClient;
