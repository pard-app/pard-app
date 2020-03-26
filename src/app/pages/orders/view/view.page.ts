import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { OrderModel } from "src/app/features/models/order.model";
import { ModalController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { DataService } from "src/app/features/services/data.service";
import { ListingModel } from "src/app/features/models/listing.model";

@Component({
  selector: "app-view",
  templateUrl: "./view.page.html",
  styleUrls: ["./view.page.scss"]
})
export class ViewPage implements OnInit, OnDestroy {
  @Input() order: OrderModel;
  private subscription: Subscription = new Subscription();
  public listings: any;

  constructor(
    private modalController: ModalController,
    private data: DataService
  ) {
    this.listings = new Array();
  }

  ngOnInit() {
    this.order.listings.map(({ listing, quantity }) => {
      this.subscription.add(
        this.data.getListingById(listing).subscribe(data => {
          data["quantity"] = quantity;
          this.listings.push(data);
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  completeOrder(id: string) {
    this.data.completeOrder(id).then(() => this.dismiss());
  }

  updateOrder(id: string, status: string) {
    this.data.updateOrder(id, status).then(() => this.dismiss());
  }
}
