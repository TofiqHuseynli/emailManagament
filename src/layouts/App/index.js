import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { API_ROUTES, MENU_ROUTES, config } from "@config";
import { settings, translations } from "@actions";
import AppLib from "fogito-core-ui/build/library/App";
import {
  BottomNavigation,
  Content,
  Error,
  ErrorBoundary,
  Loading,
  Sidebar,
  Auth,
  Lang,
  Api
} from "fogito-core-ui";

export const App = () => {
  const location = useLocation();
  const url = location.pathname.split("/")[1];
  const ifUser = url === "offer";
  const [loading, setLoading] = React.useState(true);

  const loadSettings = async (params) => {
    const response = await settings(params);
    if (response) {
      return {
        account_data: response.account_data,
        permissions: response.permissions,
        timezone: response.timezone,
        company: response.company,
      };
    }
  };

  const loadTranslations = async (params) => {
    const response = await translations(params);
    if (response) {
      return {
        lang: response.data?.lang,
        lang_data: response.data?.lang_data,
      };
    }
  };

  const loadData = async () => {
    const common = parent.window.common;
    if (common) {
      let { account_data, lang } = common;
      const translations = await loadTranslations({ lang: lang?.short_code });
      Auth.setData({ ...account_data });
      Lang.setData({ ...translations });
      setLoading(false);
    } else {
      const settings = await loadSettings();
      const translations = await loadTranslations();
      Auth.setData({
        ...settings.account_data,
        permissions: settings.permissions,
        company: settings.company,
        timezone: settings.timezone,
      });
      Lang.setData({ ...translations });
      setLoading(false);
    }
  };

  const renderRoutes = (routes) => {
    return routes.map((route, key) => (
      <Route
        exact={route.isExact}
        path={route.path}
        render={(props) =>
          route.nestedRoutes ? (
            <Switch>
              {route.nestedRoutes.map((item, key) => (
                <Route
                  exact={item.isExact}
                  path={route.path + item.path}
                  render={(props) =>
                    item.component({
                      ...props,
                      ...{ name: item.name },
                    })
                  }
                  key={key}
                />
              ))}
              <Redirect to={route.path} />
            </Switch>
          ) : (
            route.component({
              ...props,
              ...{ name: route.name },
            })
          )
        }
        key={key}
      />
    ));
  };

  window.onThemeChange = (theme) => {
    document.body.className = theme;
  };

  React.useEffect(() => {
    if (process.env.frameMode) {
      const path =
        process.env.publicPath.replace("/service", "") +
        location.pathname +
        location.search;
      if (parent.window?.historyPush) {
        parent.window.historyPush(path);
      } else {
        if (url !== "offer") {
          window.location.replace(path);
        }
      }
    }
  }, [location]);

  React.useEffect(() => {
    Api.setRoutes(API_ROUTES);
    Api.setParams({ app_id: config.appID, test: true });
    AppLib.setData({
      appName: config.appName,
      months_list: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      discount_list: [
        {
          label: "%",
          value: "percentage",
        },
        {
          label: "DKK",
          value: "dkk",
        },
        {
          label: "EUR",
          value: "eu",
        },
      ],

      getStatusColor(status) {
        let color = "#000";
        switch (status) {
          case 1:
            color = "#A0841C";
            break;
          case 2:
            color = "#4CAF50";
            break;
          case 3:
            color = "#ffd600"; // "#717171"
            break;
          case 4:
            color = "#DE0357";
            break;
        }
        return color;
      },
    });

    loadData();
  }, []);

  if (loading) {
    return <Loading type='whole' />;
  }

  if (!Auth.isAuthorized() && url !== "inbox") {
    return <Error message={Lang.get("NotAuthorized")} />;
  }

  const routes =
    url === "inbox"
      ? MENU_ROUTES
      : MENU_ROUTES.filter((item) => Auth.isPermitted(item.id, "view"));

  return (
    <ErrorBoundary>
      {!ifUser && <Sidebar {...{ routes }} />}
      <Content>
        <Switch>
          {renderRoutes(routes)}
          <Redirect from='*' to='/inbox' />
        </Switch>
      </Content>
      <BottomNavigation {...{ routes }} />
    </ErrorBoundary>
  );
};
