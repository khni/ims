import { ok } from "@avuny/utils";

// Define the minimum requirements for the input data
interface MinimalUserData {
  id: string;
  name: string;
  email: string;
}

interface MinimalTokenData {
  accessToken: string;
  refreshToken: string;
}

/**
 * Recieves results that extend the required data structures
 */
export const mapAuthResponse = <
  T extends { data: MinimalUserData },
  U extends { data: MinimalTokenData },
>(
  authResult: T,
  tokensResult: U
) => {
  return ok({
    user: {
      id: authResult.data.id,
      name: authResult.data.name,
      identifier: authResult.data.email,
    },
    tokens: {
      accessToken: tokensResult.data.accessToken,
      refreshToken: tokensResult.data.refreshToken,
    },
  });
};
