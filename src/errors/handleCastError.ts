import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/errors';

const handleCastError = (
  error: mongoose.Error.CastError
): IGenericErrorResponse => {
  const errorMessages: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid _id',
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages,
  };
};

export default handleCastError;
