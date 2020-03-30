import { Component, OnInit } from "@angular/core";
import { DataService } from "../../@features/services/data.service";
import { VendorModel } from "../../@features/models/vendor.model";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

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
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.vendor = this.data.getMyProfile();
  }

  async logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["/"]);
    });
  }
  setLanguage(language: string) {
    this.translate.use(language);
  }
}
