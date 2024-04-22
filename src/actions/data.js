import { Api } from "fogito-core-ui";;

export const coreTimezonesList = (params) => {
  return Api.post("coreTimezonesList", { data: params });
};
