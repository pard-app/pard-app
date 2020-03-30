import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { OrdersPage } from "./orders.page";

const routes: Routes = [
  {
    path: "",
    component: OrdersPage
  },
  {
    path: "view",
    loadChildren: () => import("./view/view.module").then(m => m.ViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersPageRoutingModule {}
