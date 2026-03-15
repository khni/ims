import { cookieConfig } from "@/src/cookieConfig";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
type SelectedOrganization = { id: string; name: string };
export interface SelectedOrganizationContext {
  selectedOrganizationId: string | undefined;
  setSelectedOrganizationId: (selectedOrganizationId: string) => void;
  clearSelectedOrganizationId: () => void;
}

export const selectedOrganizationContext =
  createContext<SelectedOrganizationContext>({
    selectedOrganizationId: "",
    setSelectedOrganizationId: (selectedOrganizationId: string) => {},
    clearSelectedOrganizationId: () => {},
  });

export default function SelectedOrganizationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookies, setCookie, removeCookie] = useCookies([
    "selectedOrganizationId",
  ]);
  const [selectedOrganizationId, setSelectedOrganizationState] = useState<
    string | undefined
  >();

  //WIP remove cookie if organization id is not asscoited any more with any organization( organization is deleted for example)
  // if (selectedOrganizationId) {
  //   const organization = useGetOrganizationById(selectedOrganizationId);
  //   if (!organization.data?.data) {
  //     setSelectedOrganizationState(undefined);
  //     if (cookies.selectedOrganizationId) {
  //       removeCookie("selectedOrganizationId");
  //     }
  //   }
  // }

  useEffect(() => {
    setSelectedOrganizationState(cookies.selectedOrganizationId);
  }, [cookies.selectedOrganizationId]);

  return (
    <selectedOrganizationContext.Provider
      value={{
        selectedOrganizationId,
        setSelectedOrganizationId: (selectedOrganizationId: string) => {
          if (cookies.selectedOrganizationId) {
            removeCookie("selectedOrganizationId", cookieConfig);
          }
          setCookie(
            "selectedOrganizationId",
            selectedOrganizationId,
            cookieConfig
          );
          console.log("NODE_ENV", process.env.NODE_ENV);
          setSelectedOrganizationState(selectedOrganizationId);
        },
        clearSelectedOrganizationId: () => {
          setSelectedOrganizationState(undefined);
          if (cookies.selectedOrganizationId) {
            removeCookie("selectedOrganizationId", cookieConfig);
          }
        },
      }}
    >
      {children}
    </selectedOrganizationContext.Provider>
  );
}

export function useSelectedOrganizationContext() {
  const context = useContext(selectedOrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedOrganizationContext must be used within selectedOrganizationContext provider"
    );
  }

  return context;
}
