import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { LoadingController } from "@ionic/angular";
import { DataService } from "../../../@features/services/data.service";
import { take } from "rxjs/operators";
import { Plugins } from "@capacitor/core";
import { GoogleMap } from "@angular/google-maps";
const { Geolocation } = Plugins;
@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"],
})
export class EditPage implements OnInit, OnDestroy {
  editForm: FormGroup;
  logo: any;
  logoChanged: boolean = false;
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
    private loadingController: LoadingController,
    private data: DataService
  ) {
    this.editForm = new FormGroup({
      title: new FormControl(),
      city: new FormControl(),
      address: new FormControl(),
      company: new FormControl(),
      description: new FormControl(),
      phone: new FormControl(),
      bank: new FormControl(),
      regno: new FormControl(),
      delivery: new FormControl(),
      delivery_costs: new FormControl(),
      delivery_note: new FormControl(),
      country: new FormControl(),
    });
  }

  async save() {
    const loading = await this.loadingController.create({
      message: this.translate.instant("PLEASE_WAIT"),
    });

    await loading.present();

    if (this.logoChanged && this.logo) {
      this.afStorage
        .upload(`vendors/${this.afAuth.auth.currentUser.uid}`, this.logo)
        .then((image) => {
          image.ref.getDownloadURL().then((imageUrl) => {
            this.afStore
              .doc(`vendors/${this.afAuth.auth.currentUser.uid}`)
              .update({
                ...this.editForm.value,
                image: imageUrl,
                _geoloc: this.location ? this.location : null,
              });
            loading.dismiss();
            this.router.navigate(["app/profile"]);
          });
        });
    } else {
      this.afStore.doc(`vendors/${this.afAuth.auth.currentUser.uid}`).update({
        ...this.editForm.value,
        _geoloc: this.location ? this.location : null,
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
      .then((data) => {
        this.logo = data.image;
        this.editForm = new FormGroup({
          title: new FormControl(data.title, Validators.required),
          city: new FormControl(data.city, Validators.required),
          address: new FormControl(data.address, Validators.required),
          company: new FormControl(data.company),
          description: new FormControl(data.description),
          phone: new FormControl(data.phone, Validators.required),
          bank: new FormControl(data.bank),
          regno: new FormControl(data.regno),
          delivery: new FormControl(data.delivery),
          delivery_costs: new FormControl(data.delivery_costs),
          delivery_note: new FormControl(data.delivery_note),
          country: new FormControl(data.country),
        });

        if (data._geoloc) {
          this.location = data._geoloc;

          this.setMarker();
        }
      });
  }

  resizeMap() {
    if (!this.mapIdle) {
      // Fix for maps appearing to be greyed out if not loaded in viewport.
      document.getElementById("google-map-edit").style.height = "200px";
    }
    this.mapIdle = true;
  }

  geolocate() {
    Geolocation.getCurrentPosition()
      .then((position) => {
        this.location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.setMarker();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async findPlace() {
    this.service = new google.maps.places.PlacesService(this.map.data.getMap());

    const req = {
      query: `${this.editForm.value.title}, ${this.editForm.value.address}, ${this.editForm.value.city}, ${this.editForm.value.country}`,
      fields: ["name", "geometry"],
    };

    this.service.findPlaceFromQuery(req, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        this.setMarker();
      }
    });
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

  ngOnDestroy() {
    this.mapIdle = false;
  }
}
