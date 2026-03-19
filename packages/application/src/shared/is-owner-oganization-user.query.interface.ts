export interface IIsOwnerOrganizationUserQuery {
  check: (params: {
    query: {
      organizationId: string;
      userId: string;
    };
  }) => Promise<boolean>;
}
