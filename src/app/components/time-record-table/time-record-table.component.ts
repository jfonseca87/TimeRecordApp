import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormActionService } from 'src/app/services/form-action.service';
import { DateProcessService } from 'src/app/services/date-process.service';
import { TimeRecordService } from 'src/app/services/time-record.service';
import { Subscription } from 'rxjs';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-time-record-table',
  templateUrl: './time-record-table.component.html',
  styleUrls: ['./time-record-table.component.css']
})
export class TimeRecordTableComponent implements OnInit, OnDestroy {
  gridView: GridDataResult;
  gridData: any;
  subscription: Subscription;
  pageSize = 10;
  skip = 0;
  idTimeRecord = 0;
  dateFilter = {
    initialDate: '',
    finalDate: ''
  };

  constructor(private formAction: FormActionService,
              private dateProcess: DateProcessService,
              private timeRecord: TimeRecordService) { }

  ngOnInit() {
    const actualDate = new Date();
    this.setDatesAtGrid(actualDate);

    this.subscription = this.formAction.getRefreshAction().subscribe(
      res => this.getData()
    );

    this.getData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
}
