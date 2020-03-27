import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TutorialPageRoutingModule } from "./tutorial-routing.module";

import { TutorialPage } from "./tutorial.page";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TutorialPageRoutingModule
  ],
  declarations: [TutorialPage]
})
export class TutorialPageModule {}
