import { fetchWithAuth } from "../_helpers";

export const userService = {
  login,
  register,
  verify,
  getAll,
  getUserById,
  updateUser,
  deleteUser,
  uploadPhoto,
  getPhoto
};

const apiUrl = "http://localhost:80";

function login(email, password) {
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(email + ":" + password)
    }
  };

  return fetch(`${apiUrl}/auth/jwt/token`, requestOptions)
    .then(handleResponse)
    .then(response => {
      // login successful if there's a jwt token in the response
      if (response.jwt) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("jwt", JSON.stringify(response));
      }

      return response;
    })
    .then(() => {
      return getAuthenticatedUser();
    });
}

function register(user) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  };

  return fetch(`${apiUrl}/users`, requestOptions).then(handleResponse);
}

function verify(token) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  return fetch(`${apiUrl}/users/verify-email/${token}`, requestOptions).then(
    handleResponse
  );
}

function getAll() {
  return fetchWithAuth(`${apiUrl}/users`).then(handleResponse);
}

function getUserById(id) {
  return fetchWithAuth(`${apiUrl}/users/${id}`).then(handleResponse);
}

function getAuthenticatedUser() {
  return fetchWithAuth(`${apiUrl}/auth/me`)
    .then(handleResponse)
    .then(user => {
      if (user) {
        // store user details
        localStorage.setItem("user", JSON.stringify(user));
      }

      return user;
    });
}

/**
 *
 * @param user
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
function updateUser(user) {
  const requestOptions = {
    method: "PATCH",
    body: JSON.stringify(user)
  };

  return fetchWithAuth(`${apiUrl}/users/${user.id}`, requestOptions).then(
    handleResponse
  );
}

/**
 * Delete user
 * @param id
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 * @private
 */
function deleteUser(id) {
  const requestOptions = {
    method: "DELETE"
  };

  return fetchWithAuth(`${apiUrl}/users/${id}`, requestOptions).then(
    handleResponse
  );
}

/**
 * Upload a photo to the users profile
 * @param formData
 * @returns {PromiseLike<{data: T, url: string} | never>}
 */
function uploadPhoto(formData) {
  const requestOptions = {
    method: "POST",
    body: formData
  };

  return fetchWithAuth(`${apiUrl}/users/me/photo/`, requestOptions, false)
    .then(handleResponse)
    .then(userData => {
      localStorage.setItem("user", JSON.stringify(userData));

      return {
        data: userData,
        url: `${apiUrl}/users/${userData.id}/photo/${userData.image}`
      };
    });
}

function getPhoto(user) {
  return `${apiUrl}/users/${user.id}/photo/${user.image}`;
}

/**
 * Handle common responses
 * @param response
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
function handleResponse(response) {
  return response.text().then(text => {
    const responseRawData = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        location.reload(true);
      }

      const error =
        (responseRawData && responseRawData.message) || response.statusText;
      return Promise.reject(error);
    }

    if (responseRawData.data) {
      return responseRawData.data;
    }
    return responseRawData;
  });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}
