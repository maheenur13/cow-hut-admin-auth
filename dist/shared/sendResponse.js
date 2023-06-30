"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const responseData = {
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data || null,
        meta: data.meta,
    };
    res.status(data.statusCode).json(responseData);
};
exports.default = sendResponse;
