import React from "react";
import { ErrorBoundary } from "fogito-core-ui";
import { Route } from "react-router-dom";
import { Add, Edit } from "../views";

export const ViewRoutes = ({ onClose, loadData, path }) => {
  return (
    <ErrorBoundary>
      <Route
        path={`${path}/add`}
        render={(routeProps) => (
          <Add {...routeProps} reload={() => loadData()} onClose={onClose} />
        )}
      />
      {/* <Route
        path={`${path}/edit/:id`}
        render={(routeProps) => (
          <Edit {...routeProps} reload={() => loadData()} onClose={onClose} />
        )}
      /> */}
    </ErrorBoundary>
  );
};
