import React from "react";
import Skeleton from "antd/lib/skeleton";

export const Loading = React.memo(() => {
  return (
    <React.Fragment>
      {Array.from(new Array(10)).map((row, key) => (
        <div className="d-flex align-items-start pr-4 pl-2 mb-2" key={key}>
          <Skeleton.Avatar active size={35} shape={"circle"} className="mr-3" />
          <div className="d-flex flex-column w-100">
            <Skeleton.Button
              active
              size={"default"}
              shape={"round"}
              block={false}
              className="d-block w-100 py-1"
              style={{ height: 10 }}
            />
            <Skeleton.Button
              active
              size={"default"}
              shape={"round"}
              block={false}
              className="d-block w-75 py-1"
              style={{ height: 10 }}
            />
            <Skeleton.Button
              active
              size={"default"}
              shape={"round"}
              block={false}
              className="d-block w-50 py-1"
              style={{ height: 10 }}
            />
          </div>
        </div>
      ))}
    </React.Fragment>
  );
});
