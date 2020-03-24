import { Component, OnInit } from "@angular/core";
import { PhotoService } from "../../features/services/photo.service";
import { DataService } from "../../features/services/data.service";
import { ListingModel } from "src/app/features/models/listing.model";
import { Observable } from "rxjs";

@Component({
  selector: "app-listings",
  templateUrl: "./listings.page.html",
  styleUrls: ["./listings.page.scss"]
})
export class ListingsPage implements OnInit {
  constructor(public photoService: PhotoService, private data: DataService) {}
  listings: Observable<Array<ListingModel>>;
  public view: boolean = false;

  ngOnInit() {
    this.listings = this.data.getMyListings();
  }

  async deleteListing(listing: ListingModel) {
    await this.data.deleteListing(listing);
  }
  async publishListing(listing: ListingModel, action: boolean) {
    await this.data.publishListing(listing, action);
  }
}
