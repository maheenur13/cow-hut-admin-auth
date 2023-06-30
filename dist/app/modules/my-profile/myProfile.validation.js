"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyProfileValidation = void 0;
const zod_1 = require("zod");
const updateProfileZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().optional(),
        name: zod_1.z
            .object({
            firstName: zod_1.z.string().optional(),
            lastName: zod_1.z.string().optional(),
        })
            .optional(),
        address: zod_1.z.string().optional(),
    }),
});
exports.MyProfileValidation = {
    updateProfileZodSchema,
};
