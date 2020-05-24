export class VendorModel {
  address: string;
  bank: string;
  city: string;
  company: string;
  country: string;
  description: string;
  email: string;
  image: string;
  phone: string;
  registered: string;
  regno: string;
  delivery: boolean;
  delivery_costs: number;
  delivery_note: string;
  title: string;
  _geoloc: {
    lat: number;
    lng: number;
  };
  stripe_id?: string;
}
