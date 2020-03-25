import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { LoadingController } from "@ionic/angular";
import { DataService } from "src/app/features/services/data.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"]
})
export class EditPage implements OnInit {
  editForm: FormGroup;
  logo: any;
  logoChanged: boolean = false;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private loadingController: LoadingController,
    private data: DataService
  ) {
    this.editForm = new FormGroup({
      city: new FormControl(),
      address: new FormControl(),
      company: new FormControl(),
      description: new FormControl(),
      phone: new FormControl(),
      bank: new FormControl(),
      regno: new FormControl(),
      delivery: new FormControl(),
      delivery_costs: new FormControl(),
      delivery_note: new FormControl()
    });
  }

  async save() {
    const loading = await this.loadingController.create({
      message: this.translate.instant("PLEASE_WAIT")
    });

    await loading.present();

    if (this.logoChanged && this.logo) {
      this.afStorage
        .upload(`vendors/${this.afAuth.auth.currentUser.uid}`, this.logo)
        .then(image => {
          image.ref.getDownloadURL().then(imageUrl => {
            this.afStore
              .doc(`vendors/${this.afAuth.auth.currentUser.uid}`)
              .update({
                ...this.editForm.value,
                image: imageUrl
              });
            loading.dismiss();
            this.router.navigate(["app/profile"]);
          });
        });
    } else {
      this.afStore.doc(`vendors/${this.afAuth.auth.currentUser.uid}`).update({
        ...this.editForm.value
      });
      loading.dismiss();
      this.router.navigate(["app/profile"]);
    }
  }

  selectImage(event: any) {
    this.logoChanged = true;
    this.logo = event.target.files[0];
  }

  ngOnInit() {
    this.data
      .getMyProfile()
      .pipe(take(1))
      .toPromise()
      .then(data => {
        this.logo = data.image;
        this.editForm = new FormGroup({
          city: new FormControl(data.city),
          address: new FormControl(data.address),
          company: new FormControl(data.company),
          description: new FormControl(data.description),
          phone: new FormControl(data.phone),
          bank: new FormControl(data.bank),
          regno: new FormControl(data.regno),
          delivery: new FormControl(data.delivery),
          delivery_costs: new FormControl(data.delivery_costs),
          delivery_note: new FormControl(data.delivery_note)
        });
      });
  }
}
