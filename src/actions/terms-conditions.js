import { Api } from "fogito-core-ui";

export const termsList = (params) => {
  return Api.post("termsList", { data: params });
};

export const termsAdd = (params) => {
  return Api.post("termsAdd", params);
};

export const termsDelete = (params) => {
  return Api.post("termsDelete", params);
};

export const termsInfo = (params) => {
  return Api.post("termsInfo", params);
};

export const termsEdit = (params) => {
  return Api.post("termsEdit", params);
};
