import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "app",
    loadChildren: () =>
      import("./pages/tabs/tabs.module").then(m => m.TabsPageModule)
  },
  {
    path: "",
    loadChildren: () =>
      import("./pages/welcome/welcome.module").then(m => m.WelcomePageModule)
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/auth/login/login.module").then(m => m.LoginPageModule)
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./pages/auth/signup/signup.module").then(m => m.SignupPageModule)
  },
  {
    path: "forgot",
    loadChildren: () =>
      import("./pages/auth/forgot/forgot.module").then(m => m.ForgotPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
