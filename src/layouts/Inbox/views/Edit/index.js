import React from "react";
import classNames from "classnames";
import { Link, Redirect, Route, Switch } from "react-router-dom";

import {
  changeStatus,
  offersCancelled,
  offersConvert,
  offersInfo,
  offersUserCancelled,
  offersUserStatus,
} from "@actions";
import Select from "react-select";
import { Activities, Info, View, NotesChanges } from "./Components";
import {
  ErrorBoundary,
  Lang,
  Popup,
  Spinner,
  Tabs,
  Textarea,
  useModal,
  useToast,
} from "fogito-core-ui";
import { GeneralSkeleton } from "../../../GeneralSkeleton";
import { createPortal } from "react-dom";
export const Edit = React.memo(
  ({
    type,
    onClose,
    reload,
    match: {
      params: { id },
      url,
    },
    history,
    location,
  }) => {
    const toast = useToast();
    const modal = useModal();
    let ifUser = history.location.pathname.split("/")[1] === "offer";
    const [state, setState] = React.useReducer(
      (prevState, newState) => ({ ...prevState, ...newState }),
      {
        status: 0,
        hash: "",
        reload_state: false,
        cancelled_reasons: [],
        cancelled_reason: null,
        can_accept_or_cancel: false,
        cancelled_description: "",
      }
    );
    const [loading, setLoading] = React.useState(true);
    const [permissions, setPermissions] = React.useState(null);

    const canEdit = () => {
      return permissions?.can_edit;
    };

    const loadCancelledReasons = async () => {
      let response = null;
      if (ifUser) {
        response = await offersUserCancelled({ id });
      } else {
        response = await offersCancelled({ id });
      }
      if (response?.status === "success") {
        setState({
          cancelled_reasons: response.cancelled_reasons
            ?.map((item) => ({
              value: item.id,
              label: item.value,
            }))
            .concat([{ value: 0, label: Lang.get("Other") }]),
        });
      }
    };

    const convertToInvoice = async () => {
      if (!state.loadingInvoice) {
        toast
          .fire({
            position: "center",
            toast: false,
            timer: null,
            title: Lang.get("InvoiceAlertTitle"),
            text: Lang.get("InvoiceAlertDescription"),
            buttonsStyling: false,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-secondary",
            confirmButtonText: Lang.get("SendInvoice"),
            cancelButtonText: Lang.get("EditInvoice"),
          })
          .then((result) => {
            if (result.isConfirmed) {
              sendInvoice();
            } else if (result.isDismissed) {
              if (result.dismiss !== "backdrop") {
                setState({ loadingInvoice: true });
                sendInvoice(true);
              }
            }
          });
      }
    };

    React.useEffect(() => {
      reLoadInvoiceStatus();
      const interval = setInterval(() => {
        reLoadInvoiceStatus();
      }, 1000 * 3);
      return () => clearInterval(interval);
    }, [state.invoice]);

    const reLoadInvoiceStatus = async () => {
      if (state.invoice === 1) {
        let response = await offersInfo({ data: { id, invoice: true } });
        if (response) {
          setState({
            invoice: response.data?.invoice,
            invoice_data: response.data?.invoice_data,
            invoice_error: response.data?.invoice_error,
            can_edit: false,
          });
        }
      }
    };

    const sendInvoice = async (draft) => {
      setState({ loadingInvoice: true });
      if (!state.loadingInvoice) {
        let response = await offersConvert({
          id,
          ...(draft && { draft: true }),
        });
        if (response) {
          setState({ loadingInvoice: false });
          toast.fire({
            icon: response.status,
            title: response.description,
          });
          if (response.status === "success") {
            setState({ invoice: 1 });
          }
        }
      }
    };

    const onStatusChange = async (status) => {
      let response = null;
      if (ifUser) {
        response = await offersUserStatus({
          id,
          status,
          ...(ifUser && { hash: state.hash }),
        });
      } else {
        response = await changeStatus({
          id,
          status,
          ...(ifUser && { hash: state.hash }),
        });
      }
      if (response.status === "success") {
        setState({ status: status, reload_state: true });
        !ifUser && reload();
        loadData("noload");
        toast.fire({
          title: response.description,
          icon: "success",
        });
      } else {
        toast.fire({
          title: response.description,
          icon: "error",
        });
      }
    };

    const renderInvoiceButton = () => {
      switch (state.invoice) {
        case 0:
          return (
            <button
              className="dropdown-item d-flex"
              onClick={() => convertToInvoice()}
            >
              {Lang.get("ConvertToInvoice")}
              {state.loadingInvoice && (
                <Spinner color="#4388b9" className="ml-2" />
              )}
            </button>
          );
        case 1:
          return (
            <button disabled={true} className="dropdown-item">
              {Lang.get("SendingInvoice")}
            </button>
          );
        case 2:
          return (
            <button
              className="dropdown-item d-flex"
              onClick={() =>
                window.open(
                  `/accounting/invoices/invoice/${state.invoice_data?.id}`
                )
              }
            >
              {Lang.get("GetInvoice")}
              {state.loadingInvoice && (
                <Spinner color="#4388b9" className="ml-2" />
              )}
            </button>
          );
        case 3:
          return (
            <button className="dropdown-item text-danger" disabled>
              {Lang.get(state.invoice_error)}
            </button>
          );
      }
    };

    const loadData = async (type = "load") => {
      if (type === "load") setLoading(true);
      let response = null;
      response = await offersInfo({ data: { id, permission: true } });
      if (response) {
        setLoading(false);
        if (response.status === "success") {
          setPermissions(response.data.permissions);
          setState({
            status: response.data.permissions.status,
            hash: response.data.permissions.hash,
            invoice: response.data.permissions?.invoice,
            can_accept_or_cancel:
              response.data?.permissions?.can_accept_or_cancel,
            invoice_data: response.data.permissions?.invoice_data,
            invoice_error: response.data.permissions?.invoice_error,
            convert_invoice: response.data?.permissions?.convert_invoice,
          });
        }
      }
    };

    const onSubmitCancel = async (e) => {
      e.preventDefault();
      setState({ cancel_modal_loading: true });
      if (!state.cancel_modal_loading) {
        let response = null;
        if (ifUser) {
          response = await offersUserStatus({
            id,
            status: 4,
            ...(ifUser && { hash: state.hash }),
            cancelled_reason: state.cancelled_reason?.value || null,
            cancelled_description: state.cancelled_description,
          });
        } else {
          response = await changeStatus({
            id,
            status: 4,
            ...(ifUser && { hash: state.hash }),
            cancelled_reason: state.cancelled_reason?.value || null,
            cancelled_description: state.cancelled_description,
          });
        }
        if (response) {
          setState({ cancel_modal_loading: false });
          if (response.status === "success") {
            modal.hide("cancel_modal");
            setState({ status: 4, reload_state: true });
            !ifUser && reload();
            loadData("noload");
            toast.fire({
              title: response.description,
              icon: "success",
            });
          } else {
            toast.fire({
              title: response.description,
              icon: "error",
            });
          }
        }
      }
    };

    React.useEffect(() => {
      loadData();
    }, []);

    React.useEffect(() => {
      modal.modals.includes("cancel_modal") && loadCancelledReasons();
    }, [modal.modals.includes("cancel_modal")]);

    return (
      <ErrorBoundary>
        {/* Modals */}
        <Popup
          title={Lang.get("Cancel")}
          size="md"
          show={modal.modals.includes("cancel_modal")}
          onClose={() => modal.hide("cancel_modal")}
        >
          <form id="info-form" onSubmit={onSubmitCancel}>
            <div className="form-group">
              <label className="form-control-label">{Lang.get("Reason")}</label>
              <Select
                isClearable
                value={state.cancelled_reason}
                onChange={(cancelled_reason) => {
                  setState({ cancelled_reason });
                  if (
                    cancelled_reason?.value !== 0 ||
                    cancelled_reason === null
                  ) {
                    setState({ cancelled_description: "" });
                  }
                }}
                options={state.cancelled_reasons}
                placeholder={Lang.get("Type")}
                className="form-control"
              />
            </div>
            {state.cancelled_reason?.value === 0 && (
              <div className="form-group">
                <label className="form-control-label">
                  {Lang.get("Description")}
                </label>
                <Textarea
                  rows="3"
                  maxLength="300"
                  id="title"
                  value={state.cancelled_description}
                  onChange={(e) =>
                    setState({ cancelled_description: e.target.value })
                  }
                  placeholder={Lang.get("Description")}
                  className="form-control"
                />
              </div>
            )}
            <button
              className="btn btn-block btn-success w-100"
              disabled={
                state.cancelled_reason?.value === 0 &&
                !state.cancelled_description
              }
            >
              {state.cancel_modal_loading ? <Spinner /> : Lang.get("Send")}
            </button>
          </form>
        </Popup>
        <Popup size="xl" show onClose={onClose}>
          {loading ? (
            <GeneralSkeleton />
          ) : (
            <Tabs
              type="popup"
              items={[
                {
                  title: "Edit",
                  component: (
                    <Info
                      permission={canEdit}
                      type={type}
                      data={{ id }}
                      reload={reload}
                    />
                  ),
                },
                {         
                  title: "View",
                  component: (
                    <View
                      type={type}
                      data={{ id }}
                      reload={reload}
                      reload_state={state.reload_state}
                    />
                  ),
                },
                {
                  title: "ModifiedParts",
                  component: (
                    <NotesChanges
                      permission={permissions?.notes_changes}
                      type={type}
                      data={{ id }}
                      reload={reload}
                    />
                  ),
                },
                {
                
                  title: "Activities",
                  component: (
                    <Activities pageType={type} data={{ id }} reload={reload} />
                  ),
                },
              ]}
            />
          )}

          <React.Fragment>
            <button
              style={{ position: "absolute", top: 0, right: "4px" }}
              className="btn-tab-header"
              id="actions"
              data-toggle="dropdown"
            >
              <span>{Lang.get("Actions")}</span>
              <i className="feather feather-chevron-down ml-2 fs-16" />
            </button>
            <div className="dropdown-menu" aria-labelledby="actions">
              {state.can_accept_or_cancel && (
                <React.Fragment>
                  {state.status !== 2 && state.status !== 4 && (
                    <React.Fragment>
                      <React.Fragment>
                        <button
                          className="dropdown-item"
                          onClick={() => onStatusChange(2)}
                        >
                          {Lang.get("Accept")}
                        </button>
                      </React.Fragment>
                      <React.Fragment>
                        <button
                          className="dropdown-item"
                          onClick={() => modal.show("cancel_modal")}
                        >
                          {Lang.get("Cancel")}
                        </button>
                      </React.Fragment>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {state.invoice !== 3 && renderInvoiceButton()}
              <Link
                className="dropdown-item"
                target="_blank"
                to={`/offer?id=${id}&hash=${state.hash}`}
              >
                {Lang.get("GetLink")}
              </Link>
            </div>
          </React.Fragment>
        </Popup>
      </ErrorBoundary>
    );
  }
);
