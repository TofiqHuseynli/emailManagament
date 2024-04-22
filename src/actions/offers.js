import { Api } from "fogito-core-ui";

export const offersList = (params) => {
  return Api.post("offersList", { data: params });
};

export const offersAdd = (params) => {
  return Api.post("offersAdd", params);
};

export const offersParams = (params) => {
  return Api.post("offersParams", params);
};

export const offersDelete = (params) => {
  return Api.post("offersDelete", params);
};

export const offersInfo = (params) => {
  return Api.post("offersInfo", params);
};

export const offersEdit = (params) => {
  return Api.post("offersEdit", params);
};

export const offersResend = (params) => {
  return Api.post("offersResend", params);
};

export const changeStatus = (params) => {
  return Api.post("changeStatus", { data: params });
};

export const offersLogs = (params) => {
  return Api.get("offersLogs", { data: params });
};

export const offersCancelled = (params) => {
  return Api.get("offersCancelled", { data: params });
};

export const offersUserCancelled = (params) => {
  return Api.get("offersUserCancelled", { data: params });
};

export const changeListStatus = (params) => {
  return Api.post("changeListStatus", { data: params });
};

export const offersConvert = (params) => {
  return Api.post("offersConvert", { data: params });
};

export const paymentSettingsminList = (params) => {
  return Api.get("paymentSettingsminList", { data: params });
};

export const currencyminList = (params) => {
  return Api.get("currencyminList", { data: params });
};

export const timezoneminList = (params) => {
  return Api.get("timezoneminList", { data: params });
};

export const termsminList = (params) => {
  return Api.get("termsminList", { data: params });
};

export const templatesminList = (params) => {
  return Api.get("templatesminList", { data: params });
};

export const taxRatesList = (params) => {
  return Api.get("taxRatesList", { data: params });
};
