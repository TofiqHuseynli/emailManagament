import { Api } from "fogito-core-ui";

export const InvoiceSettings = (params) => {
  return Api.get("InvoiceSettings", { data: params });
};
