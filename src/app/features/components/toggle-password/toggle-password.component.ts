import { Component, ContentChild } from "@angular/core";

import { IonInput } from "@ionic/angular";

@Component({
  selector: "app-toggle-password",
  templateUrl: "./toggle-password.component.html",
  styleUrls: ["./toggle-password.component.scss"]
})
export class TogglePasswordComponent {
  show = false;

  @ContentChild(IonInput) input: IonInput;

  constructor() {}

  toggleShow() {
    this.show = !this.show;
    if (this.show) {
      this.input.type = "text";
    } else {
      this.input.type = "password";
    }
  }
}
