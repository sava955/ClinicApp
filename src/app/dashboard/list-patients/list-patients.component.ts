import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/core/models/patient';
import { PatientsService } from '../../core/services/patients.service';
import { DoctorsService } from '../../core/services/doctors.service';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/core/models/doctor';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss'],
})
export class ListPatientsComponent implements OnInit, AfterViewInit, OnDestroy {
  patients: Patient[] | undefined;
  doctor: Doctor | undefined;
  private subscriptions$: Subscription = new Subscription();
  displayedColumns: string[] = [
    'name',
    'registeredDate',
    'doctor',
    'contact',
    'address',
    'action'
  ];
  dataSource: MatTableDataSource<Patient>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalClients!: number;
  clientsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [5];

  loading = false;

  constructor(private _patientsService: PatientsService, private _doctorsService: DoctorsService, private router: Router) {
    this.dataSource = new MatTableDataSource(this.patients);
  }

  ngOnInit(): void {
    this.getPatients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  getPatients(): void {
    this.loading = true;

    this.subscriptions$.add(
      this._patientsService.getPatients().subscribe((res) => {
        this.patients = res;
        this.dataSource = new MatTableDataSource(this.patients);
        this.loading = false;
      })
    );
  }

  getDoctor(id: number): any {
    this.subscriptions$.add(
      this._doctorsService.getDoctor(id).subscribe((res) => {
        this.doctor = res;
      })
    )

    return {
      title: this.doctor?.title,
      firstName: this.doctor?.firstName,
      lastName: this.doctor?.lastName
    }
  }

  goToPatient(id: number): void {
    this.router.navigate([`/patient/${id}`]);
  }
}
