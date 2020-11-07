import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-privacy-policy",
  templateUrl: "./privacy-policy.page.html",
  styleUrls: ["./privacy-policy.page.scss"],
})
export class PrivacyPolicyPage implements OnInit {
  private subscription: Subscription;
  public data: any;

  constructor(private http: HttpClient, private translate: TranslateService) {}

  ngOnInit() {
    // Load the data
    this.subscription = this.getPolicy().subscribe((data) => {
      // Set the data to display in the template
      this.data = data;
    });
  }

  private getPolicy() {
    // Define the data URL
    const dataUrl = `./assets/i18n/privacy.${this.translate.currentLang}.html`;
    // Prepare the request
    return this.http.get(dataUrl, { responseType: "text" });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
