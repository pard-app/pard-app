import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.page.html",
  styleUrls: ["./welcome.page.scss"]
})
export class WelcomePage implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  setLanguage(language: string) {
    this.translate.use(language);
  }
}
