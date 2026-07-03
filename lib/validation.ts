// Input validation schemas using Zod

import { z } from 'zod';

export const registerChildSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  age: z.number().positive('Age must be positive'),
  sex: z.enum(['M', 'F']),
  weight: z.number().positive('Weight must be positive'),
  height: z.number().positive('Height must be positive'),
  muac: z.number().positive('MUAC must be positive'),
  headCircumference: z.number().positive().optional(),
  chestCircumference: z.number().positive().optional(),
});

export type RegisterChildInput = z.infer<typeof registerChildSchema>;

export const updateChildSchema = registerChildSchema.partial();

export type UpdateChildInput = z.infer<typeof updateChildSchema>;
