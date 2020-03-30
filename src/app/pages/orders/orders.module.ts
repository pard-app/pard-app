import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrdersPageRoutingModule } from "./orders-routing.module";

import { OrdersPage } from "./orders.page";
import { TranslateModule } from "@ngx-translate/core";
import { FilterPipe } from "../../@features/pipes/filter.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    OrdersPageRoutingModule
  ],
  declarations: [OrdersPage, FilterPipe]
})
export class OrdersPageModule {}
