import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TermsPageRoutingModule } from "./terms-routing.module";

import { TermsPage } from "./terms.page";
import { TranslateModule } from "@ngx-translate/core";
import { TermsModal } from "./terms.modal";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsPageRoutingModule,
    TranslateModule,
  ],
  declarations: [TermsPage, TermsModal],
})
export class TermsPageModule {}
