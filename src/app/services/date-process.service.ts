import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateProcessService {

  constructor() { }

  firstDateOfMonth(date: Date): string {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return this.convertDateToString(firstDayOfMonth);
  }

  lastDateOfMonth(date: Date): string {
    const year = (date.getMonth() + 1) > 11 ? (date.getFullYear() + 1) : date.getFullYear();
    const nextMonth = (date.getMonth() + 1) > 11 ? 0 : (date.getMonth() + 1);
    const nextDayOfMonth = 1;
    const lastDateOfMonth = new Date(year, nextMonth, nextDayOfMonth);
    lastDateOfMonth.setDate(lastDateOfMonth.getDate() - 1);

    return this.convertDateToString(lastDateOfMonth);
  }

  actualDay(date: Date): string {
    return this.convertDateToString(date);
  }

  private convertDateToString(date: Date): string {
    const month = (date.getMonth() + 1).toString().length === 1 ?
      `0${(date.getMonth() + 1).toString()}` :
      (date.getMonth() + 1).toString();
    const day = date.getDate().toString().length === 1 ?
      `0${date.getDate().toString()}` :
      date.getDate().toString();

    return `${date.getFullYear()}-${month}-${day}`;
  }
}
