import React from "react";
import {
  ErrorBoundary,
  Lang,
  useToast,
  Popup,
  Loading,
  Textarea,
  Auth,
} from "fogito-core-ui";
import { Spinner } from "@components";
import { useForm } from "react-hook-form";
import {
  coreTimezonesList,
  currencyminList,
  InvoiceSettings,
  offersAdd,
  offersInfo,
  offersUserSearch,
  templatesminList,
  termsminList,
} from "@actions";
import classNames from "classnames";

export const Add = ({ onClose, reload }) => {
  const toast = useToast();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      
      loading: false,
      defaultVat: 0,
      currency_list: [],
      terms_list: [],
      currencies: [],
      timezones: [],
      branches: {
        data: [
          {
            ...Auth.get("company"),
            id: Auth.get("company")?.id,
            avatar: Auth.get("company")?.avatar?.medium,
            fullname: Auth.get("company")?.title,
          },
        ],
        count: 0,
      },
      template: null,
      updateLoading: false,
      defaultRate: null,
      description: "",
      start_date: "",
      showCc: false,
      showBcc: false,
      start_time: "",
      expires_date: "",
      expires_time: "",
      owner: {
        label: Auth.get("fullname"),
        value: Auth.get("id"),
        company: {
          ...Auth.get("company"),
          id: Auth.get("company")?.id,
          avatar: Auth.get("company")?.avatar?.medium,
          title: Auth.get("company")?.title,
        },
      },
      branch: null,
    }
  );

  const [params, setParams] = React.useState({
    items: [],
    fines: [],
    user_id: "",
    comment: "",
    date: null,
    template_id: null,
    currency_id: null,
    timezone_id: Auth.get("timezone")
      ? {
        label: Auth.get("timezone")?.title,
        value: Auth.get("timezone")?.id,
      }
      : null,
    expires_date: "",
    payment: "",
    currency: "",
    timezone: "",
    terms: null,
    vat_inclusive: 0,
    vat_included: 0,
    total_excluded_vat: 0,
    total_vat_amount: 0,
    total_included_vat: 0,
    total_to_pay: 0,
  });




  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading) {
      response = await offersAdd({
        data: {
          ...params,
          branches: state.branches.data.map((row) => row.id) || [],
          owner_id: state.owner?.value || "",
          date: `${state.start_date} ${state.start_time}`,
          expires_date: `${state.expires_date} ${state.expires_time}`,
          payment: params.payment?.value || "",
          description: state.description || "",
          currency_id: params.currency_id?.value || "",
          timezone_id: params.timezone_id?.value || "",
          terms_id: params.terms?.value || "",
          template: params.template?.value || "",
        },
      });

      if (response) {
        setState({ updateLoading: false });
        if (response?.status === "success") {
          onClose();
          await reload();
          toast.fire({
            title: Lang.get(response?.description),
            icon: "success",
          });
        } else {
          toast.fire({
            title: Lang.get(response?.description || "TitleIsEmpty"),
            icon: "error",
          });
        }
      }
    }
  };

  const handleCcOnclick= ()=>{
    setState({showCc: true});
  }

  const handleBccOnclick= ()=>{
    setState({showBcc: true});
  }

  const renderModalHeader = () => (
    <div>
      {Lang.get("Add")}
    </div>
  );


  return (

    <ErrorBoundary>
      <Popup show size="l" onClose={onClose} header={renderModalHeader()}>
        <Popup.Body>

          {state.loading && <Loading />}
          <div className="form-group">
            <div className="col-12 d-flex justify-content-between flex-column flex-md-row p-0">
              <div className="form-group col-md-12 p-0">
                <div className="form-group col-md-12">
                  <label className="form-control-label mx-1">
                    {Lang.get("Subject")}
                  </label>
                  <input
                    className="form-control  w-100"
                    placeholder={Lang.get("Select")}
                    value={params.select}
                    onChange={(e) =>
                      setParams({ ...params, selecet: e.target.value })
                    }
                  />
                </div>
                <div className="form-group col-md-12">
                  <label className="form-control-label mx-1">
                    {Lang.get("To")}
                  </label>
                  <div className="position-relative">
                    <input
                      className= {!state.showCc || !state.showBcc ? "form-control custom-input-fill w-100" : "form-control custom-input-fillCc w-100" }
                      placeholder={Lang.get("Title")}
                      value={params.title}
                      onChange={(e) =>
                        setParams({ ...params, title: e.target.value })
                      }
                    />
                    <div className="custom-btn-input d-flex justify-content-center  ">
                      <button onClick={handleCcOnclick} className={!state.showCc ? "show" : "hidden"}>Cc</button>
                      <button onClick={handleBccOnclick} className={!state.showBcc ? "show" : "hidden"} >Bcc</button>
                    </div>
                  </div>
                </div>

                <div className={state.showCc ? "form-group col-md-12" : "hidden"}>
                  <label className="form-control-label mx-1">
                    {Lang.get("Cc")}
                  </label>
                  <input
                    className="form-control  w-100"
                    placeholder={Lang.get("Cc")}
                    value={params.select}
                    onChange={(e) =>
                      setParams({ ...params, selecet: e.target.value })
                    }
                  />
                </div>

                <div className={state.showBcc ? "form-group col-md-12" : "hidden"}>
                  <label className="form-control-label mx-1">
                    {Lang.get("Bcc")}
                  </label>
                  <input
                    className="form-control  w-100"
                    placeholder={Lang.get("Bcc")}
                    value={params.select}
                    onChange={(e) =>
                      setParams({ ...params, selecet: e.target.value })
                    }
                  />
                </div>

              </div>
            </div>
          </div>
        </Popup.Body>
        <Popup.Footer>
          <div className="d-flex">
            <button onClick={onSubmit} className="btn btn-primary w-100">
              {state.saveLoading ? (
                <Spinner color="#fff" style={{ width: 30 }} />
              ) : (
                Lang.get("Send")
              )}
            </button>
            <button onClick={() => onClose()} className="btn btn-danger w-100">
              {Lang.get("Cancel")}
            </button>
          </div>
        </Popup.Footer>

      </Popup>
    </ErrorBoundary>
  );
};
