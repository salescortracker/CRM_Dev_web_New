import { Service } from '@angular/core';
import Swal from 'sweetalert2';

@Service()
export class Notification {

      success(message: string, title: string = 'Success') {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonColor: '#28a745'
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#dc3545'
    });
  }

  warning(message: string, title: string = 'Warning') {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonColor: '#ffc107'
    });
  }

  info(message: string, title: string = 'Information') {
    Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonColor: '#17a2b8'
    });
  }
}
