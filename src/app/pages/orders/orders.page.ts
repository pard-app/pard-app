import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/features/services/data.service";
import { OrderModel } from "src/app/features/models/order.model";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.page.html",
  styleUrls: ["./orders.page.scss"]
})
export class OrdersPage implements OnInit {
  orders: Observable<Array<OrderModel>>;

  constructor(private data: DataService, translate: TranslateService) {}

  ngOnInit() {
    this.orders = this.data.getActiveOrders();
  }

  completeOrder(order: OrderModel) {}

  confirmOrder(order: OrderModel) {}

  rejectOrder(order: OrderModel) {}
}
