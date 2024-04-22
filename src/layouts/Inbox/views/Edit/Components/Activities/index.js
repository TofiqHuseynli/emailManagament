import React from "react";
import reactStringReplace from "react-string-replace";
import Empty from "antd/lib/empty";
import { activityDate, coreActivitiesList } from "@actions";
import { Loading } from "./components";
import { FrameLink } from "@components";
import { Avatar, ErrorBoundary, Lang, Spinner } from "fogito-core-ui";

export const Activities = React.memo(({ data: { id } }) => {
  const limit = 20;
  const loader = React.useRef();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      data: [],
      loading: false,
      priority: [],
      priorityPercent: [0, 10],
      board: "",
      card: "",
      user: null,
      assigned_user: null,
      app: null,
    }
  );
  const [skip, setSkip] = React.useState(0);

  const loadData = async ({ type = "load" }) => {
    if (type === "load") {
      setState({ loading: true });
      setSkip(0);
    }
    let requestParams = {
      limit,
      skip: type === "load" ? 0 : skip,
      app_id: 262,
      filters: {
        offer_id: id,
      },
    };
    let response = await coreActivitiesList(requestParams);
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        if (type === "load") {
          setState({ data: response.data });
        } else {
          setState({ data: [...state.data, ...response.data] });
        }
        setState({ lastData: response.data });
      } else {
        setState({ data: [] });
      }
    }
  };

  const getReplaceDescriptions = (activity) => {
    let text = activity.description;
    let replacements = activity.replacements;
    if (text) {
      replacements.map((replacement, index) => {
        text = reactStringReplace(text, `{${replacement.key}}`, () =>
          Title({ ...replacement, index })
        );
      });
    }
    return text;
  };

  const getPriority = (percent = 0) => {
    let color = "#f5365c";
    let text = "high";
    if (percent < 5) {
      color = "#8a5ed9";
      text = "low";
    } else if (percent < 8) {
      color = "#fdd74d";
      text = "medium";
    }
    return (
      <span
        className="text-nowrap fs-14"
        style={{ color }}
      >{`${text} (${percent})`}</span>
    );
  };

  const Title = ({ type, title, is_link, id, index }) => {
    if (is_link) {
      switch (type) {
        case "templates":
          return (
            <span key={index} className="text-primary-alternative">
              {title}
            </span>
          );
        case "terms_title":
          return (
            <span key={index} className="text-primary-alternative">
              {title}
            </span>
          );
        case "terms_id":
          return (
            <span
              key={index}
              className="text-primary-alternative cursor-pointer"
              onClick={() => window.open(`/offers/terms/info/${id}/view`)}
            >
              {title}
            </span>
          );
        case "offer_template_id":
          return (
            <span
              key={index}
              className="text-primary-alternative cursor-pointer"
              onClick={() => window.open(`/offers/templates/edit/${id}`)}
            >
              {title}
            </span>
          );
        case "template_title":
          return (
            <span key={index} className="text-primary-alternative">
              {title}
            </span>
          );
        case "offer_number":
          return (
            <span key={index} className="text-primary-alternative">
              {title}
            </span>
          );
        case "offernumber":
          return (
            <span key={index} className="text-primary-alternative">
              {title}
            </span>
          );
        case "offer_id":
          return (
            <span
              key={index}
              className="text-primary-alternative cursor-pointer"
              onClick={() => window.open(`/offers/offers/edit/${id}`)}
            >
              {title}
            </span>
          );
        case "user":
          return (
            <FrameLink
              key={id}
              to={`/profile/${id}`}
              target="blank"
              native
              className="text-primary-alternative"
            >
              {title}
            </FrameLink>
          );
        case "whom":
          return (
            <FrameLink
              key={id}
              to={`/profile/${id}`}
              target="blank"
              native
              className="text-primary-alternative"
            >
              {title}
            </FrameLink>
          );
        case "receiver":
          return (
            <FrameLink
              key={id}
              to={`/profile/${id}`}
              target="blank"
              native
              className="text-primary-alternative"
            >
              {title}
            </FrameLink>
          );
        case "user_from":
          return (
            <FrameLink
              key={id}
              to={`/profile/${id}`}
              target="blank"
              native
              className="text-primary-alternative"
            >
              {title}
            </FrameLink>
          );
        case "user_to":
          return (
            <FrameLink
              key={id}
              to={`/profile/${id}`}
              target="blank"
              native
              className="text-primary-alternative"
            >
              {title}
            </FrameLink>
          );
        case "sender":
          return (
            <FrameLink
              key={id}
              to={`/profile/${id}`}
              target="blank"
              native
              className="text-primary-alternative"
            >
              {title}
            </FrameLink>
          );
        case "offer":
          return (
            <span
              key={index}
              onClick={() => window.open(`/offers/offers/edit/${id}/view`)}
              className="text-primary-alternative cursor-pointer"
            >
              {title}
            </span>
          );
        case "invoice":
          return (
            <span
              key={index}
              onClick={() => window.open(`/accounting/invoices/invoice/${id}`)}
              className="text-primary-alternative cursor-pointer"
            >
              {title}
            </span>
          );
        case "expense":
          return (
            <span
              key={index}
              onClick={() => window.open(`/accounting/expenses`)}
              className="text-primary-alternative cursor-pointer"
            >
              {title}
            </span>
          );
        case "setting":
          return <span key={index}>{title}</span>;
      }
    }
    if (!is_link) return title;
  };

  React.useEffect(() => {
    loadData({ type: "load" }, { skip: 0 });
  }, [
    state.user,
    state.board,
    state.card,
    state.app,
    state.priority,
    state.assigned_user,
  ]);

  React.useEffect(() => {
    if (skip && state.lastData?.length > 19) {
      loadData({ type: "scroll" });
    }
  }, [skip]);

  React.useEffect(() => {
    if (limit && loader.current) {
      new IntersectionObserver(
        (entities) => {
          if (entities[0].isIntersecting) {
            setSkip((prevSkip) => prevSkip + limit);
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0,
        }
      ).observe(loader.current);
    }
  }, [state.loading]);

  return (
    <ErrorBoundary>
      {/* Content */}
      <div className="py-3">
        {state.loading ? (
          <Loading />
        ) : state.data?.length ? (
          state.data.map((row, key) => (
            <div key={key} className="activities">
              <div className="activities-item pr-4 pl-2">
                <div className="activities-owner">
                  {row.user ? (
                    <Avatar
                      user={row.user}
                      onAction={() =>
                        window.open(`/crmplus/profile/${row.user?.id}`)
                      }
                    />
                  ) : (
                    <div
                      className="border border-gray d-flex align-items-center align-items-center p-2"
                      style={{ width: 35, height: 35, borderRadius: "50%" }}
                    >
                      <img
                        src={`${process.env.publicPath}/assets/svg/logo.svg`}
                        alt="logo"
                        className="w-100"
                      />
                    </div>
                  )}
                  {state.data[state.data.length - 1]?.id !== row.id && (
                    <div className="a-bottom" />
                  )}
                </div>
                <div className="activities-content">
                  <div>
                    <div className="lh-20" style={{ wordBreak: "break-word" }}>
                      {getReplaceDescriptions(row)}
                    </div>
                    <div className="d-flex flex-row mt-1">
                      <div className="text-muted text-nowrap fs-14">
                        {activityDate(row.created_at)}
                      </div>
                      <span className="mx-2 text-muted">•</span>
                      {getPriority(row.priority)}
                      <span className="mx-2 text-muted">•</span>
                      <div className="text-nowrap text-muted fs-14">
                        {row.app?.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Empty description={Lang.get("NoData")} className="py-5" />
        )}
      </div>
      {/* Scroll Loading */}
      {!state.loading && limit && skip + limit && (
        <div ref={loader}>
          {state.lastData?.length > 19 && (
            <Spinner
              color="#000"
              style={{
                width: 44,
                height: 44,
                margin: "0 auto",
                borderRadius: "50%",
              }}
              className="bg-white mt-3 d-flex align-items-center justify-content-center"
            />
          )}
        </div>
      )}
    </ErrorBoundary>
  );
});
