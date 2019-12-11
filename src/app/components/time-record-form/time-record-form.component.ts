import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormActionService } from 'src/app/services/form-action.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateProcessService } from 'src/app/services/date-process.service';
import { TimeRecordService } from 'src/app/services/time-record.service';
import { TimeRecord } from 'src/app/models/time-record';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-time-record-form',
  templateUrl: './time-record-form.component.html',
  styleUrls: ['./time-record-form.component.css']
})
export class TimeRecordFormComponent implements OnInit, OnDestroy {
  timeRecordObj = new TimeRecord();
  hideForm = true;
  subscription: Subscription;
  form: FormGroup;
  initDate: string;
  date = new Date();
  actions = {
    close: 0,
    create: 1,
    update: 2
  };

  constructor(private formAction: FormActionService,
              private dateProcess: DateProcessService,
              private fb: FormBuilder,
              private timeRecord: TimeRecordService) { }

  ngOnInit() {
    this.subscription = this.formAction.getActionValue().subscribe(
      data => this.actionForm(data)
    );

    this.initializeForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  actionForm(data: any) {
    this.resetForm();

    switch (data.value) {
      case this.actions.close:
        this.hideForm = true;
        break;
      case this.actions.create:
        this.timeRecordObj.id = 0;
        this.hideForm = false;
        break;
      case this.actions.update:
        this.form.get('dateRecord').disable();
        this.getTimeRecord(data.id);
        this.hideForm = false;
        break;
      default:
        break;
    }

    this.setDateForm(new Date());
  }

  initializeForm() {
    this.form = this.fb.group({
      activityNumber: [this.timeRecordObj.activityNumber, Validators.required],
      usedTime: [this.timeRecordObj.usedTime, Validators.required],
      dateRecord: [formatDate(this.timeRecordObj.dateRecord, 'yyyy-MM-dd', 'en'), [Validators.required]],
      comments: [this.timeRecordObj.comments]
    });
  }

  getTimeRecord(idTimeRecord: number) {
    this.timeRecord.getRecordById(idTimeRecord).subscribe(
      data => {
        this.timeRecordObj = data;
        this.initializeForm();
      },
      error => console.log('Error in getRecordbyId: ' + error)
    );
  }

  saveForm() {
    const data = this.form.value;
    data.id = this.timeRecordObj.id;

    if (this.timeRecordObj.id === 0) {
      this.timeRecord.saveRecord(data).subscribe(
        res => this.formAction.sendRefreshAction(),
        error => console.log('Error in saveRecord: ' + error)
      );
    } else {
      this.timeRecord.updateRecord(data).subscribe(
        res => this.formAction.sendRefreshAction(),
        error => console.log('Error in updateRecord: ' + error)
      );
    }
  }

  resetForm() {
    this.form.get('dateRecord').enable();
    this.form.reset();
  }

  setDateForm(date: Date) {
    const control = document.getElementById('dateForm') as HTMLInputElement;
    this.initDate = this.dateProcess.actualDay(date);

    control.setAttribute('max', this.initDate);
  }
}
