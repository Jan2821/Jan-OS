export enum CaseStatus {
  OPEN = 'OFFEN',
  CLOSED = 'GESCHLOSSEN',
  ARCHIVED = 'ARCHIVIERT',
  PENDING = 'IN BEARBEITUNG'
}

export interface CaseFile {
  id: string;
  title: string;
  description: string;
  officerInCharge: string;
  dateCreated: string;
  status: CaseStatus;
  suspects: string[];
  evidence: string[];
}

export interface FaxMessage {
  id: string;
  recipient: string;
  sender: string;
  content: string;
  timestamp: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
}

export interface AutopsyReport {
  id: string;
  deceasedName: string;
  dateOfDeath: string;
  causeOfDeath: string;
  examinerNotes: string;
  externalInjuries: string;
  internalFindings: string;
  toxicology: string;
  generatedSummary?: string;
}

export interface TrafficViolation {
  id: string;
  driverName: string;
  licensePlate: string;
  vehicleModel: string;
  violationType: 'SPEEDING' | 'RED_LIGHT' | 'PARKING' | 'DUI';
  location: string;
  speedLimit: number;
  actualSpeed: number;
  fineAmount: number;
  date: string;
  evidenceImage?: string; // Base64 or URL
}

export interface User {
  id: string;
  name: string;
  rank: string;
  badgeNumber: string;
  role: 'ADMIN' | 'OFFICER';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CASES = 'AKTEN',
  FAX = 'FAX',
  AUTOPSY = 'OBDUKTION',
  TRAFFIC = 'VERKEHR',
  SETTINGS = 'EINSTELLUNGEN'
}

/* --- AUTOHAUS TYPES --- */

export interface Car {
  id: string;
  model: string; // Opel models
  year: number;
  color: string;
  price: number;
  mileage: number;
  vin: string;
  status: 'AVAILABLE' | 'SOLD' | 'MAINTENANCE';
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string; // Added to fix TS build error
}

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  stock: number;
  price: number;
  category: 'MOTOR' | 'KAROSSERIE' | 'INNENRAUM' | 'RÄDER';
}

export interface AutohausUser {
    id: string;
    name: string;
    role: 'ADMIN' | 'VERKÄUFER' | 'WERKSTATT';
}

export enum AutohausView {
  INVENTORY = 'BESTAND',
  SALES = 'VERKAUF',
  WORKSHOP = 'WERKSTATT',
  OFFICE = 'BÜRO'
}

// Global declaration for html2pdf
declare global {
  var html2pdf: any;
}