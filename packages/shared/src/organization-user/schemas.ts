import { OrganizationUserStatus } from "@avuny/db/enums";

import { z } from "@avuny/zod";

export const organizationUserSchema = z.object({
  name: z.string(),
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  organizationId: z.string(),
  status: z.enum(OrganizationUserStatus),
  expiresAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

// body schemas
export const mutateOrganizationUserSchema = organizationUserSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    organizationId: true,
    status: true,
  })
  .extend({
    identifier: z.email(),
  });

export const createOrganizationUserRepositorySchema =
  mutateOrganizationUserSchema
    .extend({
      organizationId: z.string(),
      status: z.enum(OrganizationUserStatus),
      userId: z.string(),
    })
    .omit({
      identifier: true,
    });

export const createOrganizationUserBodySchema = mutateOrganizationUserSchema;

// params schema
export const updateOrganizationUserBodySchema =
  mutateOrganizationUserSchema.omit({
    identifier: true,
  });

export const getOrganizationUserByIdSchema = organizationUserSchema.pick({
  id: true,
});

// Response schemas
export const mutateOrganizationUserResponseSchema = organizationUserSchema.pick(
  {
    id: true,
    name: true,
  },
);

export const getOrganizationUserByIdResponseSchema = organizationUserSchema
  .pick({
    id: true,
    name: true,
    status: true,
    updatedAt: true,
    expiresAt: true,
  })
  .extend({
    role: z.object({
      name: z.string(),
      id: z.string(),
    }),
    user: z.object({ email: z.string() }),
  });
export const organizationUserListResponseSchema =
  getOrganizationUserByIdResponseSchema.array();

//filters
export const OrganizationUserFiltersSchema = z.object({
  name: z.string().optional(),
  status: z.array(z.enum(OrganizationUserStatus)).optional(),
  roleName: z.string().optional(),
});
const StringFilter = z.object({
  contains: z.string(),
  mode: z.enum(["default", "insensitive"]).optional(),
});

export const OrFilterSchema = z.object({
  OR: z.array(
    z.union([
      z.object({
        name: StringFilter,
      }),
      z.object({
        user: z.object({
          email: StringFilter,
        }),
      }),
    ]),
  ),
});
export const OrganizationUserRepoFiltersSchema = z.object({
  OR: z
    .array(
      z.union([
        z.object({
          name: StringFilter,
        }),
        z.object({
          user: z.object({
            email: StringFilter,
          }),
        }),
      ]),
    )
    .optional(),
  status: z.object({ in: z.array(z.enum(OrganizationUserStatus)) }).optional(),
  role: z
    .object({
      name: z.object({
        contains: z.string(),
        mode: z.literal("insensitive"),
      }),
    })
    .optional(),
  organizationId: z.uuid(),
  NOT: z.object({
    name: z.string(),
  }),
});
