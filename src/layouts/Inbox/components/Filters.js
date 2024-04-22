import React from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import FilterBar from "fogito-core-ui/build/components/common/FilterBar";
import Tooltip from "antd/lib/tooltip";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";
import { Lang, Auth, App } from "fogito-core-ui";
import {
  historyPushByName,
  getFilterToLocal,
  onFilterStorageBySection,
  branchesList,
  offersUserSearch,
} from "@actions";

export const Filters = ({
  show,
  name,
  dateFilters,
  filters,
  paramsList,
  setState,
}) => {
  const USER = App.get("USER");
  const defaultModel = {
    branch: null,
    status: null,
    user: null,
    owner: null,
    receiver: null,
    title: "",
    range: { start_date: null, end_date: null },
    dateFilterType: {
      label: Lang.get("bySentDate"),
      value: "sent_at",
    },
  };

  const [params, setParams] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    filters
  );

  const loadOwners = async (query) => {
    let response = await offersUserSearch({
      skip: 0,
      limit: 20,
      query,
      type: "employee",
      list_type: "offers",
      permission_list_type: "list",
      selected_id: getFilterToLocal(name, "owner") || "",
    });
    if (response?.status === "success") {
      if (response.selected) {
        setParams({ owner: response.selected });
      }
      return response.data?.map((item) => ({
        value: item.id,
        label: item.fullname,
      }));
    }
  };

  const loadCustomers = async (query) => {
    let response = await offersUserSearch({
      skip: 0,
      limit: 20,
      query,
      type: "user",
      list_type: "offers",
      selected_id: getFilterToLocal(name, "user") || "",
    });
    if (response?.status === "success") {
      if (response.selected) {
        setParams({ user: response.selected });
      }
      return response.data?.map((item) => ({
        value: item.id,
        label: item.fullname,
      }));
    }
  };

  const loadBranches = async (query = "") => {
    let response = await branchesList({
      skip: 0,
      limit: 20,
      query,
      selected_id: getFilterToLocal(name, "branch") || "",
    });
    if (response?.status === "success") {
      if (response.selected) {
        setParams({ branch: response.selected });
      }
      return response.data?.map((item) => ({
        value: item.id,
        label: item.title,
      }));
    }
  };

  const onSearch = () => {
    if (JSON.stringify(params) !== JSON.stringify(filters)) {
      setState("filters", params);
    }
    setState("showFilter", false);
  };

  React.useEffect(() => {
    setParams(filters);
  }, [filters]);

  return (
    <FilterBar
      show={show}
      onClose={onSearch}
      onSearch={onSearch}
      onClear={() => {
        setParams(defaultModel);
        setState("filters", defaultModel);
        setState("showFilter", false);
        onFilterStorageBySection(name);
      }}
    >
      <div className="row">
        <div className="col-12 mb-2">
          <label className="text-muted mb-1">{Lang.get("Date")}</label>
          <div className="input-group input-group-alternative">
            <div className="input-group-prepend">
              <Tooltip
                title={<div className="fw-normal">{Lang.get("Today")}</div>}
              >
                <div
                  className="input-group-text border__right cursor-pointer"
                  onClick={() => {
                    setParams({
                      range: {
                        start_date: moment().format("YYYY-MM-DD"),
                        end_date: moment().format("YYYY-MM-DD"),
                      },
                    });
                    historyPushByName(
                      {
                        label: "date",
                        value: `${moment().unix()}T${moment().unix() || ""}`,
                      },
                      name
                    );
                  }}
                >
                  <i className="feather feather-type text-primary fs-16" />
                </div>
              </Tooltip>
            </div>

              <div className="input-group-prepend" style={{ width: "130px" }}>
                <Select
                  className="form-control"
                  value={params.dateFilterType}
                  onChange={(dateFilterType) => {
                    setParams({ dateFilterType });
                    historyPushByName(
                      {
                        label: "datetype",
                        value: dateFilterType?.value || "",
                      },
                      name
                    );
                  }}
                  options={dateFilters.map((item) => item)}
                />
              </div>

            <DatePicker.RangePicker
              allowEmpty={[true, true]}
              value={[
                params.range.start_date
                  ? moment(params.range.start_date, "YYYY-MM-DD")
                  : "",
                params.range.end_date
                  ? moment(params.range.end_date, "YYYY-MM-DD")
                  : "",
              ]}
              onChange={(date, dateString) => {
                setParams({
                  range: {
                    start_date: dateString[0] || null,
                    end_date: dateString[1] || null,
                  },
                });
                if (dateString[0] !== "" && dateString[1] !== "") {
                  historyPushByName(
                    {
                      label: "date",
                      value: `${moment(dateString[0]).unix()}T${
                        moment(dateString[1]).unix() || ""
                      }`,
                    },
                    name
                  );
                } else {
                  historyPushByName(
                    {
                      label: "date",
                      value: "",
                    },
                    name
                  );
                }
              }}
              placeholder={[Lang.get("StartDate"), Lang.get("EndDate")]}
              className="form-control"
            />
          </div>
        </div>
        {Auth.isPermitted("offers", "view", "all") && (
          <React.Fragment>
            {!USER && (
              <React.Fragment>
                {Auth.get("type") !== "user" && (
                  <div className="col-12 mb-2">
                    <label className="text-muted mb-1">
                      {Lang.get("Owner")}
                    </label>
                    <div className="input-group input-group-alternative">
                      <Tooltip title={Lang.get("Owner")}>
                        <div className="input-group-prepend">
                          <div
                            className="input-group-text border__right cursor-pointer"
                            onClick={() => {
                              setParams({
                                owner: !params.owner
                                  ? {
                                      label: Auth.get("fullname"),
                                      value: Auth.get("_id"),
                                    }
                                  : null,
                              });
                              historyPushByName(
                                {
                                  label: "owner",
                                  value: !params.owner ? Auth.get("_id") : "",
                                },
                                name
                              );
                            }}
                          >
                            <i
                              className={`feather feather-${
                                !!params.owner ? "user" : "users"
                              } text-primary`}
                            />
                          </div>
                        </div>
                      </Tooltip>
                      <AsyncSelect
                        isClearable
                        cacheOptions
                        defaultOptions
                        value={params.owner}
                        loadOptions={loadOwners}
                        placeholder={Lang.get("All")}
                        onChange={(owner) => {
                          setParams({ owner });
                          historyPushByName(
                            {
                              label: "owner",
                              value: owner?.value || "",
                            },
                            name
                          );
                        }}
                        className="form-control form-control-alternative"
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
       
          <React.Fragment>
            {Auth.isPermitted("offers", "view") && (
              <div className="col-12 mb-2">
                <label className="text-muted mb-1">
                  {Lang.get("Receiver")}
                </label>
                <div className="input-group input-group-alternative">
                  <Tooltip title={Lang.get("Receiver")}>
                    <div className="input-group-prepend">
                      <div
                        className="input-group-text border__right cursor-pointer"
                        onClick={() => {
                          if (Auth.get("type") === "user") {
                            setParams({
                              user: !params.user
                                ? {
                                    label: Auth.get("fullname"),
                                    value: Auth.get("_id"),
                                  }
                                : null,
                            });
                            historyPushByName(
                              {
                                label: "user",
                                value: !params.user ? Auth.get("_id") : "",
                              },
                              name
                            );
                          }
                        }}
                      >
                        <i
                          className={`feather feather-${
                            !!params.user ? "user" : "users"
                          } text-primary`}
                        />
                      </div>
                    </div>
                  </Tooltip>
                  <AsyncSelect
                    isClearable
                    cacheOptions
                    defaultOptions
                    value={params.user}
                    loadOptions={loadCustomers}
                    placeholder={Lang.get("All")}
                    onChange={(user) => {
                      setParams({ user });
                      historyPushByName(
                        {
                          label: "user",
                          value: user?.value || "",
                        },
                        name
                      );
                    }}
                    className="form-control form-control-alternative"
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        
        {Auth.isPermitted("branches", "view") && (
          <div className="col-12 mb-2">
            <label className="text-muted mb-1">{Lang.get("Company")}</label>
            <div className="input-group input-group-alternative">
              <AsyncSelect
                isClearable
                cacheOptions
                defaultOptions
                components={{
                  Control: ({ innerProps, children, innerRef }) => {
                    return (
                      <div
                        className="input-group-prepend m-1"
                        {...innerProps}
                        ref={innerRef}
                      >
                        {children}
                      </div>
                    );
                  },
                }}
                value={params.branch}
                loadOptions={loadBranches}
                placeholder={Lang.get("All")}
                onChange={(branch) => {
                  setParams({ branch });
                  historyPushByName(
                    {
                      label: "branch",
                      value: branch?.value || "",
                    },
                    name
                  );
                }}
                className="form-control form-control-alternative"
              />
            </div>
          </div>
        )}
      
          <div className="col-12 mb-2">
            <label className="text-muted mb-1">{Lang.get("Status")}</label>
            <div className="input-group input-group-alternative">
              <Select
                isClearable
                components={{
                  Control: ({ innerProps, children, innerRef }) => {
                    return (
                      <div
                        className="input-group-prepend m-1"
                        {...innerProps}
                        ref={innerRef}
                      >
                        {children}
                      </div>
                    );
                  },
                }}
                value={
                  params.status
                    ? {
                        label: paramsList.status_list?.find(
                          (item) => item.id === params.status?.value
                        )?.value,
                        value: paramsList.status_list?.find(
                          (item) => item.id === params.status?.value
                        )?.id,
                      }
                    : null
                }
                options={paramsList.status_list?.map((item) => ({
                  label: item.value,
                  value: item.id,
                }))}
                onChange={(data) => {
                  setParams({ status: data });
                  historyPushByName(
                    {
                      label: "status",
                      value: data ? String(data?.value) : "",
                    },
                    name
                  );
                }}
                placeholder={Lang.get("All")}
                name="value"
                className="form-control form-control-alternative"
              />
            </div>
          </div>
      </div>
    </FilterBar>
  );
};
