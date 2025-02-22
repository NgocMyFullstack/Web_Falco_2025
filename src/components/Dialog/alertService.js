import Swal from "sweetalert2";

const showSessionExpiredAlert = () => {
  Swal.fire({
    title: "Thông báo",
    text: "Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại.",
    icon: "warning",
    confirmButtonText: "Quay về ",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/login";
    }
  });
};

export default showSessionExpiredAlert;
