import React from "react";
import Skeleton from "antd/lib/skeleton";
import ErrorBoundary from 'fogito-core-ui/build/components/error/ErrorBoundary';
import Loading from 'fogito-core-ui/build/components/common/Loading';
export const GeneralSkeleton = () => {
  return (
    <ErrorBoundary>
      <div className="d-flex px-2 pb-2 mt-4">
        {Array.from(new Array(4)).map((item, key) => (
          <Skeleton.Button
            active
            style={{ width: 70, height: 10, margin: "0 15px" }}
            key={key}
          />
        ))}
      </div>
      <div className="border__bottom mb-4 mt-1" />
      <div style={{ width: "100%", height: 300 }} className="position-relative">
        <Loading />
      </div>
    </ErrorBoundary>
  );
};
