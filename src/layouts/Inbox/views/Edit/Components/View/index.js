import React from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import moment from "moment";
import {
  changeStatus,
  currencyminList,
  offersCancelled,
  offersUserCancelled,
  offersInfo,
  offersUserInfo,
  offersUserStatus,
  calculateDiscount,
} from "@actions";
import Popup from "fogito-core-ui/build/components/common/Popup";
import Select from "react-select";
import Textarea from "fogito-core-ui/build/components/form/Textarea";
import Spinner from "fogito-core-ui/build/components/common/Spinner";
import {
  App,
  Avatar,
  ErrorBoundary,
  Lang,
  Loading,
  useModal,
  useToast,
} from "fogito-core-ui";

export const View = ({
  data,
  reload,
  tabPermissions = () => {},
  reload_state,
}) => {
  const toast = useToast();
  const history = useHistory();
  const modal = useModal();
  const { months_list } = App.getData();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      data: [],
      status: null,
      invoice: 0,
      loadingInvoice: false,
      cancel_modal_loading: false,
      items: [],
      fines: [],
      currency_list: [],
      terms_description: "",
      can_edit: false,
      convert_invoice: false,
      invoice_data: null,
      myDefaultCurrency: null,
      invoice_error: "",

      cancelled_reasons: [],
      cancelled_reason: "",
      cancelled_description: "",

      // total
      totalExTax: 0,
      totalIncTax: 0,
      totalTax: 0,
      totalToPay: 0,
      totalDiscount: 0,
    }
  );
  let params = new URLSearchParams(location.search);
  let id = params.get("id") || data.id;
  let hash = params.get("hash");
  let ifUser = history.location.pathname.split("/")[1] === "offer";

  const loadData = async () => {
    setState({ loading: true });
    let response = null;
    if (ifUser) {
      response = await offersUserInfo({ id, hash });
    } else {
      response = await offersInfo({ data: { id } });
    }
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        setState({
          data: response.data,
          items: response.data?.items_list,
          fines: response.data?.fines_list,
          status: response.data?.status,
          invoice: response.data?.invoice,
          terms_description: response.data?.terms_conditions_description,
          can_edit: response.data?.permissions?.can_edit,
          can_accept_or_cancel:
            response.data?.permissions?.can_accept_or_cancel,
          invoice_data: response.data?.invoice_error,
          invoice_error: response.data?.invoice_error,
          convert_invoice: response.data?.permissions?.convert_invoice,
          myDefaultCurrency: response.data?.currency_data,
        });
        if (ifUser) {
          setState({ currency_list: response.data?.currency });
        }
      } else {
        toast.fire({
          title: Lang.get(response.description),
          icon: "error",
        });
      }
    }
  };

  const loadCurrency = async () => {
    let response = await currencyminList({
      skip: 0,
      limit: 20,
      names: ["currencies"],
    });
    if (response?.status === "success") {
      setState({ currency_list: response.currency.currencies });
    }
  };

  const getTotalExcludedVat = () => {
    let TotalExcludedVat = 0;
    for (let item of state.items) {
      let total = parseFloat(item.price) * parseInt(item.quantity);
      TotalExcludedVat += total;
    }
    if (TotalExcludedVat.toString().split(".").length < 2) {
      return TotalExcludedVat;
    } else {
      return TotalExcludedVat.toFixed(2);
    }
  };

  const getTotalVatAmount = () => {
    let TotalVatAmount = 0;
    for (let item of state.items) {
      let total = item.tax;
      TotalVatAmount += parseFloat(total);
    }
    if (TotalVatAmount.toString().split(".").length < 2) {
      return TotalVatAmount || 0;
    } else {
      return TotalVatAmount?.toFixed(2) || 0;
    }
  };

  const TotalIncludedVAT = () => {
    let TotalIncludedVAT = 0;
    const newArrByItems = state.items.map((item) => {
      return {
        ...item,
        total_count: item.total,
        percentage: 0,
      };
    });
    const newArrByFines = state.fines.map((fine) => {
      return {
        ...fine,
        total_count: fine.total,
        percentage: 0,
      };
    });
    const newArr = newArrByItems.concat(newArrByFines);

    for (let item of newArr) {
      TotalIncludedVAT += parseFloat(item.total);
    }
    if (TotalIncludedVAT.toString().split(".")?.length < 2) {
      params.total_to_pay = TotalIncludedVAT - getTotalDiscount() || 0;
      return TotalIncludedVAT - getTotalDiscount() || 0;
    } else {
      params.total_to_pay =
        TotalIncludedVAT.toFixed(2) - getTotalDiscount() || 0;
      return TotalIncludedVAT.toFixed(2) - getTotalDiscount() || 0;
    }
  };

  const getTotalDiscount = () => {
    let TotalDiscount = 0;
    const newArrByItems =
      state.data?.items_list?.map((item) => {
        return {
          ...item,
          total_count: item.total,
          percentage: 0,
        };
      }) || [];
    const newArrByFines =
      state.data?.fines_list?.map((fine) => {
        return {
          ...fine,
          total_count: fine.total,
          percentage: 0,
        };
      }) || [];
    const newArr = newArrByItems?.concat(newArrByFines);
    for (let item of newArr) {
      let total = 0;
      if (item.discount_type?.value === "percentage")
        total = (item.total_count * item.discount_value) / 100;
      if (item.discount_type?.value === "currency") total = item.discount_value;
      TotalDiscount += total;
    }

    if (TotalDiscount.toString().split(".")?.length < 2) {
      return TotalDiscount || 0;
    } else {
      return TotalDiscount.toFixed(2) || 0;
    }
  };

  const onStatusChange = async (status) => {
    let response = null;
    if (ifUser) {
      response = await offersUserStatus({
        id,
        status,
        ...(ifUser && { hash }),
      });
    } else {
      response = await changeStatus({ id, status, ...(ifUser && { hash }) });
    }
    if (response.status === "success") {
      setState({ status: status });
      reload();
      tabPermissions("noload");
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

  const onSubmitCancel = async (e) => {
    e.preventDefault();
    setState({ cancel_modal_loading: true });
    if (!state.cancel_modal_loading) {
      let response = null;
      if (ifUser) {
        response = await offersUserStatus({
          id,
          status: 4,
          ...(ifUser && { hash }),
          cancelled_reason: state.cancelled_reason?.value || null,
          cancelled_description: state.cancelled_description,
        });
      } else {
        response = await changeStatus({
          id,
          status: 4,
          ...(ifUser && { hash }),
          cancelled_reason: state.cancelled_reason?.value || null,
          cancelled_description: state.cancelled_description,
        });
      }
      if (response) {
        setState({ cancel_modal_loading: false });
        if (response.status === "success") {
          modal.hide("cancel_modal");
          setState({ status: 4 });
          !ifUser && reload();
          loadData();
          tabPermissions("noload");
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

  const getTotalInclTax = () => {
    let TotalDiscount = 0;

    for (let item of state.items) {
      TotalDiscount += item.total;
    }

    if (TotalDiscount.toString().split(".")?.length < 2) {
      return TotalDiscount || 0;
    } else {
      return TotalDiscount.toFixed(2) || 0;
    }
  };

  React.useEffect(() => {
    if (!ifUser) {
      loadCurrency();
    }
  }, []);

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

  const calculateTotals = (items, fines) => {
    let totalExTax = 0;
    let totalIncTax = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    let totalToPay = 0;

    if (items?.length) {
      items.map((row) => {
        totalExTax += parseFloat(row.price * row.quantity);
        totalIncTax += parseFloat(row.total);
        totalTax += parseFloat(row.tax);
        totalToPay += parseFloat(row.total);
        totalDiscount += calculateDiscount(row);
      });
    }

    if (fines.length) {
      fines.map((fine) => {
        let currDiss = calculateDiscount(fine);
        totalDiscount += currDiss;
        totalToPay += parseFloat(fine.price) - currDiss;
      });
    }

    setState({
      totalExTax: parseFloat(totalExTax).toFixed(2),
      totalIncTax: parseFloat(totalIncTax).toFixed(2),
      totalTax: parseFloat(totalTax).toFixed(2),
      totalToPay: parseFloat(totalToPay).toFixed(2),
      totalDiscount: parseFloat(totalDiscount).toFixed(2),
    });
  };

  React.useEffect(() => {
    calculateTotals(state.items, state.fines);
  }, [JSON.stringify(state.items), JSON.stringify(state.items)]);

  React.useEffect(() => {
    loadData();
  }, [reload_state]);

  React.useEffect(() => {
    modal.modals.includes("cancel_modal") && loadCancelledReasons();
  }, [modal.modals.includes("cancel_modal")]);

  let date = new Date(state.data?.date?.date);
  let expires_date = new Date(state.data?.expires_date?.date);
  let get_start_month = date.getMonth() || 0;
  let get_end_month = expires_date.getMonth() || 0;

  let symbol = state.myDefaultCurrency;

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
      {/* Modal */}
      {!ifUser ? (
        renderView({
          state,
          symbol,
          months_list,
          date,
          get_start_month,
          expires_date,
          get_end_month,
          ifUser,
          getTotalInclTax,
          getTotalDiscount,
          getTotalExcludedVat,
          getTotalVatAmount,
          TotalIncludedVAT,
        })
      ) : (
        <div style={{ paddingTop: "1rem" }}>
          <div className="offer pb-4 pt-3 px-2">
            <div
              className={classNames("offer_view", {
                bottom: state.data.cancelled_by,
                accept_or_cancel: !(state.status !== 2 && state.status !== 4),
              })}
            >
              <div className="d-flex flex-column pb-4 px-2">
                {renderView({
                  state,
                  symbol,
                  months_list,
                  date,
                  get_start_month,
                  expires_date,
                  get_end_month,
                  ifUser,
                  getTotalInclTax,
                  getTotalDiscount,
                  getTotalExcludedVat,
                  getTotalVatAmount,
                  TotalIncludedVAT,
                })}
              </div>
              <div className="d-flex flex-column">
                {!!state.data.notes_data?.length && (
                  <React.Fragment>
                    <div
                      className="w-100 my-4"
                      style={{ borderBottom: "1px solid #80818326" }}
                    />
                    {/*NotesData*/}
                    <div className="core-collapsing-list">
                      <h3 className="fs-16 mb-0 ml-2">
                        {Lang.get("NotesChanges")}
                      </h3>
                      {state.data.notes_data?.map((section, key) => (
                        <div className="item" key={key}>
                          <div className="head">
                            <button
                              data-toggle="collapse"
                              data-target={`#collapse_${section.id}`}
                              className="d-flex align-items-center border-0 rounded-0 w-100 px-3 py-2"
                            >
                              <i className="feather feather-chevron-right mr-3" />
                              <h3 className="mb-0 fs-14">
                                <span className="d-flex align-items-center">
                                  {moment(section.created_at * 1000).format(
                                    "D"
                                  )}{" "}
                                  {Lang.get(
                                    App.get("months_list")[
                                      Number(
                                        moment(
                                          section.created_at * 1000
                                        ).format("M")
                                      ) - 1
                                    ]
                                  ).slice(0, 3)}
                                  {`${
                                    moment().format("YYYY") !==
                                    moment(section.created_at * 1000).format(
                                      "YYYY"
                                    )
                                      ? `, ${moment(
                                          section.created_at * 1000
                                        ).format("YYYY")}`
                                      : ""
                                  }`}{" "}
                                  -{" "}
                                  {moment(section.created_at * 1000).format(
                                    "HH:mm"
                                  )}
                                </span>
                              </h3>
                            </button>
                          </div>
                          <div
                            id={`collapse_${section.id}`}
                            className="content collapse"
                          >
                            <div className="d-flex flex-column ml-5 py-2">
                              <div className="d-flex flex-row">
                                <Avatar user={section.creator} />
                                <p className="font-weight-bold mb-0 ml-2">
                                  {section.creator?.fullname}
                                </p>
                              </div>
                              <p
                                className="d-flex mb-0"
                                style={{ marginLeft: "45px" }}
                              >
                                {" "}
                                {section.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className="w-100 my-4"
                      style={{ borderBottom: "1px solid #80818326" }}
                    />
                  </React.Fragment>
                )}
              </div>
            </div>
            {state.can_accept_or_cancel && (
              <React.Fragment>
                {state.status !== 2 && state.status !== 4 && (
                  <div className="mt-3">
                    <div className="w-100">
                      <div className="d-flex">
                        <button
                          className="btn btn-primary col-md fw-500"
                          onClick={() => onStatusChange(2)}
                        >
                          {Lang.get("Accept")}
                        </button>
                        <button
                          className="btn btn-danger col-md fw-500"
                          onClick={() => modal.show("cancel_modal")}
                        >
                          {Lang.get("Cancel")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

const renderView = ({
  state,
  symbol,
  months_list,
  date,
  get_start_month,
  expires_date,
  get_end_month,
  ifUser,
  getTotalInclTax,
  getTotalDiscount,
  getTotalExcludedVat,
  getTotalVatAmount,
  TotalIncludedVAT,
}) => {
  return (
    <div
      className={classNames("position-relative", {
        "py-3 ": !ifUser,
        "pb-3": ifUser,
      })}
    >
      {state.loading && <Loading />}
      <div className="row">
        <div className="col-12">
          {state.data.cancelled_by && (
            <div className="alert alert-warning d-flex align-items-center mt-3">
              <i className="feather feather-alert-triangle text-warning fs-42 mr-3" />
              <div className="d-flex flex-column">
                <span className="fs-14">
                  <b>{Lang.get("CancelledBy")}:</b>{" "}
                  {state.data.cancelled_by.user === ""
                    ? Lang.get(state.data.cancelled_by.type)
                    : state.data.cancelled_by.user?.fullname}
                </span>
                {state.data.cancelled_reason ? (
                  <span className="text-purple fs-13">
                    <b>{Lang.get("ReasonForCancellation")}: </b>
                    {state.data.cancelled_reason?.title}
                  </span>
                ) : (
                  <span className="text-purple fs-13">
                    <b>{Lang.get("ReasonForCancellation")}: </b>
                    {state.data.cancelled_description}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="col-12">
          <div className="py-3 poppins">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <img
                  src={state.data.company_data?.avatars?.small}
                  alt=""
                  width={80}
                />
              </div>
              <div className="text-uppercase dm-serif-display fs-40">
                {Lang.get("Offer")} #{state.data?.offer_number || 0}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="d-flex flex-column">
                <span className="text-muted fs-14">{Lang.get("Name")}</span>
                <div className="fs-16 fw-500">
                  {state.data.user_data?.fullname || Lang.get("None")}
                </div>
                <span className="text-muted fs-14 mt-2">
                  {Lang.get("Address")}
                </span>
                <div className="fs-16 fw-500">
                  {state.data.user_data?.address || Lang.get("None")}
                </div>
                <span className="text-muted fs-14 mt-2">{Lang.get("Cvr")}</span>
                <div className="fs-16 fw-500">
                  {state.data.user_data?.cvr || Lang.get("None")}
                </div>
                <span className="text-muted fs-14 mt-2">
                  {Lang.get("Phone")}
                </span>
                <div className="fs-16 fw-500">
                  {state.data.user_data?.phone || Lang.get("None")}
                </div>
                <span className="text-muted fs-14 mt-2">
                  {Lang.get("Email")}
                </span>
                <div className="fs-16 fw-500">
                  {state.data.user_data?.email || Lang.get("None")}
                </div>
              </div>
            </div>
            {state.status === 2 ? (
              <div className="col-md-4 d-flex justify-content-center align-items-start">
                <img
                  width={170}
                  height={120}
                  src={`${process.env.publicPath}/assets/img/accepted.png`}
                  alt="Accepted"
                />
              </div>
            ) : (
              <div className="col-md-4"></div>
            )}
            <div className="col-md-4">
              <div className="d-flex flex-column align-items-end">
                <span className="text-muted fs-14">
                  {Lang.get("CompanyName")}
                </span>
                <div className="fs-16 fw-500">
                  {state.data.company_data?.title || Lang.get("None")}
                </div>
                <span className="text-muted fs-14 mt-2">
                  {Lang.get("Address")}
                </span>
                <div className="fs-16 fw-500">
                  {state.data.company_data?.address || Lang.get("None")}
                </div>
                <span className="text-muted fs-14 mt-2">{Lang.get("Cvr")}</span>
                <div className="fs-16 fw-500">
                  {state.data.company_data?.cvr || Lang.get("None")}
                </div>
                <span className="text-muted fs-14 mt-2">
                  {state.data.company_data?.phones?.length > 1
                    ? Lang.get("PhoneNumbers")
                    : Lang.get("PhoneNumber")}
                </span>
                <div className="fs-16 fw-500 d-flex flex-column">
                  {state.data.company_data?.phones?.length
                    ? state.data.company_data?.phones.map((phone, i) => (
                        <span
                          key={i}
                          className="d-flex text-nowrap justify-content-end"
                        >
                          {phone}
                          {state.data.company_data?.phones?.length > 1 ? (
                            <> &#x2022;</>
                          ) : (
                            ""
                          )}
                        </span>
                      ))
                    : Lang.get("None")}
                </div>
                <span className="text-muted fs-14 mt-2">
                  {state.data.company_data?.emails?.length > 1
                    ? Lang.get("Emails")
                    : Lang.get("Email")}
                </span>
                <div className="fs-16 fw-500 d-flex flex-column">
                  {state.data.company_data?.emails?.length
                    ? state.data.company_data?.emails.map((phone, i) => (
                        <span
                          key={i}
                          className="d-flex text-nowrap justify-content-end"
                        >
                          {phone}
                          {state.data.company_data?.emails?.length > 1 ? (
                            <> &#x2022;</>
                          ) : (
                            ""
                          )}
                        </span>
                      ))
                    : Lang.get("None")}
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="col-md-12">
              <div className="view-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th colSpan="1" className="fs-30">
                        {Lang.get("OFFER")}
                      </th>
                      <th colSpan="2" className="text-nowrap">
                        {Lang.get("OfferNumber")}:<br />
                        {state.data.offer_number}
                      </th>
                      <React.Fragment>
                        <th colSpan="2" className="text-nowrap">
                          {Lang.get("SentDate")}: <br />
                          {!!state.data?.date &&
                            `${date?.getDate()}
                        ${months_list[get_start_month].slice(0, 3)}
                        ${date?.getFullYear()} ${state.data?.date?.time}
                     `}
                        </th>
                        <th colSpan="2" className="text-nowrap">
                          {Lang.get("ExpirationDate")}: <br />
                          {!!state.data?.expires_date?.date &&
                            `${expires_date?.getDate()}
                       ${months_list[get_end_month].slice(0, 3)}
                       ${expires_date?.getFullYear()} ${
                              state.data?.expires_date?.time
                            }
                       `}
                        </th>
                      </React.Fragment>
                    </tr>
                    <tr>
                      <th colSpan="1" className="row_title">
                        {Lang.get("Title")}
                      </th>
                      <th colSpan="2">{Lang.get("Price")}</th>
                      <th colSpan="2">{Lang.get("Quantity")}</th>
                      <th colSpan="2">{Lang.get("Tax")} %</th>
                      <th colSpan="2">{Lang.get("Total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.data.items_list?.map((row, i) => (
                      <tr key={i}>
                        <td style={{ width: "35%", wordBreak: "break-all" }}>
                          {row.title}
                        </td>
                        <td colSpan="2" style={{ wordBreak: "break-all" }}>
                          {row.price} {symbol?.sign}
                        </td>
                        <td colSpan="2">
                          <div>{row.quantity}</div>
                        </td>
                        <td colSpan="2">
                          <div>{row.vat} %</div>
                        </td>
                        <td colSpan="2">
                          <div className="text-right">
                            <div className="d-flex flex-column align-items-end">
                              <div>
                                {row.total} {symbol?.sign}
                              </div>
                              {!!row.discount_condition && (
                                <div style={{ width: 100 }}>
                                  <b>{row.discount_title} </b>
                                  <span>
                                    (-{calculateDiscount(row)}
                                    {symbol?.sign})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tbody>
                    <tr className="text-nowrap">
                      <th colSpan="2" />
                      <th colSpan="3" />
                      <td colSpan="2" className="fw-500">
                        {Lang.get("TotalExclTax")}
                      </td>
                      <td colSpan="2">
                        {state.totalExTax} {symbol?.sign}
                      </td>
                    </tr>
                    <tr className="text-nowrap">
                      <th colSpan="2" />
                      <th colSpan="3" />
                      <td colSpan="2" className="fw-500">
                        {Lang.get("TotalTax")}
                      </td>
                      <td colSpan="2">
                        {state.totalTax} {symbol?.sign}
                      </td>
                    </tr>
                    {state.totalDiscount > 0 && (
                      <tr className="text-nowrap">
                        <th colSpan="2" />
                        <th colSpan="3" />
                        <td colSpan="2" className="fw-500">
                          {Lang.get("TotalDiscount")}
                        </td>
                        <td colSpan="2">
                          -{state.totalDiscount} {symbol?.sign}
                        </td>
                      </tr>
                    )}
                    {/* Fines was here */}
                    <tr className="text-nowrap">
                      <th colSpan="2" />
                      <th colSpan="3" />
                      <td colSpan="2" className="fw-500">
                        {/*{Lang.get("TotalIncludedVAT")}*/}
                        {Lang.get("TotalToPay")}
                      </td>
                      <td colSpan="2">
                        {state.totalToPay} {symbol?.sign}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-12">
              {state.data?.description && (
                <React.Fragment>
                  <label className="form-control-label">
                    {Lang.get("Description")}
                  </label>
                  <div className="fs-14" style={{ whiteSpace: "inherit" }}>
                      <div
                        style={{ lineHeight: 1.3 }}
                        className="fs-16"
                        dangerouslySetInnerHTML={{
                          __html: state.data.description,
                        }}
                      />
                  </div>
                </React.Fragment>
              )}
              {state.data?.terms_conditions_id && (
                <div className="core-collapsing-list">
                  <div className="item">
                    <div className="head">
                      <button
                        data-toggle="collapse"
                        data-target={`#terms`}
                        className="d-flex align-items-center border-0 rounded-0 w-100 p-3"
                      >
                        <i className="feather feather-chevron-right mr-3" />
                        <h3 className="mb-0">{Lang.get("Terms&Conditions")}</h3>
                      </button>
                    </div>
                    <div id="terms" className="content collapse px-3">
                      <div className="fs-14" style={{ whiteSpace: "inherit" }}>
                          <div
                            style={{ lineHeight: 1.3 }}
                            className="fs-16"
                            dangerouslySetInnerHTML={{
                              __html: state.terms_description,
                            }}
                          />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!ifUser && (
                <React.Fragment>
                  {state.data?.comment && (
                    <div className="d-flex flex-column">
                      <div className="core-collapsing-list">
                        <div className="item">
                          <div className="head">
                            <button
                              data-toggle="collapse"
                              data-target={`#comment`}
                              className="d-flex align-items-center border-0 rounded-0 w-100 p-3"
                            >
                              <i className="feather feather-chevron-right mr-3" />
                              <h3 className="mb-0">{Lang.get("Comment")}</h3>
                            </button>
                          </div>
                          <div id="comment" className="content collapse px-3">
                            <p>{state.data?.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
