import { Api } from "fogito-core-ui";

export const offersUserStatus = (params) => {
  return Api.post("offersUserStatus", { data: params });
};

export const offersUserInfo = (params) => {
  return Api.post("offersUserInfo", { data: params });
};

export const offersUserSearch = (params) => {
  return Api.get("offersUserSearch", { data: params });
};
