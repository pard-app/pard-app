import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.page.html",
  styleUrls: ["./forgot.page.scss"]
})
export class ForgotPage implements OnInit {
  forgotForm: FormGroup;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private afAuth: AngularFireAuth,
    private loadingController: LoadingController
  ) {
    this.forgotForm = new FormGroup({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      )
    });
  }

  async forgot() {
    const loading = await this.loadingController.create({
      message: this.translate.instant("PLEASE_WAIT")
    });
    await loading.present();

    this.afAuth.auth
      .sendPasswordResetEmail(this.forgotForm.value.email)
      .then(() => {
        this.router.navigate(["/login"]);
        loading.dismiss();
      })
      .catch(err => {
        alert(err.message);
        loading.dismiss();
      });
  }

  ngOnInit() {}
}
