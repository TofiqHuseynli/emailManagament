import { Api } from "fogito-core-ui";

export const usersList = (params) => {
  return Api.post("usersList", { data: params });
};
