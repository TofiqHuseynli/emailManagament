import {
  Inbox,
} from "@layouts";
import React from "react";

export const CORE_API_URL = "/core";
export const FILE_API_URL = "/files";
export const MICROSERVICE_URL = "/offers";
export const INVOICE_API_URL = "/invoices";


export const API_ROUTES = {
 // Settings
 settings: CORE_API_URL + "/settings",
 translations: CORE_API_URL + "/settings/translations",
 coreActivitiesList: CORE_API_URL + "/activities/list",
 coreTimezonesList: CORE_API_URL + "/data/timezones",
 

 // Users
 usersList: CORE_API_URL + "/users/recommendations/list",


 //
 taxRatesList: INVOICE_API_URL + "/taxrates/list",

 // Offers
 offersList: MICROSERVICE_URL + "/offers/list",
 offersAdd: MICROSERVICE_URL + "/offers/add",
 offersParams: MICROSERVICE_URL + "/offers/parameters",
 offersDelete: MICROSERVICE_URL + "/offers/delete",
 offersInfo: MICROSERVICE_URL + "/offers/info",
 offersEdit: MICROSERVICE_URL + "/offers/edit",
 offersConvert: MICROSERVICE_URL + "/offers/convert",
 offersResend: MICROSERVICE_URL + "/offers/resend",
 offersCancelled: MICROSERVICE_URL + "/offers/cancelledreasons",
 offersUserCancelled: MICROSERVICE_URL + "/users/cancelledreasons",
 offersLogs: CORE_API_URL + "/activities/list",
 changeStatus: MICROSERVICE_URL + "/offers/status",
 changeListStatus: MICROSERVICE_URL + "/offers/liststatus",
 paymentSettingsminList: MICROSERVICE_URL + "/offers/paymentsettingsminlist",
 currencyminList: MICROSERVICE_URL + "/offers/currencyminlist",
 timezoneminList: MICROSERVICE_URL + "/offers/timezoneminlist",
 termsminList: MICROSERVICE_URL + "/offers/termsminlist",
 templatesminList: MICROSERVICE_URL + "/offers/templatesminlist",

 // Terms & Conditions
 termsList: MICROSERVICE_URL + "/terms/list",
 termsDelete: MICROSERVICE_URL + "/terms/delete",
 termsAdd: MICROSERVICE_URL + "/terms/add",
 termsInfo: MICROSERVICE_URL + "/terms/info",
 termsEdit: MICROSERVICE_URL + "/terms/edit",

 // Offer Users
 offersUserInfo: MICROSERVICE_URL + "/users/info",
 offersUserStatus: MICROSERVICE_URL + "/users/status",
 offersUserSearch: MICROSERVICE_URL + "/users/search",

 // Invoice
 InvoiceSettings: INVOICE_API_URL + "/invoice/settings",

 // Note Changes
 notesChangesList: MICROSERVICE_URL + "/offernotes/list",
 notesChangesAdd: MICROSERVICE_URL + "/offernotes/add",
 notesChangesDelete: MICROSERVICE_URL + "/offernotes/delete",
 notesChangesEdit: MICROSERVICE_URL + "/offernotes/edit",

 //Branches
 branchesList: MICROSERVICE_URL + "/branches/query",
 branchesAdd: MICROSERVICE_URL + "/branches/add",
 branchesDelete: MICROSERVICE_URL + "/branches/delete",
};

export const MENU_ROUTES = [
  {
    path: "/inbox",
    name: "Inbox",
    id: "inbox",
    icon: <i className="symbol feather feather-mail text-danger" />,
    isExact: false,
    isHidden: false,
    component: (props) => <Inbox {...props} type="inbox" />,
  },
];
