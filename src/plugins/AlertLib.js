import { Lang } from "fogito-core-ui";
import Swal from "sweetalert2";

export class AlertLib {

  static deleteCondition = async () =>{
    let res = await Swal.fire({
      position: "center",
      toast: false,
      timer: null,
      title: Lang.get("DeleteAlertTitle"),
      text: Lang.get("DeleteAlertDescription"),
      buttonsStyling: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-secondary",
      confirmButtonText: Lang.get("Confirm"),
      cancelButtonText: Lang.get("Cancel"),
    });

    return res.isConfirmed
  }

  static condition = async (title,text = '') =>{

    let res = await Swal.fire({
      position: "center",
      toast: false,
      timer: null,
      title: title,
      text: text,
      buttonsStyling: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-secondary",
      confirmButtonText: Lang.get("Confirm"),
      cancelButtonText: Lang.get("Cancel"),
    });

    return res.isConfirmed
  }


  static errorAlert = (error) =>{
    Swal.fire({
      icon: 'error',
      title: Lang.get('Error'),
      text: error,
    })
  }


}
