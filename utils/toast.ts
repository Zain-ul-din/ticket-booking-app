import Swal from 'sweetalert2';

export const toast = {
  success: (message: string) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  },

  error: (message: string) => {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      toast: true,
      position: 'top-end',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  },

  info: (message: string) => {
    Swal.fire({
      title: 'Info',
      text: message,
      icon: 'info',
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  },
};
