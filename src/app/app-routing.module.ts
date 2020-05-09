import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  AngularFireAuthGuard
} from "@angular/fire/auth-guard";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["login"]);
const redirectLoggedInToItems = () => redirectLoggedInTo(["app/listings"]);

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./pages/welcome/welcome.module").then(m => m.WelcomePageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems }
  },
  {
    path: "app",
    loadChildren: () =>
      import("./pages/tabs/tabs.module").then(m => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/auth/login/login.module").then(m => m.LoginPageModule)
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/auth/register/register.module").then(
        m => m.RegisterPageModule
      )
  },
  {
    path: "forgot",
    loadChildren: () =>
      import("./pages/auth/forgot/forgot.module").then(m => m.ForgotPageModule)
  },
  {
    path: "tutorial",
    loadChildren: () =>
      import("./pages/tutorial/tutorial.module").then(m => m.TutorialPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
