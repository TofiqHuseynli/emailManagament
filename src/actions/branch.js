import { Api } from "fogito-core-ui";

export const branchesList = (params) => {
  return Api.get("branchesList", { data: params });
};

export const branchesAdd = (params) => {
  return Api.post("branchesAdd", { data: params });
};

export const branchesDelete = (params) => {
  return Api.post("branchesDelete", { data: params });
};
