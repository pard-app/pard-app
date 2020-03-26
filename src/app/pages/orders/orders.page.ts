import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/features/services/data.service";
import { OrderModel } from "src/app/features/models/order.model";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ModalController } from "@ionic/angular";
import { ViewPage } from "./view/view.page";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.page.html",
  styleUrls: ["./orders.page.scss"]
})
export class OrdersPage implements OnInit {
  orders: Observable<Array<OrderModel>>;
  public viewingAll: boolean = false;

  constructor(
    private data: DataService,
    translate: TranslateService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.orders = this.data.getMyOrders();
  }

  completeOrder(id: string) {
    return this.data.completeOrder(id);
  }

  seeActive() {
    //this.orders = this.data.getActiveOrders();
    this.viewingAll = false;
  }

  updateOrder(id: string, status: string) {
    return this.data.updateOrder(id, status);
  }

  async viewOrder(order: OrderModel) {
    const modal = await this.modalController.create({
      component: ViewPage,
      componentProps: {
        order: order
      }
    });
    return await modal.present();
  }
}
