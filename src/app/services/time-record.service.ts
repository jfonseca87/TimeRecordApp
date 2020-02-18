import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimeRecord } from '../models/time-record';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimeRecordService {

  constructor(private client: HttpClient) { }

  getRecords(initialDate: string, finalDate: string) {
    return this.client.get<TimeRecord[]>(`${environment.url}TimeRecord/${initialDate}/${finalDate}`);
  }

  getRecordById(id: number) {
    return this.client.get<TimeRecord>(`${environment.url}TimeRecord/${id}`);
  }

  saveRecord(data: TimeRecord) {
    return this.client.post<TimeRecord>(`${environment.url}TimeRecord`, data);
  }

  updateRecord(data: TimeRecord) {
    return this.client.put<any>(`${environment.url}TimeRecord`, data);
  }

  updateRecordState(idTimeRecord: number) {
    const objRecord = {
      id: idTimeRecord
    };
    return this.client.patch<any>(`${environment.url}TimeRecord`, objRecord);
  }

  deleteRecord(id: number) {
    return this.client.delete<any>(`${environment.url}TimeRecord/${id}`);
  }
}
