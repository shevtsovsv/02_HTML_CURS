import { makeAutoObservable } from "mobx";

class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user) {
    this.user = user;
  }

  get isLoggedIn() {
    return this.user !== null;
  }
}

const userStore = new UserStore();
export default userStore;
