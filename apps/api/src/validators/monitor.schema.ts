import { z } from "zod";

export const createMonitorSchema = z.object({
  name: z.string().min(1, "name is required").max(200),
  url: z.string().url("url must be a valid URL"),
  regions: z
    .array(z.string().min(1))
    .min(1, "at least one region is required"),
  expectedStatusCode: z.number().int().min(100).max(599).default(200),
  intervalSeconds: z
    .number()
    .int()
    .min(10, "intervalSeconds must be at least 10")
    .max(86_400)
    .default(60),
});

export const updateMonitorSchema = createMonitorSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "at least one field must be provided",
  });

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;
export type UpdateMonitorInput = z.infer<typeof updateMonitorSchema>;
