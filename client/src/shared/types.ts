export type PaymentMethod = 'CASH' | 'CREDIT';

export type RentalType = 'BED' | 'SUP' | 'SNORKEL';

export interface Rental {
  id: number;
  type: RentalType;
  startTime: string;
  endTime?: string;
  numPeople: number;
  customerName: string;
  notes?: string;
  basePrice: number;
  finalPrice?: number;
  discount: number;
  extraTime: number;
  paymentMethod: PaymentMethod;
  duration?: number;
  numItems?: number;
}

export interface RentalFormData {
  type: RentalType | null;
  numPeople: number;
  customerName: string;
  notes: string;
  paymentMethod: PaymentMethod;
  discount: number;
  extraTime: number;
  duration?: number;
  numItems?: number;
}

export interface CreateRentalDto {
  type: RentalType;
  numPeople?: number;
  customerName: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  duration?: number;
  numItems?: number;
}

export interface UpdateRentalDto {
  customerName?: string;
  notes?: string;
  discount?: number;
  paymentMethod?: PaymentMethod;
  endTime?: string;
  finalPrice?: number;
  duration?: number;
  numItems?: number;
} 