import { Api } from "fogito-core-ui";

export const notesChangesList = (params) => {
  return Api.get("notesChangesList", { data: params });
};

export const notesChangesAdd = (params) => {
  return Api.post("notesChangesAdd", { data: params });
};

export const notesChangesEdit = (params) => {
  return Api.post("notesChangesEdit", { data: params });
};

export const notesChangesDelete = (params) => {
  return Api.post("notesChangesDelete", { data: params });
};
