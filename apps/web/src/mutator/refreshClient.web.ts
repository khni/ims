import Axios from "axios";

export const webRefreshClient = {
  async refresh() {
    const { data } = await Axios.post(
      "/token/refresh",
      {},
      { withCredentials: true }
    );

    return { accessToken: data.accessToken };
  },
};
