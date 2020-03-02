import { auth } from "./AuthStore";

export const config = {
  stores: {
    //app,
    auth
  },
  persist: ["auth"]
};
