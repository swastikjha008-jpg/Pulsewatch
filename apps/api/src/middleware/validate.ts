import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

/** Validates and coerces req.body against a zod schema, replacing req.body with the parsed result. */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "ValidationError",
        details: result.error.flatten(),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
