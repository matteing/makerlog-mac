import {
  observable,
  computed,
  action,
  runInAction,
  flow,
  when,
  reaction
} from "mobx";
import { persist } from "mobx-persist";
import { getToken, getUser } from "~/lib/auth";
import axios from "~/vendor/axios";

class AuthStore {
  @observable isLoading = false;
  @persist @observable token = null;
  @persist("object") @observable user = null;
  @observable error = false;
  @observable errorMessages = null;

  @computed get isLoggedIn() {
    return this.token !== null && this.user !== null;
  }

  constructor() {
    when(
      // once...
      () => this.token !== null && this.token !== "" && this.token !== "null",
      // ... then
      () => {
        this.setTokenHeader(this.token);
        this.getUser();
      }
    );
  }

  getUser = flow(function*() {
    this.isLoading = true;
    this.user = null;

    try {
      let user = yield getUser();
      this.user = user;
      this.isLoading = false;
    } catch (e) {
      this.error = true;
      this.isLoading = false;
      this.errorMessages = e.message || e.field_errors;
    }
  });

  login = flow(function*(username, password, token = null) {
    this.token = null;
    this.user = null;
    this.isLoading = true;

    try {
      if (!token) {
        token = yield getToken(username, password);
      }
      this.setToken(token);
      yield this.getUser();
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      this.error = true;
      this.errorMessages = e.message || e.field_errors;
    }
  });

  @action
  setToken = (token, res = null) => {
    this.token = token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  @action
  logout = (res = null) => {
    this.token = null;
    this.user = null;
    axios.defaults.headers.common["Authorization"] = "";
  };

  setTokenHeader = token => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };
}

export const auth = new AuthStore();
