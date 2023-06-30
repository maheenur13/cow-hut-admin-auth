import { z } from 'zod';

const updateProfileZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    address: z.string().optional(),
  }),
});
export const MyProfileValidation = {
  updateProfileZodSchema,
};
