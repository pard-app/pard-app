import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PhotoService } from "../../../@features/services/photo.service";
import { DataService } from "../../../@features/services/data.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-create",
  templateUrl: "./create.page.html",
  styleUrls: ["./create.page.scss"],
})
export class CreatePage implements OnInit {
  listingForm: FormGroup;
  image: any;
  uploadInProgress: boolean = false;
  constructor(
    private photoService: PhotoService,
    private data: DataService,
    private router: Router,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {
    this.listingForm = new FormGroup({
      title: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      price: new FormControl("", Validators.required),
      // stock: new FormControl(1, [Validators.required]),
      published: new FormControl(true),
    });
  }

  async createListing() {
    const loading = await this.loadingController.create({
      message: this.translate.instant("PLEASE_WAIT"),
    });
    await loading.present();
    this.data
      .createListing(this.listingForm.value, this.image)
      .then(() => {
        this.router.navigate(["app/listings"]);

        this.listingForm.reset();
        loading.dismiss();
      })
      .catch((err) => {
        loading.dismiss();
        alert(err.message);
      });
  }

  async selectImage(event: any) {
    this.uploadInProgress = true;

    await this.photoService
      .getImageUrl(event.target.files[0], 1000)
      .then((image) => {
        this.data.uploadImage(image).then((final) => {
          this.uploadInProgress = false;
          this.image = final;
        });
      });
  }

  ngOnInit() {}
}
