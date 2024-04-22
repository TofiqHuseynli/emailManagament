import { Api } from "fogito-core-ui";

export const coreActivitiesList = async (params) => {
  return await Api.get("coreActivitiesList", { data: params });
};
