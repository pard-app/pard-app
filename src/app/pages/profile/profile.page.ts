import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/features/services/data.service";
import { VendorModel } from "src/app/features/models/vendor.model";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  public vendor: Observable<VendorModel>;

  constructor(
    private data: DataService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.vendor = this.data.getMyProfile();
  }

  async logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["/"]);
    });
  }
}