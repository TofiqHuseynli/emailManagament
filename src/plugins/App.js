import Swal from "sweetalert2";

export class App {
  static data = {
    status_list: [
      { value: 0, title: "InProgress", color: "#ffd600" },
      { value: 1, title: "Completed", color: "#2dce89" },
    ],
  };

  static get(key) {
    return this.data ? this.data[key] : null;
  }
  static getData() {
    return this.data;
  }
  static setData(data) {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  static memberBorders = (type) => {
    switch(type) {
      case 'moderator':
        return {border: '3px solid #4EC9B3', padding:2 };
      case 'employee':
        return {border: '3px solid #AECC36', padding:2 };
      default:
        return {border: '3px solid #F99595', padding:2 };
    }
  }

  static errorModal(error) {
    Swal.fire({
      position: "top-middle",
      icon: "error",
      title: error,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  static successModal(desc) {
    Swal.fire({
      position: "top-middle",
      icon: "success",
      title: desc,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  static deleteModal(func) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary fs-14 fw-500 m-2 px-4",
        cancelButton: "btn btn-danger fs-14 fw-500 m-2 px-4",
        title: "fs-30 mt-3 mb-0",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete It",
      cancelButtonText: "No, Cancel",
    }).then(async (result) => {
      if (result.value) {
        await func();
      }
    });
  }

  static duplicateModal(func) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary fs-14 fw-500 m-2 px-4",
        cancelButton: "btn btn-danger fs-14 fw-500 m-2 px-4",
        title: "fs-30 mt-3 mb-0",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Yes, Duplicate It",
      cancelButtonText: "No, Cancel",
    }).then(async (result) => {
      if (result.value) {
        await func();
      }
    });
  }
}

