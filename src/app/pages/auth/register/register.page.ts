import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { LoadingController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { GoogleMap } from "@angular/google-maps";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  countries: Array<any>;
  logo: any;
  mapOptions: google.maps.MapOptions = {
    zoom: 15,
    disableDefaultUI: true,
    scrollwheel: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(56.951624, 24.113369),
  };
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  location: { lat: number; lng: number };
  service: google.maps.places.PlacesService;
  marker: google.maps.Marker;
  mapIdle: boolean = false;

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
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
      title: new FormControl("", Validators.required),
      description: new FormControl(),
      country: new FormControl("", Validators.required),
      city: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      company: new FormControl(),
      phone: new FormControl("", Validators.required),
      bank: new FormControl(),
      regno: new FormControl(),
      delivery: new FormControl(),
      delivery_costs: new FormControl(),
      delivery_note: new FormControl(),
      terms: new FormControl(false, Validators.requiredTrue),
    });

    this.countries = ["Lithuania", "Latvia"];
  }

  async register() {
    const loading = await this.loadingController.create({
      message: this.translate.instant("PLEASE_WAIT"),
    });
    await loading.present();

    const formData = {
      email: this.registerForm.value.email,
      title: this.registerForm.value.title,
      description: this.registerForm.value.description,
      country: this.registerForm.value.country,
      city: this.registerForm.value.city,
      address: this.registerForm.value.address,
      company: this.registerForm.value.company,
      phone: this.registerForm.value.phone,
      bank: this.registerForm.value.bank,
      regno: this.registerForm.value.regno,
      delivery: this.registerForm.value.delivery,
      delivery_costs: this.registerForm.value.delivery_costs,
      delivery_note: this.registerForm.value.delivery_note,
      registered: new Date().getTime(),
    };

    this.afAuth.auth
      .createUserWithEmailAndPassword(
        this.registerForm.value.email,
        this.registerForm.value.password
      )
      .then((data) => {
        if (this.logo) {
          this.afStorage
            .upload(`vendors/${data.user.uid}`, this.logo)
            .then((image) => {
              image.ref.getDownloadURL().then((imageUrl) => {
                this.afStore.doc(`vendors/${data.user.uid}`).set({
                  ...formData,
                  image: imageUrl,
                  _geoloc: this.location,
                });
                loading.dismiss();
                this.router.navigate(["tutorial"]);
              });
            });
        } else {
          this.afStore.doc(`vendors/${data.user.uid}`).set({
            ...formData,
            _geoloc: this.location,
          });
          loading.dismiss();
          this.router.navigate(["tutorial"]);
        }
      })
      .catch((err) => {
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

  async findPlace() {
    if (!this.service) {
      this.service = new google.maps.places.PlacesService(
        this.map.data.getMap()
      );
    }

    const req = {
      query: `${
        this.registerForm.value.title
          ? this.registerForm.value.title + ", "
          : ""
      }${
        this.registerForm.value.address
          ? this.registerForm.value.address + ", "
          : ""
      }${
        this.registerForm.value.city ? this.registerForm.value.city + ", " : ""
      }${this.registerForm.value.country}`,
      fields: ["name", "geometry"],
    };

    console.log(req);

    this.service.findPlaceFromQuery(req, (results, status) => {
      console.log(results);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        this.setMarker();
      }
    });
  }

  resizeMap() {
    if (!this.mapIdle) {
      // Fix for maps appearing to be greyed out if not loaded in viewport.
      document.getElementById("google-map").style.height = "200px";
    }
    this.mapIdle = true;
  }

  private setMarker() {
    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: this.location,
      animation: google.maps.Animation.DROP,
    });

    this.marker.setMap(this.map.data.getMap());
    this.map.data.getMap().panTo(this.location);
    this.map.data.getMap().setCenter(this.location);
  }

  ngOnInit() {}
}
