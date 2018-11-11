import { userService } from "../_services";
import { router } from "../_helpers";

const user = JSON.parse(localStorage.getItem("user"));
const state = user
  ? { verification: { verified: true }, status: { loggedIn: true }, user }
  : { verification: {}, status: {}, user: null };

const actions = {
  login({ dispatch, commit }, { email, password }) {
    commit("loginRequest", { email });

    userService.login(email, password).then(
      user => {
        commit("loginSuccess", user);
        router.push("/");
      },
      error => {
        commit("loginFailure", error);
        dispatch("alert/error", error, { root: true });
      }
    );
  },
  verify({ dispatch, commit }, { token }) {
    commit("verifyRequest", { token });

    userService.verify(token).then(
      user => {
        commit("verifySuccess", user);
        router.push("/login");
        setTimeout(() => {
          // display success message after route change completes
          dispatch(
            "alert/success",
            "You have been verified, you can now login",
            { root: true }
          );
        });
      },
      error => {
        commit("verifyFailure", error);
        dispatch("alert/error", error, { root: true });
      }
    );
  },
  logout({ commit }) {
    localStorage.removeItem("user");
    commit("logout");
  },
  register({ dispatch, commit }, user) {
    commit("registerRequest", user);

    userService.register(user).then(
      user => {
        commit("registerSuccess", user);
        router.push("/login");
        setTimeout(() => {
          // display success message after route change completes
          dispatch(
            "alert/success",
            "Registration successful, please check your email for a verification link",
            { root: true }
          );
        });
      },
      error => {
        commit("registerFailure", error);
        dispatch("alert/error", error, { root: true });
      }
    );
  }
};

const mutations = {
  loginRequest(state, user) {
    state.status = { loggingIn: true };
    state.user = user;
  },
  loginSuccess(state, user) {
    state.status = { loggedIn: true };
    state.user = user;
  },
  loginFailure(state) {
    state.status = {};
    state.user = null;
  },
  verifyRequest(state, token) {
    state.verification.token = token;
    state.verification.verifying = true;
    state.verification.verified = false;
  },
  verifySuccess(state) {
    state.verification.verifying = false;
    state.verification.verified = true;
  },
  verifyFailure(state) {
    state.verification.verifying = false;
    state.verification.verified = false;
  },
  logout(state) {
    state.status = {};
    state.user = null;
  },
  registerRequest(state, user) {
    state.status = { registering: true };
  },
  registerSuccess(state, user) {
    state.status = {};
  },
  registerFailure(state, error) {
    state.status = {};
  },
};

export const account = {
  namespaced: true,
  state,
  actions,
  mutations
};
