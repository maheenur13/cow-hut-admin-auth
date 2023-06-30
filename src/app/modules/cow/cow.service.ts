import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/pagination.helpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { UserModel } from '../user/user.model';
import { cowSearchableFields } from './cow.constants';
import { ICow, ICowFilers } from './cow.interface';
import { CowModel } from './cow.model';

// create cow
const createCow = async (cowData: ICow): Promise<ICow | null> => {
  const isSellerValid = await UserModel.findById(cowData.seller);
  if (!isSellerValid || isSellerValid.role !== 'seller') {
    throw new ApiError(httpStatus.NOT_FOUND, 'invalid seller!');
  }
  if (!cowData.label) {
    cowData.label = 'for sale';
  }

  const newCow = (await CowModel.create(cowData)).populate('seller');

  return newCow;
};

// get all cow
const getAllCow = async (
  filters: ICowFilers,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[] | null>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        let newData = {};
        if (field === 'minPrice') {
          newData = {
            price: { $gte: Number(value) },
          };
        } else if (field === 'maxPrice') {
          newData = {
            price: { $lte: Number(value) },
          };
        } else if (field === 'location') {
          newData = {
            location: { $regex: value, $options: 'i' },
          };
        } else {
          newData = {
            [field]: value,
          };
        }
        return newData;
      }),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await CowModel.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .lean();
  const total = await CowModel.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single cow
const getSingleCow = async (id: string): Promise<ICow | null> => {
  const isExist = await CowModel.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow do not exist!');
  }
  return await CowModel.findById(id).populate('seller');
};

// delete cow
const deleteCow = async (
  userData: JwtPayload,
  id: string
): Promise<ICow | null> => {
  const isExist = await CowModel.isCowExistBySellerId(id, userData.id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow do not exist!');
  }
  return await CowModel.findByIdAndDelete(id).populate('seller');
};

// update single cow
const updateCow = async (
  userData: JwtPayload,
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const isExist = await CowModel.isCowExistBySellerId(id, userData.id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow do not exist!');
  }

  const updatedUserData: Partial<ICow> = { ...payload };

  const result = await CowModel.findByIdAndUpdate(id, updatedUserData, {
    new: true,
  }).populate('seller');
  return result;
};

export const CowService = {
  createCow,
  getAllCow,
  getSingleCow,
  deleteCow,
  updateCow,
};
