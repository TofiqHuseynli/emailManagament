import React from "react";
import moment from "moment";
import Empty from "antd/lib/empty";
import {
  notesChangesDelete,
  notesChangesEdit,
  notesChangesAdd,
  notesChangesList,
} from "@actions";
import {
  App,
  Avatar,
  ErrorBoundary,
  Lang,
  Loading,
  Spinner,
  Textarea,
  useToast,
} from "fogito-core-ui";

export const NotesChanges = React.memo(({ permission, data: { id } }) => {
  const defaultParams = {
    title: "",
  };
  const toast = useToast();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      disabled: false,
      reply: false,
      data: [],
      editable: null,
      params: defaultParams,
      addLoading: false,
      editLoading: false,
      filesLength: 3,
      img: null,
      old_title: "",
      edit_title: "",
    }
  );

  const loadData = async () => {
    setState({ loading: true });
    let response = await notesChangesList({ offer_id: id });
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        setState({ data: response.data });
      } else {
        setState({ data: [] });
      }
    }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setState({ addLoading: true });
    if (!state.addLoading) {
      let response = await notesChangesAdd({
        ...state.params,
        offer_id: id,
      });
      setState({ addLoading: false });
      if (response?.status === "success") {
        setState({
          data: [
            ...[
              {
                ...response.data,
                permissions: { can_edit: true, can_delete: true },
              },
            ],
            ...state.data,
          ],
          params: defaultParams,
        });
      } else {
        toast.fire({ icon: "error", title: response?.description });
      }
    }
  };

  const onDelete = (id) =>
    toast
      .fire({
        position: "center",
        toast: false,
        timer: null,
        title: Lang.get("DeleteAlertTitle"),
        text: Lang.get("DeleteAlertDescription"),
        buttonsStyling: false,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonClass: "btn btn-success",
        cancelButtonClass: "btn btn-secondary",
        confirmButtonText: Lang.get("Confirm"),
        cancelButtonText: Lang.get("Cancel"),
      })
      .then(async (res) => {
        if (res?.value) {
          let response = await notesChangesDelete({ id });
          if (response?.status === "success") {
            setState({ data: state.data.filter((item) => item.id !== id) });
          } else {
            toast.fire({ icon: "error", title: response?.description });
          }
        }
      });

  const onUpdate = async (e, id) => {
    e.preventDefault();
    setState({ editLoading: true });
    if (!state.editLoading) {
      let response = await notesChangesEdit({
        id,
        title: state.edit_title,
      });
      if (response) {
        toast.fire({
          title: Lang.get(response.description),
          icon: response.status,
        });
        setState({ editLoading: false });
        if (response.status === "success") {
          setState({ edit_title: "", editable: null });
        }
      }
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <ErrorBoundary>
      <div className="position-relative">
        {state.loading && <Loading />}
        {permission && (
          <form className="flex-grow-1 mt-3" onSubmit={onCreate}>
            <label className="form-control-label">
              {Lang.get("NotesChanges")}
            </label>
            <Textarea
              rows="2"
              value={state.params.title}
              id="area"
              maxLength={1000}
              className="form-control"
              onChange={(e) =>
                setState({
                  params: { ...state.params, title: e.target.value },
                })
              }
              placeholder={Lang.get("WriteAComment")}
            />
            <span className="text-muted fs-12 mt-1">
              {Lang.get("MaxLength").replace(
                "{length}",
                1000 - state.params.title?.length
              )}
            </span>
            <div className="d-flex mt-3">
              <button
                disabled={!state.params?.title.length}
                className={`btn ${
                  !!state.params?.title.length ? "btn-primary" : "btn-secondary"
                } ml-auto px-5 py-2`}
              >
                {state.addLoading ? (
                  <Spinner color="#fff" style={{ width: 30 }} />
                ) : (
                  Lang.get("Write")
                )}
              </button>
            </div>
          </form>
        )}
        {state.data?.length ? (
          state.data?.map((item, key) => (
            <div className="d-flex flex-column" key={key}>
              <div className="d-flex align-items-center justify-content-between mt-2">
                <div className="d-flex align-items-center">
                  <Avatar user={item.creator} />
                  <p className="font-weight-bold mb-0 ml-2">
                    {item.creator?.fullname}
                  </p>
                </div>
                <span className="d-flex align-items-center ml-2 text-muted">
                  {moment(item.created_at * 1000).format("D")}{" "}
                  {Lang.get(
                    App.get("months_list")[
                      Number(moment(item.created_at * 1000).format("M")) - 1
                    ]
                  ).slice(0, 3)}
                  {`${
                    moment().format("YYYY") !==
                    moment(item.created_at * 1000).format("YYYY")
                      ? `, ${moment(item.created_at * 1000).format("YYYY")}`
                      : ""
                  }`}{" "}
                  - {moment(item.created_at * 1000).format("HH:mm")}
                </span>
              </div>
              {state.editable === item.id ? (
                <form onSubmit={(e) => onUpdate(e, item.id)}>
                  <div className="mt-2">
                    <Textarea
                      rows="2"
                      value={item.title}
                      id="area"
                      className="form-control"
                      onChange={(e) =>
                        setState({
                          edit_title: e.target.value,
                          data: state.data.map((row) => {
                            if (row.id === item.id) {
                              row.title = e.target.value;
                            }
                            return row;
                          }),
                        })
                      }
                    />
                    <div className="d-flex align-items-center">
                      <button
                        disabled={state.disabled}
                        className="btn btn-primary px-4 py-2 mt-2"
                      >
                        {state.editLoading ? (
                          <Spinner color="#fff" style={{ width: 30 }} />
                        ) : (
                          Lang.get("Save")
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary px-5 py-2 mt-2"
                        onClick={() => {
                          setState({
                            editable: null,
                            edit_title: state.old_title,
                            data: state.data.map((row) => {
                              if (row.id === item.id) {
                                row.title = state.old_title;
                              }
                              return row;
                            }),
                          });
                        }}
                      >
                        {Lang.get("Cancel")}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div
                  className="form-control d-inline-block w-auto h-auto mt-2"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  <div className="d-flex flex-column">{item.title}</div>
                </div>
              )}
              {state.editable === item.id ? null : (
                <div className="d-flex ml-auto ">
                  {item.permissions.can_edit && (
                    <button
                      className="btn btn-link text-underline text-muted p-1"
                      onClick={() =>
                        setState({ editable: item.id, old_title: item.title })
                      }
                    >
                      {Lang.get("Edit")}
                    </button>
                  )}
                  {item.permissions.can_delete && (
                    <button
                      className="btn btn-link text-underline text-muted p-1 "
                      onClick={() => onDelete(item.id)}
                    >
                      {Lang.get("Delete")}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <Empty description={Lang.get("NoData")} className="py-5" />
        )}
      </div>
    </ErrorBoundary>
  );
});
