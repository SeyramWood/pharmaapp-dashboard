import { atom } from "jotai";

const authUser = atom({
  data: {},
  isLoggedIn: false,
  isAdmin: false,
  error: null,
  loading: false,
});
const authToken = atom("");

export { authUser, authToken };
