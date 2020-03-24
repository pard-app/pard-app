import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/features/services/data.service";
import { VendorModel } from "src/app/features/models/vendor.model";
import { Observable } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  public vendor: Observable<VendorModel>;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.vendor = this.data.getMyProfile();
  }
}
