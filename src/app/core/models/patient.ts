import { Address } from './address';

export interface Patient {
  id: number;
  registeredDate: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  vatcode: string;
  email: string;
  doctor: number;
  addresses: Address[];
}
