import React from "react";

import {
  App,
  AppContext,
  ErrorBoundary,
  Lang,
  useToast,
  Actions,
} from "fogito-core-ui";
import {
  getFilterToLocal,
  onFilterStorageBySection,
  changeListStatus,
  mailsList,
} from "@actions";
import moment from "moment";

import { HeaderCustom, Info, TableCustom, ViewRoutes } from "./components";
import { config } from "@config";

export const Inbox = ({ name, history, match: { path, url } }) => {
  const toast = useToast();
  const VIEW = "inbox";
  const OWNER = App.get("OWNER");
  const USER = App.get("USER");
  const dateFilters = [
    {
      label: Lang.get("bySentDate"),
      value: "sent_at",
    },
    {
      label: Lang.get("byExpirationDate"),
      value: "expiration_at",
    },
  ];

  const { setProps } = React.useContext(AppContext);

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      loadingList: false,
      selectedIDs: [],
      data: [],
      count: 0,
      limit: localStorage.getItem(`${VIEW}_tb_limit`) || "10",
      skip: 0,
      info: JSON.parse(localStorage.getItem(`${VIEW}_columns_${config.appID}`)) ||
      true,
      hiddenColumns:
        JSON.parse(localStorage.getItem(`${VIEW}_columns_${config.appID}`)) ||
        [],
      paramsList: [],
      recipient: getFilterToLocal(name, "recipient") || null,

      listStatus: [],

      showFilter: false,
      filters: {
        activeCard: getFilterToLocal(name, "activecard") || "total",
        range: {
          start_date: getFilterToLocal(name, "date")
            ? moment
                .unix(getFilterToLocal(name, "date")?.split("T")[0] || "")
                .format("YYYY-MM-DD")
            : null,
          end_date: getFilterToLocal(name, "date")
            ? moment
                .unix(getFilterToLocal(name, "date")?.split("T")[1] || "")
                .format("YYYY-MM-DD")
            : null,
        },
        owner: OWNER
          ? { value: OWNER.id, label: OWNER.fullname }
          : getFilterToLocal(name, "owner")
          ? { value: getFilterToLocal(name, "owner"), label: "" }
          : null,
        user: USER
          ? { value: USER.id, label: USER.fullname }
          : getFilterToLocal(name, "user")
          ? { value: getFilterToLocal(name, "user"), label: "" }
          : null,
        branch: getFilterToLocal(name, "branch")
          ? { value: getFilterToLocal(name, "branch"), label: "" }
          : null,
        status: getFilterToLocal(name, "status")
          ? {
              label: "",
              value: Number(getFilterToLocal(name, "status")),
            }
          : null,
      },
    }
  );

  const loadData = async (params) => {
    setState({ loading: true, skip: params?.skip || 0 });
    let response = await mailsList({
      limit: state.limit || "",
      skip: params?.skip || 0,
      sort: "created_at",
      recipient: state.recipient || "",
      owner_id: state.filters.owner?.value || "",
      branch: state.filters.branch?.value || "",
      start_date: state.filters.range.start_date
        ? moment(`${state.filters.range.start_date} 00:00:00`).unix()
        : "",
      end_date: state.filters.range.end_date
        ? moment(`${state.filters.range.end_date} 23:59:59`).unix()
        : "",
      user_id: state.filters.user?.value || "",
      is_template: 0,
      status:
        state.filters.status?.value === 0
          ? "0"
          : state.filters.status?.value || "",
      ...params,
    });
    if (response) {
      setState({ loading: false, progressVisible: false });
      if (response.status === "success") {
        setState({ data: response.data, count: response.count });
      } else {
        setState({ data: [], count: 0 });
      }
    }
  };

  // const loadListStatus = async () => {
  //   setState({ setLoadingList: true });
  //   let response = await changeListStatus({
  //     status: state.filters.status?.value || "",
  //     user_id: state.filters.user?.value || "",
  //     start_date: state.filters.range.start_date
  //       ? moment(`${state.filters.range.start_date} 00:00:00`).unix()
  //       : "",
  //     end_date: state.filters.range.end_date
  //       ? moment(`${state.filters.range.end_date} 23:59:59`).unix()
  //       : "",
  //     owner_id: state.filters.owner?.value || "",
  //   });
  //   setState({ setLoadingList: false });
  //   if (response.status === "success") {
  //     setState({ listStatus: response.data });
  //   } else {
  //     setState({ listStatus: null });
  //   }
  // };

  // const loadParamsList = async () => {
  //   let response = await offersParams();
  //   if (response.status === "success") {
  //     setState({ paramsList: response });
  //   }
  // };

  const onDelete = (ids) =>
    toast
      .fire({
        position: "center",
        toast: false,
        timer: null,
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
          if (state.selectedIDs?.length === 1) {
            setState({ setLoading: true });
            let response = null;
            response = await offersDelete({ data: { id: ids[0] } });
            if (response) {
              setState({ loading: false, selectedIDs: [] });
              toast.fire({
                icon: response.status,
              });
              if (response?.status === "success") {
                const skip =
                  state.data?.length === 1 && state.skip >= state.limit
                    ? state.skip - state.limit
                    : state.skip;
                loadData({ skip });
              }
            }
          } else {
            setState({ progressVisible: true });
            Actions.multiAction({
              ids,
              limit: state.limit,
              skip: state.skip,
              dataLength: state.data?.length,
              url: "offersDelete",
              reload: (skip) => loadData({ skip }),
              getData: ({
                total,
                TotalItems,
                successPercent,
                errorPercent,
              }) => {
                setState({
                  total,
                  TotalItems,
                  successPercent,
                  errorPercent,
                });
              },
            });
          }
        }
      });

  const onClearFilters = () => {
    setState({
      recipient: null,
      filters: {
        activeCard: "total",
        status: null,
        user: null,
        owner: null,
        branch: null,
        receiver: null,
        range: { start_date: null, end_date: null },
      },
    });
    onFilterStorageBySection(name);
  };

  const onClose = () => {
    history.push(url);
  };

  const goBack = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      history.push("/offers");
    }
  };

  React.useEffect(() => {
    loadData();
  }, [state.recipient, state.limit, state.filters]);

  // React.useEffect(() => {
  //   loadParamsList();
  // }, []);

  React.useEffect(() => {
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

  const filters = {
    ...state.filters,
    recipient: state.recipient === "" ? null : state.recipient,
    activeCard: null,
    range:
      state.filters.range?.start_date === null &&
      state.filters.range?.end_date === null
        ? null
        : state.filters.range,
  };

  return !state.info ? (
    <ErrorBoundary>
      {/* <Filters
        show={state.showFilter}
        name={name}
        paramsList={state.paramsList}
        dateFilters={dateFilters}
        filters={state.filters}
        setState={(key, value) => setState({ [key]: value })}
      /> */}

      <ViewRoutes onClose={goBack} loadData={loadData} path={path} />

      <HeaderCustom
        state={state}
        setState={setState}
        onDelete={onDelete}
        loadData={loadData}
        onClearFilters={onClearFilters}
        path={path}
        VIEW={VIEW}
        filters={filters}
      />
      <section className="container-fluid">
        <TableCustom
          state={state}
          setState={setState}
          path={path}
          loadData={loadData}
          VIEW={VIEW}
          onDelete={onDelete}
        />
      </section>
    </ErrorBoundary>
  ) : (
    <ErrorBoundary>
      
      <Info
      state={state}
      setState={setState}
      />
     
    </ErrorBoundary>
  );
};
