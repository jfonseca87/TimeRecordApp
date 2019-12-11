import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GridModule } from '@progress/kendo-angular-grid';

import { FormActionService } from './services/form-action.service';
import { DateProcessService } from './services/date-process.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeRecordTableComponent } from './components/time-record-table/time-record-table.component';
import { TimeRecordFormComponent } from './components/time-record-form/time-record-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TimeRecordTableComponent,
    TimeRecordFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    FormActionService,
    DateProcessService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
