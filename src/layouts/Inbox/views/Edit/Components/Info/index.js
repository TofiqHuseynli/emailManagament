import React from "react";
import moment from "moment";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import classNames from "classnames";
import {
  MultiForm,
  NoData,
  Totals,
  WYSIWYGEditor,
} from "@components";
import {
  branchesAdd,
  coreTimezonesList,
  currencyminList,
  offersEdit,
  offersInfo,
  offersUserSearch,
  templatesminList,
  termsminList,
  timezoneminList,
} from "@actions";
import { Controller, useForm } from "react-hook-form";
import {
  Auth,
  ErrorBoundary,
  Lang,
  Loading,
  Members,
  Picker,
  Spinner,
  Textarea,
  useToast,
} from "fogito-core-ui";

export const Info = ({ data: { id }, type, reload, permission }) => {
  const toast = useToast();

  // const [description, setDescription] = React.useState(null);

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      description: "",
      loading: false,
      editorLoading: true,
      updateLoading: false,
      user: null,
      owner: null,
      defaultVat: 0,
      timezone: null,
      currency: null,
      start_date: "",
      start_time: "",
      expires_date: "",
      expires_time: "",
      branches: { data: [], count: 0 },
      payments_list: [],
      currencies: [],
      template: null,
      timezones: [],
      items: [],
      terms: null,
      fines: [],
      comment: "",
      title: "",
    }
  );
  const [params, setParams] = React.useState({
    id: id,
    items: [],
    fines: [],
    is_template: type === "templates" ? 1 : 0,
    type: "",
    title: "",
    user_id: "",
    user: null,
    comment: "",
    date: null,
    template_id: "",
    currency_id: null,
    payment: null,
    timezone_id: null,
    terms_id: null,
    offer_numbe: null,
    expires_date: null,
    terms_conditions_id: "",
    default_vat: 0,
    payment_settings_id: "",
    description: "",
    time_zone_id: "",
    vat_included: 0,
    total_excluded_vat: 0,
    total_vat_amount: 0,
    total_included_vat: 0,
  });
  const { control } = useForm({
    mode: "onChange",
  });
  const st = { label: { width: "165px", textAlign: "end" } };

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    if (!state.updateLoading) {
      let response = null;
      response = await offersEdit({
        data: {
          ...params,
          id,
          items: state.items,
          comment: state.comment,
          branches: state.branches.data.map((row) => row.id) || [],
          date: `${state.start_date} ${state.start_time}`,
          expires_date: `${state.expires_date} ${state.expires_time}`,
          payment: params.payment?.value || "",
          currency_id: state.currency?.value || "",
          timezone_id: state.timezone?.value || "",
          terms_id: state.terms?.value || "",
          user_id: state.user?.value || "",
          template_id: state.template?.value || "",
          template: state.template?.value || "",
          owner_id: state.owner?.value,
          ...(type === "templates" && { title: state.title || "" }),
        },
      });

      if (response) {
        setState({ updateLoading: false });
        if (response.status === "success") {
          await reload();
          toast.fire({
            title: Lang.get(response.description),
            icon: "success",
          });
        } else {
          toast.fire({
            title: Lang.get(response.description),
            icon: "error",
          });
        }
      }
    }
  };

  const loadData = async () => {
    setState({ loading: true });
    let response = null;
    response = await offersInfo({ data: { id } });
    if (response.status === "success") {
      setState({ loading: false });
      setParams((prevParams) => ({
        ...prevParams,
        id: id,
        title: response.data.title,
        currency_id: response.data.currency_data,
        timezone_id: response.data?.time_zone_data,
        payment: response.data.payment,
        terms_id: response.data.terms_conditions_id,
        items: response.data.items_list,
        fines: response.data.fines_list,
        is_template: response.data.is_template,
        type: response.data.type,
        user_id: response.data.user_id,
        comment: response.data.comment,
        date: response.data.start_date,
        description: response.data.description,
        payment_settings_id: response.data.payment_settings_id,
        offer_number: response.data.offer_number,
        time_zone_id: response.data.time_zone_id,
        vat_included: response.data.vat_included,
      }));
      setState({
        title: response.data.title,
        terms: response.data.terms_conditions_id,
        start_date: response.data?.date?.date || null,
        start_time: response.data?.date?.time?.slice(0, 5) || null,
        expires_date: response.data?.expires_date?.date || null,
        expires_time: response.data?.expires_date?.time?.slice(0, 5) || null,
        currency:
          response.data.currency_data?.label !== null
            ? response.data.currency_data
            : null,
        comment: response.data.comment,
        user: {
          label: response.data?.user_data?.fullname,
          value: response.data?.user_id,
          company: response.data.user_data?.company,
        },
        template_id: response.data.template,
        template: response.data.template,
        items: response.data.items_list,
        timezone: response.data?.time_zone_data,
        branches: response.data?.branches || { data: [], count: 0 },
        defaultVat: response.data.payment?.vat || 0,
        owner: {
          label: response.data?.owner?.fullname,
          value: response.data?.owner?.id,
          company: response.data?.owner?.company,
        },
      });
    } else {
      toast.fire({
        title: Lang.get(response.description),
        icon: "error",
      });
    }
  };

  const loadTemplates = async (query) => {
    let response = await templatesminList({ query });
    if (response) {
      if (response?.status === "success") {
        return response.templates?.map((item) => ({
          value: item.id,
          label: item.title,
        }));
      }
    }
  };

  const loadTemplate = async (data) => {
    if (data !== null) {
      setState({ loading: true });
      setParams({ ...params, template_id: data?.value });
      setState({ template: data });
      let response = await offersInfo({ data: { id: data?.value } });
      if (response.status === "success") {
        setState({ loading: false });
        setParams({
          ...params,
          is_template: 0,
          comment: response.data?.comment,
          items: response.data?.items_list,
          fines: response.data?.fines_list,
          type: response.data?.type,
          template_id: response.data?.id,
          user_id: response.data.user_id,
          description: response.data?.description,
          currency_id: response.data?.currency_data,
          payment:
            response.data?.payment?.label !== null
              ? response.data?.payment
              : null,
          terms_id: response.data.terms_conditions_id,
          timezone_id: response.data?.time_zone_data,
          terms_conditions_id: response.data?.terms_conditions_id,
          payment_settings_id: response.data?.payment_settings_id,
          vat_inclusive: response.data?.vat_inclusive,
          vat_included: response.data.vat_included,
          total_to_pay: response.data.total_to_pay,
        });
        setState({
          terms: response.data.terms_conditions_id,
          comment: response.data?.comment,
          currency:
            response.data.currency_data?.label !== null
              ? response.data.currency_data
              : null,
          items: response.data?.items_list,
          timezone: response.data?.time_zone_data,
          // branches: response.data.branches || { data: [], count: 0 },
          // template: response.date?.template,
        });
        toast.fire({
          title: Lang.get("TemplateChanged"),
          icon: "success",
        });
      } else {
        setState({
          loading: false,
          template: null,
          timezone: null,
          currency: null,
          comment: "",
          items: [],
          // branches: { data: [], count: 0 },
        });
        setParams({
          items: [],
          fines: [],
          is_template: 0,
          type: "",
          user_id: "",
          template_id: "",
          comment: "",
          date: "",
          description: "",
          currency_id: null,
          payment: null,
          // timezone_id: null,
          expires_date: "",
          terms_conditions_id: "",
          payment_settings_id: "",
          vat_inclusive: 0,
          vat_included: "",
        });
        toast.fire({
          title: Lang.get(response.description),
          icon: "error",
        });
      }
    } else {
      setState({
        loading: false,
        template: null,
        timezone: null,
        comment: "",
        currency: null,
        items: [],
      });
      setParams({
        items: [],
        fines: [],
        is_template: 0,
        type: "",
        user_id: "",
        comment: "",
        date: "",
        description: "",
        template_id: "",
        currency_id: null,
        payment: null,
        // timezone_id: null,
        expires_date: "",
        terms_conditions_id: "",
        payment_settings_id: "",
        vat_inclusive: 0,
        vat_included: "",
      });
    }
  };

  const loadUsers = async (query) => {
    let response = await offersUserSearch({
      skip: 0,
      limit: 20,
      query,
      type: "employee",
      list_type: type,
      permission_list_type: "edit",
    });
    if (response?.status === "success") {
      return response.data?.map((item) => ({
        value: item.id,
        label: item.fullname,
        company: item.company,
      }));
    }
  };

  const formatOptionLabelUser = (data) => (
    <div className="d-flex flex-column lh-14">
      <div>{data.label}</div>
      {data.company && <span className="fs-12">@ {data.company.title}</span>}
    </div>
  );

  const loadCurrency = async () => {
    let response = await currencyminList({
      skip: 0,
      limit: 20,
      names: ["currencies"],
    });
    if (response?.status === "success") {
      setState({
        currency_list: response.currency.currencies,
        currencies: response.currency.currencies,
      });
    }
  };

  const loadTimezone = async () => {
    let response = await timezoneminList({ skip: 0, limit: 20 });
    if (response?.status === "success") {
      setState({
        timezone_list: response.time_zone,
        timezones: response.time_zone,
      });
    }
  };

  const loadTerms = async (query) => {
    let response = await termsminList({ skip: 0, limit: 20, query });
    if (response?.status === "success") {
      setState({ terms_list: response.terms });
      return response.terms?.map((item) => ({
        value: item.id,
        label: item.title,
      }));
    }
  };

  const onChangeCurrency = async (currency_id) => {
    let items = [];
    let fines = [];
    const newArrByItems = state.items.map((item) => {
      return {
        ...item,
        total_count: item.total,
        percentage: 0,
      };
    });
    const newArrByFines = params.fines.map((fine) => {
      return {
        ...fine,
        total_count: fine.total,
        percentage: 0,
      };
    });
    for (let item of newArrByItems) {
      if (item.discount_type?.value === "currency") {
        item.discount_type = {
          label: currency_id?.label,
          value: "currency",
          sign: currency_id?.sign,
        };
      }
      items.push(item);
    }
    for (let item of newArrByFines) {
      if (item.discount_type?.value === "currency") {
        item.discount_type = {
          label: currency_id?.label,
          value: "currency",
          sign: currency_id?.sign,
        };
      }
      fines.push(item);
    }
    setState({ currency: currency_id });
    setState({ items });
    setParams({ ...params, items, fines, currency_id });
  };

  const loadTimezones = async (query = "") => {
    let response = await coreTimezonesList({ my_timezones: true, query });
    if (response) {
      if (response.status === "success") {
        return response.data.map((row) => ({
          label: row.title,
          value: row.id,
        }));
      }
    }
  };

  const checkCompany = async (obj) => {
    const lastUser = obj;
    const branches = state.branches.data.map((row) => row.id);
    if (lastUser.company && !branches.includes(lastUser.company.id)) {
      setState({
        branches: {
          data: state.branches.data.concat([
            {
              id: lastUser.company.id,
              avatar: lastUser.company?.avatar,
              fullname: lastUser.company.title,
              avatar_custom: lastUser.company.avatar_custom,
            },
          ]),
          count: state.branches.data.count + 1,
        },
      });
      let response = await branchesAdd({
        branch: lastUser.company.id,
        parent_id: id,
        parent_type: type === "terms" ? "terms" : "offers",
      });
      if (response) {
        toast.fire({
          title: Lang.get(response.description),
          icon: response.status,
        });
      }
    }
  };

  const symbol = state.currency || "";
  React.useEffect(() => {
    loadData();
    loadCurrency();
    loadTimezone();
  }, []);

  if (!permission()) {
    return <NoData description="PermissionNotAllowed" />;
  }

  return (
    <ErrorBoundary>
      <div className="position-relative">
      {state.loading ? (
          <div style={{ height: 300 }}>
            <Loading />
          </div>
        ) : (
        <form id="info-form" onSubmit={onSubmit}>
          <div className="d-flex align-items-center justify-content-end w-100 mt-3">
            <button
              form="info-form"
              className={classNames("btn btn-primary px-4 mb-3")}
            >
              {state.updateLoading ? (
                <Spinner style={{ width: 30 }} />
              ) : (
                Lang.get("Save")
              )}
            </button>
          </div>
          <div className="row d-flex flex-column px-2">
            {/** Generation **/}
            <div className="col-12 d-flex justify-content-between flex-column flex-md-row p-0">
              <div className="form-group col-md-4 p-0">
                <React.Fragment>
                  {Auth.isPermitted("offers", "update") && (
                    <AsyncSelect
                      isClearable
                      cacheOptions
                      defaultOptions
                      value={state.template}
                      className="form-control mt-3"
                      loadOptions={(e) => loadTemplates(e)}
                      placeholder={Lang.get("Template")}
                      onChange={(data) => loadTemplate(data)}
                    />
                  )}
                </React.Fragment>

                <AsyncSelect
                  isClearable={false}
                  value={state.owner}
                  cacheOptions
                  defaultOptions
                  formatOptionLabel={formatOptionLabelUser}
                  isDisabled={!Auth.isPermitted("offers", "update")}
                  className="form-control mt-3"
                  loadOptions={(e) => loadUsers(e)}
                  placeholder={Lang.get("Owner")}
                  onChange={(owner) => {
                    setState({ owner });
                    checkCompany(owner);
                  }}
                />

                <React.Fragment>
                  <AsyncSelect
                    value={state.user}
                    cacheOptions
                    defaultOptions
                    isDisabled={true}
                    formatOptionLabel={formatOptionLabelUser}
                    components={{ DropdownIndicator: () => null }}
                    className="form-control my_input mt-3"
                    placeholder={Lang.get("Receiver")}
                    onChange={(user) => setState({ user })}
                  />
                </React.Fragment>

                <div className="mt-3">
                  <Picker
                    date={state.start_date}
                    time={state.start_time}
                    timezoneCondition={false}
                    info={true}
                    onChangeDate={(date) =>
                      setState({
                        ...state,
                        start_date: moment(
                          date !== null ? date : new Date()
                        ).format("YYYY-MM-DD"),
                        start_time:
                          state.start_date || state.start_time
                            ? state.start_time
                            : "00:00",
                      })
                    }
                    onChangeTime={(time) =>
                      setState({
                        start_date:
                          state.start_date || state.start_time
                            ? state.start_date
                            : moment(new Date()).format("YYYY-MM-DD"),
                        start_time: time,
                      })
                    }
                    onChangeToday={() => {
                      setState({
                        start_date: moment().format("YYYY-MM-DD"),
                        start_time: moment().format("HH:mm"),
                      });
                    }}
                    onClearDate={() => setState({ start_date: "" })}
                    onClearTime={() => setState({ start_time: "" })}
                    getTimeZone={(start_timezone) =>
                      setState({ start_timezone })
                    }
                  />
                </div>

                <Textarea
                  className="form-control mt-3"
                  placeholder={Lang.get("Comment")}
                  rows="1"
                  maxLength="300"
                  value={state.comment}
                  onChange={(e) => setState({ comment: e.target.value })}
                />
                <span className="text-muted fs-13 ml-1">
                  {/* "Max Length must be {length}" */}
                  {Lang.get(`MaxLength`).replace(
                    "{length}",
                    300 - state.comment?.length
                  )}
                </span>
              </div>

              <div className="form-group col-md-6 p-0">
                <div className="d-flex align-items-center mt-3">
                  <label
                    className="form-control-label mb-0 mr-2"
                    style={st.label}
                  >
                    {Lang.get("OfferNumber#")}
                  </label>
                  <input
                    className="form-control"
                    placeholder="1234"
                    disabled
                    defaultValue={params.offer_number}
                  />
                </div>

                <div className={"d-flex align-items-center mt-3"}>
                  <label
                    className="form-control-label mb-0 mr-2"
                    style={st.label}
                  >
                    {Lang.get("Currency")}
                  </label>
                  <Select
                    isSearchable
                    value={state.currency}
                    options={state.currencies.map((x) => {
                      return {
                        label: x.title,
                        value: x.id,
                        sign: x.sign,
                      };
                    })}
                    placeholder={Lang.get("Currency")}
                    onChange={(currency) => onChangeCurrency(currency)}
                    className="form-control "
                  />
                </div>
                <div className="d-flex align-items-center mt-3">
                  <label
                    className="form-control-label mb-0 mr-2"
                    style={st.label}
                  >
                    {Lang.get("TimeZone")}
                  </label>
                  <AsyncSelect
                    isClearable
                    cacheOptions
                    defaultOptions
                    value={state.timezone}
                    loadOptions={loadTimezones}
                    placeholder={Lang.get("All")}
                    onChange={(timezone) => setState({ timezone })}
                    className="form-control"
                  />
                </div>
                <div className="d-flex mt-3">
                  <div>
                    <label
                      className="form-control-label mt-2 mb-0 mr-2"
                      style={{ width: "122px", textAlign: "end" }}
                    >
                      {Lang.get("ExpiresDate")}
                    </label>
                  </div>
                  <div>
                    <Picker
                      date={state.expires_date}
                      time={state.expires_time}
                      timezoneCondition={false}
                      onChangeDate={(date) =>
                        setState({
                          expires_date: moment(
                            date !== null ? date : new Date()
                          ).format("YYYY-MM-DD"),
                          expires_time:
                            state.expires_date || state.expires_time
                              ? state.expires_time
                              : "00:00",
                        })
                      }
                      onChangeTime={(time) =>
                        setState({
                          expires_date:
                            state.expires_date || state.expires_time
                              ? state.expires_date
                              : moment(new Date()).format("YYYY-MM-DD"),
                          expires_time: time,
                        })
                      }
                      onChangeToday={() => {
                        setState({
                          expires_date: moment().format("YYYY-MM-DD"),
                          expires_time: moment().format("HH:mm"),
                        });
                      }}
                      getTimeZone={(start_timezone) =>
                        setState({ start_timezone })
                      }
                      onClearDate={() => setState({ expires_date: "" })}
                      onClearTime={() => setState({ expires_time: "" })}
                    />
                  </div>
                </div>

                <div className={"d-flex align-items-center mt-3"}>
                  <label
                    className="form-control-label mb-0 mr-2"
                    style={st.label}
                  >
                    {Lang.get("Terms&Conditions")}
                  </label>
                  <AsyncSelect
                    isClearable
                    cacheOptions
                    defaultOptions
                    value={state.terms}
                    loadOptions={loadTerms}
                    placeholder={Lang.get("Terms&Conditions")}
                    onChange={(terms) => setState({ terms })}
                    className="form-control"
                  />
                </div>
                {Auth.isPermitted("branches", "view") && (
                  <div className={"d-flex align-items-center mt-3 mt-3"}>
                    <div className="d-flex flex-column ml-auto">
                      <label className="form-control-label mb-0 mr-2">
                        {Lang.get("SharedCompanies")}
                      </label>
                      <div className="ml-auto">
                        <Members
                          id={id}
                          type="branch"
                          permit={false}
                          users={state.branches}
                          me={state.branch}
                          getData={(list) =>
                            setState({
                              branches: { data: list.data, count: list.count },
                            })
                          }
                          updatePermit={Auth.isPermitted("branches", "sharing")}
                          inSection="offer"
                          toggleUrl="branches"
                          target="branches"
                          userListUrl="branchesList"
                          owner={false}
                          toggleParams={{
                            cardKey: "parent_id",
                            userKey: "branch",
                          }}
                          extraParams={{
                            parent_type: "offers",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/** Items **/}
            <MultiForm
              data={state}
              setData={setState}
              type={"items"}
              label={"Items"}
              id={id}
              parentType={"edit"}
              defaultVat={state.defaultVat}
              symbol={symbol}
            />

            <Totals items={state.items} symbol={symbol} />

            <div className="row d-flex flex-column justify-content-between px-3">
              {/** Description **/}
              <label className="form-control-label">
                {Lang.get("Description")}
              </label>
              <Controller
                as={<WYSIWYGEditor defaultValue={params.description} />}
                name="editor_content"
                control={control}
                onChange={(data) =>
                  setParams({ ...params, description: data[0] })
                }
              />
            </div>
          </div>
        </form>
        )}
      </div>
    </ErrorBoundary>
  );
};
