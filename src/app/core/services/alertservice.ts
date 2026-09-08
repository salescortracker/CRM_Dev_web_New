import { Service } from '@angular/core';
import Swal from 'sweetalert2';

@Service()
export class Alertservice {
     constructor() { }

  // Success
  success(message: string, title: string = 'Success') {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonColor: '#dc3545'
    });
  }

  // Error
  error(message: string, title: string = 'Error') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#dc3545'
    });
  }

  // Warning
  warning(message: string, title: string = 'Warning') {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonColor: '#dc3545'
    });
  }

  // Information
  info(message: string, title: string = 'Information') {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message
    });
  }

  // Confirmation
  confirm(message: string, title: string = 'Are you sure?') {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#dc3545'
    });
  }

  // Delete Confirmation
  deleteConfirm() {
    return Swal.fire({
      title: 'Delete',
      text: 'Do you want to delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#dc3545'
    });
  }

  // Loading
  showLoading(message: string = 'Please wait...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // Close Loading
  closeLoading() {
    Swal.close();
  }
}
