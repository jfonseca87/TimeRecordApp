import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormActionService } from 'src/app/services/form-action.service';
import { DateProcessService } from 'src/app/services/date-process.service';
import { TimeRecordService } from 'src/app/services/time-record.service';
import { Subscription } from 'rxjs';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-time-record-table',
  templateUrl: './time-record-table.component.html',
  styleUrls: ['./time-record-table.component.css']
})
export class TimeRecordTableComponent implements OnInit, OnDestroy {
  gridView: GridDataResult;
  gridData: any;
  subscription: Subscription;
  messageSubscription: Subscription;
  pageSize = 20;
  skip = 0;
  idTimeRecord = 0;
  dateFilter = {
    initialDate: '',
    finalDate: ''
  };
  codeMessage = {
    delete: 1,
    changeState: 2
  };

  constructor(private formAction: FormActionService,
              private dateProcess: DateProcessService,
              private timeRecord: TimeRecordService,
              private message: MessageService) { }

  ngOnInit() {
    const actualDate = new Date();
    this.setDatesAtGrid(actualDate);

    this.subscription = this.formAction.getRefreshAction().subscribe(
      res => this.getData()
    );

    this.messageSubscription = this.message.getActionConfirm().subscribe(
      res => {
        if (res === this.codeMessage.delete) {
          this.deleteRecord();
        } else {
          this.changeStateRecord();
        }
      }
    );

    this.getData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }

  getData() {
    this.timeRecord.getRecords(this.dateFilter.initialDate, this.dateFilter.finalDate).subscribe(
      data => {
        this.gridData = data;
        this.loadGrid();
      },
      error => console.log('Error in getRecords: ' + error)
    );
  }

  loadGrid() {
    this.gridView = {
      data: this.gridData.slice(this.skip, this.skip + this.pageSize),
      total: this.gridData.length
    };
  }

  pageChange(event: PageChangeEvent) {
    this.skip = event.skip;
    this.loadGrid();
  }

  search() {
    this.getData();
  }

  callUpdateRecord(item: any) {
    this.idTimeRecord = item.id;
    this.actionForm(2);
  }

  actionForm(action: number) {
    this.formAction.sendActionValue({ id: this.idTimeRecord, value: action });
  }

  setDatesAtGrid(date: Date) {
    const initialDate = this.dateProcess.firstDateOfMonth(date);
    const lastDate = this.dateProcess.lastDateOfMonth(date);
    const initControl = document.getElementById('initialDate') as HTMLInputElement;
    const finalControl = document.getElementById('finalDate') as HTMLInputElement;

    initControl.setAttribute('max', lastDate);
    finalControl.setAttribute('max', lastDate);

    this.dateFilter.initialDate = initialDate;
    this.dateFilter.finalDate = lastDate;
  }

  confirmDelete(item: any) {
    this.idTimeRecord = item.id;
    this.message.showConfirm('You want to delete this record', 'Yes', this.codeMessage.delete);
  }

  deleteRecord() {
    this.timeRecord.deleteRecord(this.idTimeRecord).subscribe(
      res => {
        this.idTimeRecord = 0;
        this.getData();
        this.message.showMessage('success', 'The record has been deleted successfully');
      },
      error => {
        this.idTimeRecord = 0;
        console.log('Error in saveRecord: ' + error);
        this.message.showMessage('error', 'An error has ocurred, please contact to system administrator');
      }
    );
  }

  confirmChangeState(control: any) {
    this.idTimeRecord = Number(control.currentTarget.attributes[2].value);
    this.message.showConfirm('You want to change the state of this record', 'Yes', this.codeMessage.changeState);
  }

  changeStateRecord() {
    this.timeRecord.updateRecordState(this.idTimeRecord).subscribe(
      res => {
        this.idTimeRecord = 0;
        this.getData();
        this.message.showMessage('success', 'The record has been state changed successfully');
      },
      error => {
        this.idTimeRecord = 0;
        console.log('Error in saveRecord: ' + error);
        this.message.showMessage('error', 'An error has ocurred, please contact to system administrator');
      }
    );
  }
}
