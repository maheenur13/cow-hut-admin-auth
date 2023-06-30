import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { cowFilterableFileds } from './cow.constants';
import { ICow } from './cow.interface';
import { CowService } from './cow.service';

const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...cowData } = req.body;
    const result = await CowService.createCow(cowData);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow created successfully!',
      data: result,
    });
  }
);

const getAllCow = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFileds);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await CowService.getAllCow(filters, paginationOptions);

  sendResponse<ICow[] | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cows retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CowService.getSingleCow(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully!',
    data: result,
  });
});
const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CowService.deleteCow(req.user, id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully !',
    data: result,
  });
});

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const cowId = req.params.id;
  const updatedData = req.body;

  const result = await CowService.updateCow(req.user, cowId, updatedData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow updated successfully!',
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCow,
  getSingleCow,
  deleteCow,
  updateCow,
};
