import moment from "moment";
import Lang from "fogito-core-ui/build/library/Lang";
import App from "fogito-core-ui/build/library/App";
import { config } from "@config";

export const calculateDiscount = (row) => {
  let res = 0;
  let type = row.discount_type?.value;

  if (!row.discount_value || !type) {
    return res;
  }

  if (type === "percentage") {
    res = (parseFloat(row.price) * row.quantity * row.discount_value) / 100;
    res = res.toFixed(2);
  } else {
    res = row.discount_value || 0;
  }

  return parseFloat(res);
};

export const activityDate = (date) => {
  let start_date;

  switch (moment.unix(date).format("YYYY-MM-DD")) {
    case moment().subtract(1, "days").format("YYYY-MM-DD"): // yesterday
      start_date = Lang.get("Yesterday");
      break;
    case moment().format("YYYY-MM-DD"): // today
      start_date = Lang.get("Today");
      break;
    default:
      start_date = `${moment.unix(date).format("D")} ${Lang.get(
        App.get("months_list")[Number(moment.unix(date).format("M")) - 1]
      ).slice(0, 3)} ${
        moment().format("YYYY") !== moment.unix(date).format("YYYY") // year
          ? moment.unix(date).format("YYYY")
          : ""
      }`;
      break;
  }

  return Lang.get("ActivityDate")
    .replace("{date}", start_date)
    .replace("{time}", moment.unix(date).format("HH:mm"));
};

export const getFilterToLocal = (name, target, filters = []) => {
  let url =
    JSON.parse(localStorage.getItem(`${config.appName}-${config.appID}`))?.find(
      (x) => x.name === name
    )?.url || "";
  if (target) {
    return new URLSearchParams(url).get(target) || false;
  } else {
    const _params = new URLSearchParams(url);
    filters?.length && filters.map((x) => _params.delete(x));
    return _params.toString();
  }
};

export const onFilterStorageBySection = (
  name,
  frame = config.appName,
  appID = config.appID
) => {
  let section = JSON.parse(
    localStorage.getItem(`${config.appName}-${config.appID}`)
  );
  section.find((x) => x.name === name).url = "";
  localStorage.setItem(`${frame}-${appID}`, JSON.stringify(section));
};

export const historyPushByName = (
  obj = {},
  name,
  frame = config.appName,
  appID = config.appID
) => {
  const paramsUrl = new URLSearchParams(
    JSON.parse(localStorage.getItem(`${frame}-${appID}`))?.find(
      (x) => x.name === name
    )?.url || ""
  );
  let urlss = (function () {
    let urls = [];
    paramsUrl.forEach((value, label) => {
      urls.push({ label, value });
    });
    return urls;
  })();
  if (obj?.value?.length) {
    if (urlss.find((url) => url.label === obj?.label)) {
      urlss.map((url) => {
        if (url.label === obj?.label) {
          url.value = obj?.value;
        }
        return url;
      });
    } else {
      urlss.push(obj);
    }
  } else {
    urlss = urlss.filter((url) => url.label !== obj?.label);
  }
  let newArr = [];
  for (let i in urlss) {
    let row = urlss[i];
    if (i === "0") {
      newArr.push(`?${row.label}=${row.value}`);
    } else {
      newArr.push(`&${row.label}=${row.value}`);
    }
  }
  const url =
    !!newArr?.length &&
    newArr?.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    );
  let localUrl = JSON.parse(localStorage.getItem(`${frame}-${appID}`)) || [];
  if (localUrl.find((x) => x.name === name)) {
    localUrl.map((x) => {
      if (x.name === name) {
        x.url = url;
      }
      return x;
    });
  } else {
    localUrl = localUrl.concat([{ name, url }]);
  }
  localStorage.setItem(`${frame}-${appID}`, JSON.stringify(localUrl));
};
