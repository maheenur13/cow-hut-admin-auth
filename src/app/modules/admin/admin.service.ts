import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwt.helpers';
import { IAdmin, ILoginAdmin, ILoginAdminResponse } from './admin.interface';
import { AdminModel } from './admin.model';

const createAdmin = async (data: IAdmin): Promise<IAdmin | null> => {
  // check if the admin is already exist or not
  const isExist = await AdminModel.isAdminExistByPhone(data.phoneNumber);
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin Already exists!');
  }
  const result = await AdminModel.create(data);

  return await AdminModel.findOne({ phoneNumber: result.phoneNumber });
};
const getAdmin = async (id: string): Promise<IAdmin | null> => {
  const isExist = await AdminModel.isAdminExistById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin does not exists!');
  }
  return await AdminModel.findById(id);
};

const loginAdmin = async (
  payload: ILoginAdmin
): Promise<ILoginAdminResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await AdminModel.isAdminExistByPhone(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist!');
  }

  if (
    isUserExist.password &&
    !(await AdminModel.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password does not match!');
  }

  //create access token and refresh token
  const { _id, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id: _id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { id: _id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

export const AdminService = {
  createAdmin,
  getAdmin,
  loginAdmin,
};
