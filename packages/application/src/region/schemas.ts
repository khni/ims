import { z } from "@avuny/zod";

export const ItemResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  native: z.string().nullable(),
});

export const StateQuerySchema = z.object({
  countryId: z.uuid(),
});
