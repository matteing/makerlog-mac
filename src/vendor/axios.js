import axios from "axios";
import appConfig from "~/config";

class AxiosError extends Error {
  constructor(message, status_code = false, field_errors = null) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }

    this.status_code = status_code;
    this.field_errors = field_errors;
  }
}

function prettyAxiosError(error) {
  if (error.response) {
    if (error.response.data["non_field_errors"]) {
      throw new AxiosError(
        error.response.data["non_field_errors"],
        error.response.status
      );
    }
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 500) {
      throw new AxiosError(
        "Cowork is down. Please try again later.",
        error.response.status
      );
    }

    if (error.response.status === 404) {
      throw new AxiosError("Not found.", error.response.status);
    }

    if (error.response.status === 403) {
      throw new AxiosError(
        "You don't have permission to do this.",
        error.response.status
      );
    }

    if (
      error.response.status === 400 &&
      typeof error.response.data === "object" &&
      !(error.response.data instanceof Array) &&
      Object.keys(error.response.data).length > 0
    ) {
      console.log(error.response.data);
      throw new AxiosError(
        "Please fill or correct the following fields to continue.",
        error.response.status,
        error.response.data
      );
    } else if (
      error.response.status === 400 &&
      error.response.data.length === 1
    ) {
      throw new AxiosError(error.response.data[0], error.response.status);
    }

    throw new AxiosError(
      "An error occurred sending this request. Try again later.",
      error.response.status
    );
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    if (!navigator.onLine) {
      throw new Error("No internet connection found. Try again later.");
    } else if (error.message.includes("413")) {
      throw new AxiosError("This file is too large!");
    } else {
      throw new Error(
        "Oh no! Cowork seems to be down. Please try again later."
      );
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error("Unknown error. Try again later.");
  }
}

function errorArray(obj) {
  if (!!obj && obj.constructor === Array) {
    return obj;
  } else {
    return [obj];
  }
}

export function errorState(state, e, key = "errorMessages") {
  let messages = null;
  if (e.field_errors) {
    messages = e.field_errors;
  } else if (e.message) messages = e.message;

  return { ...state, errorMessages: messages };
}

export { prettyAxiosError, errorArray };

export async function axiosWrapper(fn, ...args) {
  try {
    return await fn(...args);
  } catch (e) {
    console.log(`Axios: ${e.message}`);
    prettyAxiosError(e);
  }
}

export default axios.create({
  baseURL: appConfig.API_URL
});
