import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ListPatientsComponent } from './list-patients/list-patients.component';
import { NewPatientComponent } from './new-patient/new-patient.component';

const routes: Routes = [
  {
    path: '/',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'new-patient',
        component: NewPatientComponent
      },
      {
        path: 'patient/:id',
        component: NewPatientComponent
      },
      {
        path: 'list-patients',
        component: ListPatientsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
