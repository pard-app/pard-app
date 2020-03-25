import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "listings",
        loadChildren: () =>
          import("../listings/listings.module").then(m => m.ListingsPageModule)
      },
      {
        path: "profile",
        loadChildren: () =>
          import("../profile/profile.module").then(m => m.ProfilePageModule)
      },
      {
        path: "orders",
        loadChildren: () =>
          import("../orders/orders.module").then(m => m.OrdersPageModule)
      },
      {
        path: "",
        redirectTo: "listings",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "app/listings",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
