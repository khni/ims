import { z } from "@avuny/zod";
export const organizationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(100),
  description: z.string().min(5).max(500).nullable().optional(),
  industryCategoryId: z.string().uuid().nullable().optional(),
  fiscalYearPatternId: z.string().uuid().nullable().optional(),
  stateId: z.uuid(),
  inventoryStartDate: z.date(),
  ownerId: z.uuid(),
  address: z.string().min(5).max(255).nullable().optional(),
  zipCode: z.string().min(3).max(10).nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// body schemas
export const mutateOrganizationSchema = organizationSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    ownerId: true,
    inventoryStartDate: true,
  })
  .extend({ inventoryStartDate: z.iso.datetime() });
export const createOrganizationBodySchema = mutateOrganizationSchema;

// params schema
export const updateOrganizationBodySchema = mutateOrganizationSchema.partial();

export const getOrganizationByIdSchema = organizationSchema.pick({ id: true });

// Response schemas
export const mutateOrganizationResponseSchema = organizationSchema.pick({
  id: true,
  name: true,
});

export const organizationListResponseSchema = organizationSchema.pick({
  id: true,
  name: true,
  description: true,
  updatedAt: true,
});

export const getOrganizationByIdResponseSchema = organizationSchema;
