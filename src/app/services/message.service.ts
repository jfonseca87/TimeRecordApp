import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  toast: any;
  private confirmAction = new Subject<any>();

  constructor() {
    this.toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      onOpen: (ev) => {
        ev.addEventListener('mouseenter', swal.stopTimer);
        ev.addEventListener('mouseleave', swal.resumeTimer);
      }
    });
  }

  getActionConfirm(): Observable<any> {
    return this.confirmAction.asObservable();
  }

  showMessage(action: string, message: string) {
    this.toast.fire({
      icon: action,
      title: message
    });
  }

  showConfirm(message: string, yesMessage: string, type: number) {
    swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: yesMessage
    }).then((result) => {
      const response = result.value ? type : 0;
      this.confirmAction.next(response);
    });
  }
}
