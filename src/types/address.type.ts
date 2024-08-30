export interface Address {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  country: string;
  city: string;
  district: string;
  street: string;
  building_type: string;
  building_number: number;
  floor?: number;
  apartment_number?: number;
  user_id?: string;
  lat?: number;
  lang?: number;
}
