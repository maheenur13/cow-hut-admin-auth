import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/errors';

type ErrorType = mongoose.Error.ValidationError;

const handleValidationError = (err: ErrorType): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(el => {
    return {
      path: el?.path,
      message: el?.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
