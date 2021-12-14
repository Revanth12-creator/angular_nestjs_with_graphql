import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { StudentTableComponent } from './components/student-table/student-table.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadsModule, UploadModule } from '@progress/kendo-angular-upload';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { UploadInterceptor } from './app.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { HompageComponent } from './hompage/hompage.component';
import { NotificationModule } from '@progress/kendo-angular-notification';



@NgModule({
  declarations: [AppComponent, StudentTableComponent, HompageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    GridModule,
    BrowserAnimationsModule,
    PopupModule,
    DropDownsModule,
    InputsModule,
    ButtonsModule,
    DialogsModule,
    LabelModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    UploadsModule,
    UploadModule,
    DateInputsModule,
    NavigationModule,
    NotificationModule,
   
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UploadInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
