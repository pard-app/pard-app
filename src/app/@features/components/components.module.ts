import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { TogglePasswordComponent } from "./toggle-password/toggle-password.component";
//import { GoogleMapComponent } from "./google-map/google-map.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [TogglePasswordComponent],
  exports: [TogglePasswordComponent]
})
export class ComponentsModule {}
