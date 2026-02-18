import { Fail, Ok } from "@avuny/utils";
import { IRepository } from "./IRepository.js";

export interface IMutationService<R extends IRepository> {
  create: <
    TCreateInput extends Omit<
      Parameters<R["create"]>[0]["data"],
      "id" | "organizationId"
    > & {
      name: string;
    },
  >(params: {
    data: TCreateInput;
    context: {
      userId: string;
      requestId: string;
      organizationId: string;
    };
  }) => Promise<
    | Fail<"MODULE_NAME_CONFLICT">
    | Fail<"MODULE_CREATION_LIMIT_EXCEEDED">
    | Ok<Awaited<ReturnType<R["create"]>>>
  >;

  update: <
    TUpdateInput extends Omit<
      Parameters<R["update"]>[0]["data"],
      "id" | "organizationId"
    > & {
      name?: string;
    },
  >(params: {
    data: TUpdateInput;
    id: string;
    context: {
      userId: string;
      requestId: string;
      organizationId: string;
    };
  }) => Promise<
    Fail<"MODULE_NAME_CONFLICT"> | Ok<Awaited<ReturnType<R["update"]>>>
  >;
}
