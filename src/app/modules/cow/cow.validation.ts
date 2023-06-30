import { z } from 'zod';
import { cowBreedEnums, cowLocationsEnums } from './cow.constants';

const createCowZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required!' }),
    age: z.number({
      required_error: 'age is required!',
    }),
    price: z.number({ required_error: 'price is required' }),
    location: z.enum([...cowLocationsEnums] as [string, ...string[]], {
      required_error: 'location required!',
    }),
    breed: z.enum([...cowBreedEnums] as [string, ...string[]], {
      required_error: 'breed required!',
    }),
    label: z.enum(['for sale', 'sold out'] as [string, ...string[]]).optional(),
    category: z.enum(['Beef', 'Dairy', 'Dual Purpose'], {
      required_error: 'category required!',
    }),
    seller: z.string({ required_error: 'seller id required!' }),
    weight: z.number({ required_error: 'Weight required!' }),
  }),
});

const updateCowZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    price: z.number().optional(),
    location: z
      .enum([...cowLocationsEnums] as [string, ...string[]])
      .optional(),
    breed: z.enum([...cowBreedEnums] as [string, ...string[]]).optional(),
    label: z.enum(['for sale', 'sold out'] as [string, ...string[]]).optional(),
    category: z.enum(['Beef', 'Dairy', 'Dual Purpose']).optional(),
    seller: z.string().optional(),
    weight: z.number().optional(),
  }),
});

export const CowValidation = {
  createCowZodSchema,
  updateCowZodSchema,
};
