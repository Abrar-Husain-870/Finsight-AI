import { z } from 'zod';

export const updateProfileSchema = z.object({
  currency: z.string().length(3).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
