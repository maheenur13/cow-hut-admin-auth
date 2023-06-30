import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import { AdminModel } from '../admin/admin.model';
import { UserModel } from '../user/user.model';
import { IProfile } from './myProfile.inteface';

const getProfileDetails = async (
  userData: JwtPayload
): Promise<IProfile | null> => {
  const { id, role } = userData;
  const getOptions = {
    phoneNumber: 1,
    name: 1,
    address: 1,
  };
  if (role === 'admin') {
    return await AdminModel.findOne({ _id: id }, getOptions).lean();
  }
  return await UserModel.findOne({ _id: id }, getOptions).lean();
};

const updateProfile = async (
  id: string,
  role: string,
  payload: IProfile
): Promise<IProfile | null> => {
  const { name, password, ...userData } = payload;

  const updatedProfileData: Partial<IProfile> = {
    ...userData,
  };

  let newPassword = null;
  if (password) {
    newPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_round));

    updatedProfileData.password = newPassword;
  }

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IProfile>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedProfileData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  let result = null;
  const selectableFields = 'name phoneNumber address';
  if (role !== 'admin') {
    result = await UserModel.findOneAndUpdate({ _id: id }, updatedProfileData, {
      new: true,
    })
      .select(selectableFields)
      .lean();
  } else {
    result = await AdminModel.findOneAndUpdate(
      { _id: id },
      updatedProfileData,
      {
        new: true,
      }
    )
      .select(selectableFields)
      .lean();
  }

  return result;
};

export const MyProfileService = {
  getProfileDetails,
  updateProfile,
};
