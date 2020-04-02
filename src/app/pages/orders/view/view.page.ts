import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { OrderModel } from "../../../@features/models/order.model";
import { ModalController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { DataService } from "../../../@features/services/data.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-view",
  templateUrl: "./view.page.html",
  styleUrls: ["./view.page.scss"]
})
export class ViewPage implements OnInit, OnDestroy {
  @Input() order: OrderModel;

  constructor(
    private modalController: ModalController,
    private data: DataService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
    }
  }

  ngOnDestroy(): void {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  completeOrder(id: string) {
    this.data.completeOrder(id).then(() => this.dismiss());
  }

  updateOrder(id: string, status: string) {
    if (
      status === "Rejected" &&
      confirm(this.translate.instant("REJECT_CONFIRMATION"))
    ) {
      this.data.updateOrder(id, status).then(() => this.dismiss());
    } else if (status === "Confirmed") {
      this.data.updateOrder(id, status).then(() => this.dismiss());
    }
  }
}
