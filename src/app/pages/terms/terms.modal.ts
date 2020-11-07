import { ModalController } from "@ionic/angular";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs";

@Component({
  selector: "app-terms",
  templateUrl: "./terms.modal.html",
  styleUrls: ["./terms.page.scss"],
})
export class TermsModal implements OnInit, OnDestroy {
  public terms: string = "en";
  public data: any;
  private subscription: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    // Load the data
    this.subscription = this.getTerms().subscribe((data) => {
      // Set the data to display in the template
      this.data = data;
    });
  }

  private getTerms() {
    // Define the data URL
    const dataUrl = `./assets/i18n/terms.${this.translate.currentLang}.html`;
    // Prepare the request
    return this.http.get(dataUrl, { responseType: "text" });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
