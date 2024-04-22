import { config } from "@config";
import { Api, getTimeBySeconds } from "fogito-core-ui";

const getFromStorage = async (key, url, expire_time, params) => {
  let response = JSON.parse(window.localStorage.getItem(key) || false);
  if (response) {
    if (response.status === "success") {
      if (response.create_time < getTimeBySeconds() - expire_time * 60) {
        return await getFromAPI(key, url, params);
      }
      return response;
    } else {
      return await getFromAPI(key, url, params);
    }
  }
  return await getFromAPI(key, url, params);
};

const getFromAPI = async (key, url, params) => {
  let response = await Api.get(url, params);
  if (response.status === "success") {
    response.create_time = getTimeBySeconds();
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, JSON.stringify(response));
  }
  return response;
};

export const clearStorage = () => {
  window.localStorage.removeItem(`settings-${config.appID}`);
  window.localStorage.removeItem(`translations-${config.appID}`);
};

export const settings = async (params) => {
  return await getFromStorage(
    `settings-${config.appID}`,
    "settings",
    2,
    params
  );
};

export const translations = async (params) => {
  return await getFromStorage(
    `translations-${config.appID}`,
    "translations",
    60,
    params
  );
};
