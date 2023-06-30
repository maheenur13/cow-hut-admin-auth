import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IProfile } from './myProfile.inteface';
import { MyProfileService } from './myProfile.service';

const getProfileDetails = catchAsync(async (req: Request, res: Response) => {
  const data = req.user;
  const result = await MyProfileService.getProfileDetails(data);

  sendResponse<IProfile>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully!',
    data: result,
  });
});
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { id, role } = req.user;
  const profileData = req.body;

  const result = await MyProfileService.updateProfile(id, role, profileData);

  sendResponse<IProfile>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully!',
    data: result,
  });
});

export const MyProfileController = {
  getProfileDetails,
  updateProfile,
};
