import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ListingModel } from "../models/listing.model";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireStorage } from "@angular/fire/storage";

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
    if (image) {
      return this.afStorage
        .ref(`listings/${this.afAuth.auth.currentUser.uid}/${this.uuidv4()}`)
        .putString(image, "data_url")
        .then(data => {
          data.ref.getDownloadURL().then(imageUrl => {
            this.afStore.collection<ListingModel>("listings").add({
              vendor: this.afAuth.auth.currentUser.uid,
              date: new Date().getTime(),
              image: imageUrl,
              ...listing
            });
          });
        });
    } else {
      return this.afStore.collection<ListingModel>("listings").add({
        vendor: this.afAuth.auth.currentUser.uid,
        date: new Date().getTime(),
        ...listing
      });
    }
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
    const resized = `listings/${this.afAuth.auth.currentUser.uid}/${id}_300x300`;

    return this.afStorage
      .ref(ref)
      .putString(image, "data_url")
      .then(() => {
        return this.keepTrying(10, resized).then(url => {
          return url;
        });
      });
  }
}
