import React from "react";
import {
  ErrorBoundary,
  Lang,
  Table,
  SimpleDate,
  useToast,
  Members,
  App,
  Auth,
  Actions,
} from "fogito-core-ui";
import { Link } from "react-router-dom";
import { FrameLink } from "@components";
import Tooltip from "antd/lib/tooltip";
import classNames from "classnames";
import { offersDelete, offersResend } from "@actions";

export const TableCustom = ({ state, setState, path, loadData, VIEW, onDelete }) => {
  const toast = useToast();

  const columns = [
    // {
    //   name: Lang.get("ID"),
    //   center: false,
    //   render: (data) => (
    //     <Link
    //       className="text-primary-alternative"
    //       to={`${path}/edit/${data?.id}/view`}
    //     >
    //       <i className="feather feather-file-text mr-1" />
    //       {data?.offer_number || Lang.get("Number")}
    //     </Link>
    //   ),
    // },
    {
      name: Lang.get("From"),
      center: false,
      render: (data) => (
        <FrameLink
          native
          target="blank"
          to={`/profile/${data.from?.id}`}
          rel="noopener noreferrer nofollow"
        >
          <div className="text-primary-alternative">
            <i className="feather feather-user mr-1" />
            {data.from?.fullname}
          </div>
        </FrameLink>
      ),
    },
    {
      name: Lang.get("Recipient"),
      center: false,
      render: (data) => (
        <FrameLink
          native
          target="blank"
          to={`/profile/${data.recipient?.id}`}
          rel="noopener noreferrer nofollow"
        >
          <div className="text-primary-alternative">
            <i className="feather feather-user mr-1" />
            {data.recipient?.fullname}
          </div>
        </FrameLink>
      ),
    },
    {
      name: Lang.get("Subject"),
      center: false,
      render: (data) => (
        <FrameLink
          native
          target="blank"
          to={`/profile/${data.subject?.id}`}
          rel="noopener noreferrer nofollow"
        >
          <div className="text-primary-alternative">
            <i className="feather feather-user mr-1" />
            {data.subject?.fullname}
          </div>
        </FrameLink>
      ),
    },
    {
      name: Lang.get("Date"),
      sort: "date",
      center: false,
      width: 150,
      render: (data) => <SimpleDate date={data.created_at} />,
    },
       { 
      name: Lang.get("Actions"),
      center: true,
      width: 60,
      render: (data) => (
          <div className="d-flex">
            {data.permissions.can_edit && (
              <Tooltip title={Lang.get("Edit")}>
                <Link
                  className="btn btn-outline-warning btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 mx-1"
                  to={`${path}/edit/${data?.id}`}
                >
                  <i className="feather feather-edit-2" />
                </Link>
              </Tooltip>
            )}
            {data?.permissions?.can_resend && (
              <Tooltip title={Lang.get("Resend")}>
                <button
                  className="btn btn-outline-primary btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 mx-1"
                  onClick={() => onResend(data.id)}
                >
                  <i className="feather feather-send" />
                </button>
              </Tooltip>
            )}
            {data.permissions.can_delete && (
              <Tooltip title={Lang.get("Delete")}>
                <button
                  className="btn btn-outline-danger btn-sm h-auto lh-10 p-1 mb-2 mb-lg-0 mr-0 mx-1"
                  onClick={() => onDelete([data.id])}
                >
                  <i className="feather feather-x" />
                </button>
              </Tooltip>
            )}
          </div>
      ),
    },
  ];

  const onResend = (id) =>
    toast
      .fire({
        position: "center",
        toast: false,
        timer: null,
        title: Lang.get("ResendAlertTitle"),
        text: Lang.get("ResendAlertDescription"),
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
          let response = await offersResend({ data: { id } });
          if (response.status === "success") {
            toast.fire({
              title: Lang.get(response.description),
              icon: "success",
            });
            loadData({ skip: state.skip });
          } else {
            toast.fire({
              title: Lang.get(response.description),
              icon: "error",
            });
          }
        }
      });

  const onSelect = (id) => {
    if (state.selectedIDs.includes(id)) {
      setState({
        selectedIDs: state.selectedIDs.filter((item) => item !== id),
      });
    } else {
      setState({ selectedIDs: state.selectedIDs.concat([id]) });
    }
  };

  const onSelectAll = () => {
    if (state.data.every((item) => state.selectedIDs.includes(item.id))) {
      setState({ selectedIDs: [] });
    } else {
      setState({ selectedIDs: state.data.map((item) => item.id) });
    }
  };
  return (
    <ErrorBoundary>
      <Table
        view={VIEW}
        loading={state.loading}
        progressLoading={state.progressVisible}
        data={state.data}
        columns={{ all: columns, hidden: state.hiddenColumns }}
        pagination={{
          skip: state.skip,
          limit: state.limit,
          count: state.count,
          onTake: (limit) => setState({ limit }),
          onPaginate: (page) => loadData({ skip: page * state.limit }),
        }}
        select={{
          selectedIDs: state.selectedIDs,
          onSelect: onSelect,
          onSelectAll: onSelectAll,
        }}
      />
    </ErrorBoundary>
  );
};
