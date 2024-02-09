import { z } from 'zod';

export const selectConfigSchema = z.object({
  options: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      color: z.string(),
    })
  ),
});
