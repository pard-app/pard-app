import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { LoadingController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  countries: Array<any>;
  logo: any;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private loadingController: LoadingController
  ) {
    this.registerForm = new FormGroup({
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
      ),
      country: new FormControl("Lithuania", Validators.required),
      city: new FormControl(),
      address: new FormControl(),
      location: new FormControl(),
      company: new FormControl(),
      description: new FormControl(),
      phone: new FormControl(),
      bank: new FormControl(),
      regno: new FormControl(),
      delivery: new FormControl(),
      delivery_costs: new FormControl(),
      delivery_note: new FormControl(),
      terms: new FormControl(false, Validators.requiredTrue)
    });

    this.countries = ["Lithuania", "Latvia"];
  }

  async register() {
    const loading = await this.loadingController.create({
      message: this.translate.instant("PLEASE_WAIT")
    });
    await loading.present();

    const formData = {
      email: this.registerForm.value.email,
      country: this.registerForm.value.country,
      city: this.registerForm.value.city,
      address: this.registerForm.value.address,
      company: this.registerForm.value.company,
      description: this.registerForm.value.description,
      phone: this.registerForm.value.phone,
      bank: this.registerForm.value.bank,
      regno: this.registerForm.value.regno,
      delivery: this.registerForm.value.delivery,
      delivery_costs: this.registerForm.value.delivery_costs,
      delivery_note: this.registerForm.value.delivery_note,
      registered: new Date().getTime()
    };

    this.afAuth.auth
      .createUserWithEmailAndPassword(
        this.registerForm.value.email,
        this.registerForm.value.password
      )
      .then(data => {
        if (this.logo) {
          this.afStorage
            .upload(`vendors/${data.user.uid}`, this.logo)
            .then(image => {
              image.ref.getDownloadURL().then(imageUrl => {
                this.afStore.doc(`vendors/${data.user.uid}`).set({
                  ...formData,
                  image: imageUrl
                });
                loading.dismiss();
                this.router.navigate(["app/listings"]);
              });
            });
        } else {
          this.afStore.doc(`vendors/${data.user.uid}`).set({
            ...formData
          });
          loading.dismiss();
          this.router.navigate(["app/listings"]);
        }
      })
      .catch(err => {
        loading.dismiss();
        alert(err.message);
      });
  }

  selectImage(event: any) {
    this.logo = event.target.files[0];
  }

  setLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {}
}
