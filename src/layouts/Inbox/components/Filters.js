import React from "react";
 import FilterBar from "fogito-core-ui/build/components/common/FilterBar";
import Tooltip from "antd/lib/tooltip";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";
import { Lang } from "fogito-core-ui";
import {
  historyPushByName,
  onFilterStorageBySection,
} from "@actions";

export const Filters = ({
  show,
  name,
  filters,
  setState,
}) => {
  
  const defaultModel = {
    subject: null,
    range: { start_date: null, end_date: null },
  };

  const [params, setParams] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    filters
  );

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
            <div className="input-group input-group-alternative">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="feather feather-search" />
                </span>
              </div>
              <input
                defaultValue={params.subject}
                onChange={(e) =>{setParams({subject: e.target.value})}}
                className="form-control form-control-alternative"
                placeholder={Lang.get("Subject")}
              />
            </div>
          </div>
        <div className="col-12 mb-2">
          <label className="text-muted mb-1">{Lang.get("Date")}</label>
          <div className="input-group input-group-alternative">
            <div className="input-group-prepend mr-2">
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
      </div>
    </FilterBar>
  );
};
