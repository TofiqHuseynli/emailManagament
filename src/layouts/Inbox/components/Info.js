import { ErrorBoundary } from "fogito-core-ui";
import React from "react";
export const Info = ({state, setState})=>{
    const showInfo =()=>{
        setState({info: true})
    }

    return(
        <ErrorBoundary>
           <div className="p-3"><button onClick={showInfo} class="btn btn-primary "><i class="feather feather-chevron-left"></i></button></div>
           <div className="p-3 m-3 bg-white rounded d-flex ">
            <h3 className="mr-1">Subject:</h3><p>Test lorem ipsum</p>
           </div>

           <div className="p-5 m-3 bg-white rounded  ">
            <div className="d-flex justify-content-end align-items-center">
                <div className="inbox-profil-img"><img></img></div>
                <div className="inbox-user-info bg-warning ">
                    <h5>Asif Huseynli</h5>
                    <span>to Maryam</span>
                </div>
                <div className="inbox-email d-flex ">
                    <p>asifhuseynli56@gmail.com</p>
                </div>
                <div className="ml-auto">thre dots</div>
            </div>

            <div className="inbox-message-content mt-3">
                <p>lorem ldlm lkmlm lmlmsd lm</p>
            </div>
           </div>
           <div>

           </div>
        </ErrorBoundary>
    )

}