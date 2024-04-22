import React from "react";
import Empty from "antd/lib/empty";
import ErrorBoundary from 'fogito-core-ui/build/components/error/ErrorBoundary';
import Lang from 'fogito-core-ui/build/library/Lang';

export const NoData = React.memo(({ description }) => {
  return (
    <ErrorBoundary>
      <Empty description={Lang.get(description)} className="py-5 mt-2" />
    </ErrorBoundary>
  );
});
