import { Component } from "react";
import axios, { axiosWrapper, prettyAxiosError } from "~/vendor/axios";

export async function getToken(username, password) {
  try {
    const payload = { username: username, password: password };
    const response = await axios.post("/api-token-auth/", payload);
    return response.data["token"];
  } catch (e) {
    // return a pretty error
    prettyAxiosError(e);
  }
}

export async function updateUser(payload) {
  let form = new FormData();
  const headers = {
    "Content-Type": "multipart/form-data"
  };
  Object.keys(payload).forEach(function(key) {
    form.append(key, payload[key]);
  });
  const { data } = await axiosWrapper(axios.patch, `/me/`, form, {
    headers
  });
  return data;
}

export async function makeUser(payload) {
  const response = await axiosWrapper(
    axios.post,
    "/accounts/register/",
    payload
  );
  return response.data["token"];
}

export async function setTimezone(tz) {
  try {
    await axiosWrapper(axios.post, "/me/set_timezone/", {
      timezone: tz
    });
    console.log(`Set timezone to ${tz}.`);
  } catch (e) {
    console.log(`Failed to set timezone (${tz}).`);
  }
}

export async function activateAccount(uid, token) {
  const response = await axiosWrapper(
    axios.get,
    `/accounts/activate/${uid}/${token}/`
  );
  return response.data["token"];
}

export async function getUser() {
  const endpoint = "/me/";
  const { data } = await axios.get(endpoint);
  return data;
}
