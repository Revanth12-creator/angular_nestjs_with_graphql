import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent, UploadInterceptor } from './app.component';
import { StudentTableComponent } from './components/student-table/student-table.component';
import { HompageComponent } from './hompage/hompage.component';

const routes: Routes = [
  {path:'', component:HompageComponent},
  {path:'students', component:StudentTableComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
