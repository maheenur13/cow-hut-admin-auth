import { Response } from 'express';

type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  data: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
};
const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data || null,
    meta: data.meta,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
