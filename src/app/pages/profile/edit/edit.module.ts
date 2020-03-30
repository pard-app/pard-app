import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EditPageRoutingModule } from "./edit-routing.module";

import { EditPage } from "./edit.page";
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../../@features/components/components.module";
import { GoogleMapsModule } from "@angular/google-maps";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    ComponentsModule,
    EditPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [EditPage]
})
export class EditPageModule {}
