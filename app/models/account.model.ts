export interface Account {
  id?: number;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  latitude?: number;
  longitude?: number;
  lastContactDate: Date;
  lastOrderDate?: Date;
  notes: string;
  accountType: AccountType;
}

export type AccountType = 'active' | 'prospect' | 'inactive';

export interface AccountFilters {
  searchQuery?: string;
  accountType?: AccountType;
  lastContactDays?: number;
}