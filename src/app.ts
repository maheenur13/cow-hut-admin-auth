/* eslint-disable no-unused-vars */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import routes from './app/Routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

// initialize the cors
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// initialize the main route
app.use('/api/v1', routes);

//handle global errors
app.use(globalErrorHandler);

// handle api not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Api Not found',
      },
    ],
  });
  next();
});

export default app;
