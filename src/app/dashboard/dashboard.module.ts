import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../shared/angular-material.modulet';
import { HomeComponent } from './home/home.component';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { ListPatientsComponent } from './list-patients/list-patients.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    NewPatientComponent,
    ListPatientsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    AngularMaterialModule
  ]
})
export class DashboardModule { }
