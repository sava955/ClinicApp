import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MyErrorStateMatcher } from '../../core/utils/error-matchers';
import { DoctorsService } from '../../core/services/doctors.service';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Doctor } from 'src/app/core/models/doctor';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Patient } from 'src/app/core/models/patient';
import { PatientsService } from 'src/app/core/services/patients.service';
import { Address } from '../../core/models/address';
import { TYPE } from '../../core/enums/type.enum';
import { MODE } from '../../core/enums/mode.enum';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NewPatientComponent implements OnInit, OnDestroy {
  add = MODE.ADD;
  details = MODE.DETAILS;
  mode!: string;
  patientId!: number | null;
  idTitle!: string;
  patientForm!: FormGroup;
  addresses!: FormArray;
  matcher = new MyErrorStateMatcher();
  patient: Patient | undefined;
  doctors: Doctor[] | any;
  doctorId!: number;
  doctorDetails: Doctor | undefined;
  filteredOptions!: Observable<string[]> | any;

  types = ['SECOND HOME', 'WORK', 'HOLIDAY PLACE', 'CLOSE RELATIVE'];
  phonePrefix = '+39';
  private subscriptions$: Subscription = new Subscription();

  constructor(
    private _fb: FormBuilder,
    private _doctorsService: DoctorsService,
    private _patientsService: PatientsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getRouteParams();
    this._initPatientForm();
    this.addAddressesForms();
    this.getDoctors();
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  private _getRouteParams(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = this.details;
        this.patientId = +paramMap.get('id')!;
        this.idTitle = `ID: ${this.patientId}`;
        this.getPatient();
      } else {
        this.mode = this.add;
        this.patientId = null;
      }
    });
  }

  private getPatient(): void {
    this.subscriptions$.add(
      this._patientsService.getPatient(this.patientId).subscribe((res) => {
        this.patient = res;
      })
    );
  }

  private getDoctors(): void {
    this.subscriptions$.add(
      this._doctorsService.getDoctors().subscribe((res) => {
        this.doctors = res;
      })
    );
  }

  _initPatientForm(): void {
    this.patientForm = this._fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      birthDate: [null, Validators.required],
      vatcode: [null],
      email: [null, [Validators.required, Validators.email]],
      doctor: [null, Validators.required],
      addresses: this._fb.array([]),
    });

    this.formEvent();
  }

  private formEvent(): void {
    this.filteredOptions = this.doctor?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    if (this.mode === MODE.DETAILS) {
      this.setPatietDetails();
    }
  }

  setPatietDetails(): void {
    this.firstName?.patchValue(this.patient?.firstName);
    this.firstName?.disable();

    this.lastName?.patchValue(this.patient?.lastName);
    this.lastName?.disable();

    this.birthDate?.patchValue(this.patient?.birthDate);
    this.birthDate?.disable();

    this.vatcode?.patchValue(this.patient?.vatcode);
    this.vatcode?.disable();

    this.email?.patchValue(this.patient?.email);
    this.email?.disable();

    this.populateDoctor(this.patient?.doctor);
    this.doctor?.disable();
  }

  private populateDoctor(doctor: number | undefined): void {
    this.doctorId = doctor!;
    this.subscriptions$.add(
      this._doctorsService.getDoctor(this.doctorId).subscribe((res) => {
        this.doctorDetails = res;
        const doctorValue =
          this.doctorDetails?.title +
          ' ' +
          this.doctorDetails?.firstName +
          ' ' +
          this.doctorDetails?.lastName;
        this.doctor?.patchValue(doctorValue);
      })
    );
  }

  private _filter(value: string): void {
    const filterValue = value;
    if (filterValue?.length > 0) {
      return this.doctors.filter((doctor: Doctor) => {
        return (
          doctor.firstName.toLowerCase().includes(filterValue.toLowerCase()) ||
          doctor.lastName.toLowerCase().includes(filterValue.toLowerCase()) ||
          doctor.title.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    }
  }

  _initAddressForm(): FormGroup {
    return this._fb.group({
      type: null,
      name: null,
      phone: [
        null,
        [Validators.required, Validators.pattern('^\\+?[0-9\\s]+$')],
      ],
      street: [null, Validators.required],
      city: [null, Validators.required],
      zipCode: [null, Validators.required],
      country: [null, Validators.required],
    });
  }

  isOlder(event: any): void {
    const today = new Date();
    const years = today.getFullYear() - event.value?.getFullYear();

    if (event.value) {
      if (years > 18) {
        this.vatcode?.setValidators([Validators.required]);
      } else {
        this.vatcode?.clearValidators();
      }
      this.vatcode?.updateValueAndValidity();
    }
  }

  addAddressesForms(): void {
    this.addresses = this.patientForm.get('addresses') as FormArray;

    if (this.mode === this.details) {
      let i = 0;
      this.patient?.addresses.forEach((address) => {
        this.addresses?.push(this._initAddressForm());
        this.populateAddresses(i, address);
        i = i + 1;
      });
    } else {
      this.addresses?.push(this._initAddressForm());
    }
  }

  private populateAddresses(i: number, address: Address): void {
    const type = this.addresses.at(i).get('type');
    const name = this.addresses.at(i).get('name');
    const phone = this.addresses.at(i).get('phone');
    const street = this.addresses.at(i).get('street');
    const city = this.addresses.at(i).get('city');
    const zipCode = this.addresses.at(i).get('zipCode');
    const country = this.addresses.at(i).get('country');

    type?.setValue(address.type);
    type?.disable();

    name?.patchValue(address?.name);
    name?.disable();

    phone?.patchValue(address?.phone);
    phone?.disable();

    street?.patchValue(address?.street);
    street?.disable();

    city?.patchValue(address?.city);
    city?.disable();

    zipCode?.patchValue(address?.zipcode);
    zipCode?.disable();

    country?.patchValue(address?.country);
    country?.disable();
  }

  removeAddress(index: number): void {
    this.addresses?.removeAt(index);
  }

  selectedDoctor(event: any): void {
    this.populateDoctor(event.option.value.id);
  }

  formatPhone(event: any): void {
    event.target.value = event.target.value.replace(/\s/g, '');
    if (
      event.target.value.charAt(0) !== '+' &&
      event.target.value.length !== 0 &&
      event.target.value.match('^\\+?[0-9\\s]+$')
    ) {
      event.target.value = this.phonePrefix.concat(event.target.value);
    }
  }

  checkType(i: number): void {
    this.addresses.at(i).get('name')?.reset();
  }

  showName(i: number): boolean {
    if (
      this.addresses.at(i).get('type')?.value === TYPE.WORK ||
      this.addresses.at(i).get('type')?.value === TYPE.CLOSE_RELATIVE
    ) {
      return true;
    } else {
      return false;
    }
  }

  get firstName() {
    return this.patientForm.get('firstName');
  }

  get lastName() {
    return this.patientForm.get('lastName');
  }

  get birthDate() {
    return this.patientForm.get('birthDate');
  }

  get vatcode() {
    return this.patientForm.get('vatcode');
  }

  get email() {
    return this.patientForm.get('email');
  }

  get doctor() {
    return this.patientForm.get('doctor');
  }

  get addressesArr() {
    return this.addresses?.controls[0];
  }

  get name() {
    return this.addressesArr?.get('name');
  }

  get phone() {
    return this.addressesArr?.get('phone');
  }

  get street() {
    return this.addressesArr?.get('street');
  }

  get city() {
    return this.addressesArr?.get('city');
  }

  get zipCode() {
    return this.addressesArr?.get('zipCode');
  }

  get country() {
    return this.addressesArr?.get('country');
  }

  addPatient(): void {
    this.doctor?.patchValue(this.doctorId);

    if (!this.patientForm.valid) {
      return;
    }
    
    this.router.navigate(['/home']);
  }
}
