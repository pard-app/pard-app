export class OrderModel {
  buyer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address?: string;
    city?: string;
    county?: string;
    postCode?: string;
    comments?: string;
    country?: string;
  };
  completed: boolean;
  date: number;
  listings: [
    {
      description: string;
      id: string;
      image: string;
      price: number;
      quantity: number;
      sum: number;
      title: string;
    }
  ];
  orderId: string;
  seller: {};
  status: string;
  sum: number;
  vendor: string;
  id: string;
  delivery: boolean;
}
