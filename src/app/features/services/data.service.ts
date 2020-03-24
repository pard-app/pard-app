import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ListingModel } from "../models/listing.model";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireStorage } from "@angular/fire/storage";
import { VendorModel } from "../models/vendor.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage
  ) {}

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  getMyListings() {
    return this.afStore
      .collection<ListingModel>("listings", ref =>
        ref
          .where("vendor", "==", `${this.afAuth.auth.currentUser.uid}`)
          .orderBy("date", "desc")
      )
      .valueChanges({ idField: "id" });
  }

  async createListing(listing: ListingModel, image?: any): Promise<any> {
    return this.afStore.collection<ListingModel>("listings").add({
      vendor: this.afAuth.auth.currentUser.uid,
      date: new Date().getTime(),
      image: image ? image : "",
      ...listing
    });
  }

  async deleteListing(listing: ListingModel) {
    return this.afStore
      .collection("listings")
      .doc(listing.id)
      .delete();
  }

  async publishListing(listing: ListingModel, action: boolean) {
    return this.afStore
      .collection("listings")
      .doc<ListingModel>(listing.id)
      .update({ published: action });
  }

  // https://stackoverflow.com/questions/58977241/how-to-get-the-resized-downloadurl-after-upload-with-firebase-storage-web-sdk

  delay(t, v?) {
    return new Promise(function(resolve) {
      setTimeout(resolve.bind(null, v), t);
    });
  }

  keepTrying(triesRemaining, storageRef) {
    if (triesRemaining < 0) {
      return Promise.reject("out of tries");
    }

    return this.afStorage
      .ref(storageRef)
      .getDownloadURL()
      .toPromise()
      .then(url => {
        return url;
      })
      .catch(error => {
        switch (error.code) {
          case "storage/object-not-found":
            return this.delay(2000).then(() => {
              return this.keepTrying(triesRemaining - 1, storageRef);
            });
          default:
            console.log(error);
            return Promise.reject(error);
        }
      });
  }

  async uploadImage(image: any) {
    const id = this.uuidv4();
    const ref = `listings/${this.afAuth.auth.currentUser.uid}/${id}`;
    const resized = `listings/${this.afAuth.auth.currentUser.uid}/${id}_500x500`;

    return this.afStorage
      .ref(ref)
      .putString(image, "data_url")
      .then(() => {
        return this.keepTrying(15, resized).then(url => {
          return url;
        });
      });
  }

  getMyProfile() {
    return this.afStore
      .collection("vendors")
      .doc<VendorModel>(this.afAuth.auth.currentUser.uid)
      .valueChanges();
  }
}
