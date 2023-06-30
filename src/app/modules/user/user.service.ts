import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IUser } from './user.interface';
import { UserModel } from './user.model';

const getAllUser = async (): Promise<IUser[] | null> => {
  return await UserModel.find({}).lean();
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const isExist = await UserModel.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user exists!');
  }
  return await UserModel.findById(id);
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const isExist = await UserModel.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user exists!');
  }
  return await UserModel.findByIdAndDelete(id).lean();
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await UserModel.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user exist!');
  }
  const { name, ...userData } = payload;
  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await UserModel.findByIdAndUpdate(id, updatedUserData, {
    new: true,
  }).lean();
  return result;
};

export const UserService = {
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
};
