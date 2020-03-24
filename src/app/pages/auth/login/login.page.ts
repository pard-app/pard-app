import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private afAuth: AngularFireAuth,
    private loadingController: LoadingController
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      )
    });
  }

  async login() {
    const loading = await this.loadingController.create({
      message: this.translate.instant("PLEASE_WAIT")
    });
    await loading.present();

    this.afAuth.auth
      .signInWithEmailAndPassword(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      .then(loggedin => {
        if (loggedin) {
          this.router.navigate(["app/listings"]);
        }
        loading.dismiss();
      })
      .catch(err => {
        alert(err.message);
        loading.dismiss();
      });
  }

  ngOnInit() {}
}
