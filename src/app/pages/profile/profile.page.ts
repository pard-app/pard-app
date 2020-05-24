import { Component, OnInit } from "@angular/core";
import { DataService } from "../../@features/services/data.service";
import { VendorModel } from "../../@features/models/vendor.model";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { take } from "rxjs/operators";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  public vendor: VendorModel;

  constructor(
    private data: DataService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.data
      .getMyProfile()
      .pipe(take(1))
      .toPromise()
      .then((vendor) => {
        this.vendor = vendor;
      });
  }

  async logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["/"]);
    });
  }
  setLanguage(language: string) {
    this.translate.use(language);
  }

  formatStripeConnectLink(): string {
    if (this.vendor) {
      return `https://connect.stripe.com/express/oauth/authorize?client_id=${environment.stripeConfig.clientId}&suggested_capabilities[]=transfers&stripe_user[email]=${this.vendor.email}&stripe_user[phone_number]=${this.vendor.phone}&stripe_user[business_name]=${this.vendor.company}&stripe_user[currency]=eur&stripe_user[city]=${this.vendor.city}&stripe_user[street_address]=${this.vendor.address}&state=${this.afAuth.auth.currentUser.uid}`;
    }
  }

  formatStripeLoginLink(): string {
    if (this.vendor.stripe_id) {
      return `https://connect.stripe.com/express/oauth/authorize?client_id=${environment.stripeConfig.clientId}&stripe_landing=login&stripe_user[email]=${this.vendor.email}`;
    }
  }
}
