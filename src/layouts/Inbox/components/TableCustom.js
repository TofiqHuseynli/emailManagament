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
            Salam Hello
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
            Hikmet Balayev
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
            Test subject
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
      width: 10,
      center: true,
      render: (data) => {
        return (
          <div className='dropleft'>
            <button
              data-toggle='dropdown'
              className='btn shadow-none bg-transparent feather feather-more-vertical p-0'
              style={{ fontSize: "1.2rem", height: "22px", lineHeight: "1px" }}
            />
            <div className='dropdown-menu'>
              <button
                className='dropdown-item'
               >
                {Lang.get( "SetDefault")}
              </button>
              <button
                className='dropdown-item'
             
              >
                {Lang.get("Edit")}
              </button>
              <button
                className='dropdown-item text-danger'
                onClick={() => onDelete([data.id])}
              >
                {Lang.get("Delete")}
              </button>
            </div>
          </div>
        );
      },
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
