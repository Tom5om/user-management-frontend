import { userService } from "../_services";

const state = {
  upload: {},
  update: {}
};

const actions = {
  uploadFile({ commit }, formData) {
    commit("uploadFileRequest");

    userService
      .uploadPhoto(formData)
      .then(
        responseData => commit("uploadFileSuccess", responseData),
        error => commit("uploadFileFailure", error)
      );
  },

  submitProfile({ commit }, formData) {
    commit("updateProfileRequest");
    userService
      .updateUser(formData)
      .then(response => {
        localStorage.setItem("user", JSON.stringify(response));
        return response;
      })
      .then(
        responseData => commit("updateProfileSuccess", responseData),
        error => commit("updateProfileFailure", error)
      );
  },
  checkIfEmailExists({ commit }, email) {
    commit("emailExistsRequest");
    userService
      .checkIfEmailExists(email)
      .then(response => {
        localStorage.setItem("user", JSON.stringify(response));
        return response;
      })
      .then(
        responseData => commit("emailExistsSuccess", responseData),
        error => commit("emailExistsFailure", error)
      );
  },
};

const mutations = {
  uploadFileRequest(state) {
    state.upload = { uploading: true };
  },
  uploadFileSuccess(state, file) {
    state.upload = { uploading: false, file };
  },
  uploadFileFailure(state, error) {
    state.upload = { error };
  },
  updateProfileRequest(state) {
    state.update = { updating: true, updated: false };
  },
  updateProfileSuccess(state, userData) {
    state.update = { updating: false, updated: true };
  },
  updateProfileFailure(state, error) {
    state.update = { error };
  },
  emailExistsRequest(state, exists) {
    state.emailExists = { checking: true, checked: false, exists: false };
  },
  emailExistsSuccess(state, exists) {
    state.update = { checking: false, checked: true, exists };
  },
  emailExistsFailure(state, error) {
    state.update = { error };
  }
};

export const profile = {
  namespaced: true,
  state,
  actions,
  mutations
};
