import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PATIENTS } from '../mockups/patients';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor() { }

  getPatients(): Observable<Patient[]> {
    return of(PATIENTS);
  }

  getPatient(id: number | null): Observable<Patient | undefined> {
    return of(PATIENTS.find(patient => patient.id === id));
  }
}
