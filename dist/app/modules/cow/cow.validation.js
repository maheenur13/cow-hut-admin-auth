"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowValidation = void 0;
const zod_1 = require("zod");
const cow_constants_1 = require("./cow.constants");
const createCowZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required!' }),
        age: zod_1.z.number({
            required_error: 'age is required!',
        }),
        price: zod_1.z.number({ required_error: 'price is required' }),
        location: zod_1.z.enum([...cow_constants_1.cowLocationsEnums], {
            required_error: 'location required!',
        }),
        breed: zod_1.z.enum([...cow_constants_1.cowBreedEnums], {
            required_error: 'breed required!',
        }),
        label: zod_1.z.enum(['for sale', 'sold out']).optional(),
        category: zod_1.z.enum(['Beef', 'Dairy', 'Dual Purpose'], {
            required_error: 'category required!',
        }),
        seller: zod_1.z.string({ required_error: 'seller id required!' }),
        weight: zod_1.z.number({ required_error: 'Weight required!' }),
    }),
});
const updateCowZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        age: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        location: zod_1.z
            .enum([...cow_constants_1.cowLocationsEnums])
            .optional(),
        breed: zod_1.z.enum([...cow_constants_1.cowBreedEnums]).optional(),
        label: zod_1.z.enum(['for sale', 'sold out']).optional(),
        category: zod_1.z.enum(['Beef', 'Dairy', 'Dual Purpose']).optional(),
        seller: zod_1.z.string().optional(),
        weight: zod_1.z.number().optional(),
    }),
});
exports.CowValidation = {
    createCowZodSchema,
    updateCowZodSchema,
};
