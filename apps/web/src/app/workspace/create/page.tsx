"use client";
import { useIsAuthenticated } from "@/src/api";
import NavbarContainer from "@/src/features/auth/NavbarContainer";
import CreateOrganizationForm from "@/src/features/organization/forms/CreateOrganizationForm";
import React from "react";

function Page() {
  const { data, isLoading } = useIsAuthenticated({
    query: {
      queryKey: ["getAuthenticatedUser"],
      retry: 1,
    },
  });
  return (
    <NavbarContainer isLoading={isLoading} user={data?.data}>
      {<CreateOrganizationForm />}
    </NavbarContainer>
  );
}

export default Page;
