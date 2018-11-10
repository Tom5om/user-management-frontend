function authHeader() {
  // return authorization header with jwt token
  let data = JSON.parse(localStorage.getItem("jwt"));

  if (data && data.jwt) {
    return { Authorization: "Bearer " + data.jwt };
  } else {
    return {};
  }
}

export function fetchWithAuth(url, options, jsonContentType = true) {
  const headers = authHeader();
  const additionalHeaders = options ? options.headers : null;

  if (jsonContentType) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...additionalHeaders
    }
  });
}
