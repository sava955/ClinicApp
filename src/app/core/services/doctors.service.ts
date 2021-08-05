import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DOCTORS } from '../mockups/doctors';
import { Doctor } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

  constructor() { }

  getDoctors(): Observable<Doctor[] | any[]> {
    return of(DOCTORS);
  }

  getDoctor(id: number): Observable<Doctor | undefined> {
    return of(DOCTORS.find(d => d.id === id));
  }
}
