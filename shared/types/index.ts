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
  isActive: boolean;
}

export interface RentalFormData {
  type: RentalType | null;
  numPeople: number;
  customerName: string;
  notes: string;
  paymentMethod: PaymentMethod;
  discount: number;
  extraTime: number;
}

export interface CreateRentalDto {
  type: RentalType;
  numPeople: number;
  customerName: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  startTime: string;
}

export interface UpdateRentalDto {
  endTime?: string;
  finalPrice?: number;
  paymentMethod?: PaymentMethod;
  discount?: number;
  extraTime?: number;
} 