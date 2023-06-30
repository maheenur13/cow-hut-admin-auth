import { CookieOptions, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAdmin, ILoginAdminResponse } from './admin.interface';
import { AdminService } from './admin.service';

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...adminData } = req.body;
    const result = await AdminService.createAdmin(adminData);

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  }
);

const getAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.getAdmin(id);

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin retrieved successfully!',
      data: result,
    });
  }
);

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AdminService.loginAdmin(loginData);

  const { refreshToken, ...others } = result;

  const cookieOptions: CookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: others,
  });
});

export const AdminController = {
  createAdmin,
  getAdmin,
  loginAdmin,
};
