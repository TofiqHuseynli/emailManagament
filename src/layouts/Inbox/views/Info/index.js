import React from "react";
import {
  ErrorBoundary,
  Popup,
 
} from "fogito-core-ui";


export const Info = ({ onClose}) => {
 

  return (
    <ErrorBoundary>
      <Popup show size="xl" onClose={onClose}>
        <Popup.Body>
         
        </Popup.Body>
        <Popup.Footer>
          <div className="d-flex">
          <div className="p-3 m-3 bg-white rounded d-flex ">
                <h3 className="mr-1">Subject:</h3><p>Test lorem ipsum</p>
            </div>

            <div className="p-5 m-3 bg-white rounded  ">
                <div className="d-flex justify-content-end align-items-start">
                    <div className="inbox-profil-img"><img src=''/></div>
                    <div className="inbox-user-info mr-2">
                        <span>Asif Huseynli</span>
                        <p>to Maryam</p>
                    </div>
                    <div className="inbox-email ">
                        <span>&lt;asifhuseynli56@gmail.com&gt;</span>
                    </div>
                    <div className="ml-auto"> 
                        <button
                            data-toggle="dropdown"
                            className="btn shadow-none bg-transparent feather feather-more-vertical p-0"
                            style={{ fontSize: "1.2rem", height: "22px", lineHeight: "1px", transform:'rotate(90deg)' }}
                        />
                    </div>
                </div>

                <div className="inbox-message-content mt-3">
                    <p> Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and lorem ldlm lkmlm lmlmsd lm</p>
                </div>
            </div>
            <div>

            </div>
          </div>
        </Popup.Footer>
      </Popup>
    </ErrorBoundary>
  );
};
