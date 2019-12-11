import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormActionService {
  private actionForm = new Subject<number>();
  private refreshAction = new Subject<any>();

  constructor() { }

  sendActionValue(data: any) {
    this.actionForm.next(data);
  }

  getActionValue(): Observable<any> {
    return this.actionForm.asObservable();
  }

  sendRefreshAction() {
    this.refreshAction.next();
  }

  getRefreshAction(): Observable<any> {
    return this.refreshAction.asObservable();
  }
}
