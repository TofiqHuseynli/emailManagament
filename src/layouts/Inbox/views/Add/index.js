import React from "react";
import {
  ErrorBoundary,
  Lang,
  useToast,
  Popup,
  Loading,
} from "fogito-core-ui";
import { Spinner, WYSIWYGEditor } from "@components";
import { useForm, Controller } from "react-hook-form";
import {
  mailsAdd,
} from "@actions";
 
export const Add = ({ onClose, reload }) => {
  const toast = useToast();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      showCc: false,
      showBcc: false,
      subject: '',
      to: '',
      carbon_copy: '',
      black_carbon_copy: '',
      message: '',
    }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading) {
      response = await mailsAdd({
        data: {
          subject: state.subject,
          to: state.to,
          carbon_copy: state.carbon_copy,
          black_carbon_copy: state.black_carbon_copy,
          message: state.message,
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

  const { control } = useForm({
    mode: "onChange",
  });

  const handleCcOnclick = () => {
    setState({ showCc: true });
  };
 
  const handleBccOnclick = () => {
    setState({ showBcc: true });
  };
  const renderModalHeader = () => <div>{Lang.get("NewMessage")}</div>;
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
                    placeholder={Lang.get("Subject")}
                    value={state.subject}
                    onChange={(e) =>
                      setState({ subject: e.target.value })
                    }
                  />
                </div>
                <div className="form-group col-md-12">
                  <label className="form-control-label mx-1">
                    {Lang.get("To")}
                  </label>
                  <div className="position-relative">
                    <input
                      className={
                        !state.showCc && !state.showBcc
                          ? "form-control custom-input-fill w-100"
                          : "form-control custom-input-fillCc w-100"
                      }
                      placeholder={Lang.get("To")}
                      value={state.to}
                      onChange={(e) =>
                        setState({ to: e.target.value })
                      }
                    />
                    <div className="custom-btn-input d-flex justify-content-center  ">
                      <button
                        onClick={handleCcOnclick}
                        className={!state.showCc && !state.showBcc ? "show" : "hidden"}
                      >
                        Cc
                      </button>
                      <button
                        onClick={handleBccOnclick}
                        className={!state.showCc && !state.showBcc ? "show" : "hidden"}
                      >
                        Bcc
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={state.showCc ? "form-group col-md-12" : "hidden"}
                >
                  <label className="form-control-label mx-1">
                    {Lang.get("Cc")}
                  </label>
                  <div className="position-relative">
                    <input
                      className={
                        !state.showBcc
                          ? "form-control cc-input-fill w-100"
                          : "form-control cc-input-full w-100"
                      }
                      placeholder={Lang.get("Cc")}
                      value={state.carbon_copy}
                      onChange={(e) =>
                        setState({ carbon_copy: e.target.value })
                      }
                    />
                    <div className="custom-btn-input d-flex justify-content-center  ">

                      <button
                        onClick={handleBccOnclick}
                        className={!state.showBcc ? "show" : "hidden"}
                      >
                        Bcc
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className={state.showBcc ? "form-group col-md-12" : "hidden"}
                >
                  <label className="form-control-label mx-1">
                    {Lang.get("Bcc")}
                  </label>
                  <div className="position-relative">
                    <input
                      className={
                        !state.showCc
                          ? "form-control bcc-input-fill w-100"
                          : "form-control bcc-input-full w-100"
                      }
                      placeholder={Lang.get("Bcc")}
                      value={state.black_carbon_copy}
                      onChange={(e) =>
                        setState({ black_carbon_copy: e.target.value })
                      }
                    />
                    <div className="custom-btn-input d-flex justify-content-center  ">
                      <button
                        onClick={handleCcOnclick}
                        className={!state.showCc && state.showBcc ? "show" : "hidden"}
                      >
                        Cc
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group col-12">
                  <label className="form-control-label">
                    {Lang.get("Message")}
                  </label>
                  <Controller
                    as={<WYSIWYGEditor defaultValue={state.message} />}
                    name="editor_content"
                    control={control}
                    placeholder="mdfdfffffes"
                    onChange={(data) => setState({ message: data[0] })}
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
