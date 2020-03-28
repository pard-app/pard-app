// Import all needed modules.
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Set up Firestore.
admin.initializeApp();
const db = admin.firestore();
const algoliasearch = require("algoliasearch");

// Set up Algolia.
const algoliaClient = algoliasearch(
  functions.config().algolia.appid,
  functions.config().algolia.apikey
);

// Create a HTTP request cloud function.
export const sendListingsToAlgolia = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    // This array will contain all records to be indexed in Algolia.
    // A record does not need to necessarily contain all properties of the Firestore document,
    // only the relevant ones.
    const algoliaRecords: any[] = [];
    const collectionIndex = algoliaClient.initIndex("listings");

    // Retrieve all documents from the COLLECTION collection.
    const querySnapshot = await db.collection("listings").get();

    querySnapshot.docs.forEach(doc => {
      const document = doc.data();
      // Essentially, you want your records to contain any information that facilitates search,
      // display, filtering, or relevance. Otherwise, you can leave it out.
      const record = {
        objectID: doc.id,
        date: document.date,
        image: document.image,
        description: document.description,
        price: document.price,
        stock: document.stock,
        title: document.title,
        vendor: document.vendor
      };
      if (document.published) {
        algoliaRecords.push(record);
      }
    });

    // After all records are created, we save them to
    collectionIndex.saveObjects(algoliaRecords, (_error: any, content: any) => {
      res.status(200).send("Listings were indexed to Algolia successfully.");
    });
  });

export const sendVendorsToAlgolia = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    // This array will contain all records to be indexed in Algolia.
    // A record does not need to necessarily contain all properties of the Firestore document,
    // only the relevant ones.
    const algoliaRecords: any[] = [];
    const collectionIndex = algoliaClient.initIndex("vendors");

    // Retrieve all documents from the COLLECTION collection.
    const querySnapshot = await db.collection("vendors").get();

    querySnapshot.docs.forEach(doc => {
      const document = doc.data();
      // Essentially, you want your records to contain any information that facilitates search,
      // display, filtering, or relevance. Otherwise, you can leave it out.
      const record = {
        objectID: doc.id,
        address: document.address,
        bank: document.bank,
        company: document.company,
        country: document.country,
        delivery: document.delivery,
        delivery_costs: document.delivery_costs,
        delivery_note: document.delivery_note,
        description: document.description,
        email: document.email,
        image: document.image,
        phone: document.phone,
        registered: document.registered,
        regno: document.regno,
        title: document.title
      };

      algoliaRecords.push(record);
    });

    // After all records are created, we save them to
    collectionIndex.saveObjects(algoliaRecords, (_error: any, content: any) => {
      res.status(200).send("Vendors were indexed to Algolia successfully.");
    });
  });

export const vendorOnCreate = functions
  .region("europe-west1")
  .firestore.document("vendors/{uid}")
  .onCreate(async (snapshot, context) => {
    await saveVendorInAlgolia(snapshot);
  });

export const vendorOnUpdate = functions
  .region("europe-west1")
  .firestore.document("vendors/{uid}")
  .onUpdate(async (change, context) => {
    await updateVendorInAlgolia(change);
  });

export const vendorOnDelete = functions
  .region("europe-west1")
  .firestore.document("vendors/{uid}")
  .onDelete(async (snapshot, context) => {
    await deleteVendorFromAlgolia(snapshot);
  });

export const listingOnCreate = functions
  .region("europe-west1")
  .firestore.document("listings/{uid}")
  .onCreate(async (snapshot, context) => {
    await saveListingInAlgolia(snapshot);
  });

export const listingOnUpdate = functions
  .region("europe-west1")
  .firestore.document("listings/{uid}")
  .onUpdate(async (change, context) => {
    await updateListingInAlgolia(change);
  });

export const listingOnDelete = functions
  .region("europe-west1")
  .firestore.document("listings/{uid}")
  .onDelete(async (snapshot, context) => {
    await deleteListingFromAlgolia(snapshot);
  });

async function saveVendorInAlgolia(snapshot: any) {
  const collectionIndex = algoliaClient.initIndex("vendors");
  if (snapshot.exists) {
    const record = snapshot.data();
    if (record) {
      record.objectID = snapshot.id;
      await collectionIndex.saveObject(record);
    }
  }
}

async function updateVendorInAlgolia(change: any) {
  const docBeforeChange = change.before.data();
  const docAfterChange = change.after.data();
  if (docBeforeChange && docAfterChange) {
    await saveVendorInAlgolia(change.after);
  }
}

async function deleteVendorFromAlgolia(snapshot: any) {
  const collectionIndex = algoliaClient.initIndex("vendors");
  if (snapshot.exists) {
    const objectID = snapshot.id;
    await collectionIndex.deleteObject(objectID);
  }
}

async function saveListingInAlgolia(snapshot: any) {
  const collectionIndex = algoliaClient.initIndex("listings");
  if (snapshot.exists) {
    const record = snapshot.data();
    if (record && record.published) {
      record.objectID = snapshot.id;
      await collectionIndex.saveObject(record);
    }
  }
}

async function updateListingInAlgolia(change: any) {
  const docBeforeChange = change.before.data();
  const docAfterChange = change.after.data();
  if (docBeforeChange && docAfterChange) {
    if (!docAfterChange.published && docBeforeChange.published) {
      await deleteListingFromAlgolia(change.after);
    } else if (docAfterChange.published) {
      await saveListingInAlgolia(change.after);
    }
  }
}

async function deleteListingFromAlgolia(snapshot: any) {
  const collectionIndex = algoliaClient.initIndex("listings");
  if (snapshot.exists) {
    const objectID = snapshot.id;
    await collectionIndex.deleteObject(objectID);
  }
}

/*
 * The clearData function removes personal data from the RealTime Database,
 * Storage, and Firestore. It waits for all deletions to complete, and then
 * returns a success message.
 */
export const clearData = functions
  .region("europe-west1")
  .auth.user()
  .onDelete(async user => {
    const { uid } = user;
    await deleteFirebaseData(uid);
  });

const deleteFirebaseData = async (uid: string) => {
  if (uid) {
    console.log("Deleting data for user: " + uid);

    await db
      .collection("vendors")
      .doc(uid)
      .delete();

    const listings = await db
      .collection("listings")
      .where("vendor", "==", uid)
      .get();
    const batch = db.batch();

    listings.forEach(doc => {
      console.log("Deleting " + doc.ref.id);
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log("Deleted all listings for user: " + uid);

    const bucket = admin.storage().bucket();

    return bucket.deleteFiles({
      prefix: `listings/${uid}`
    });
  }
};

// New order e-mails
const sendgridemail = require("@sendgrid/mail");
sendgridemail.setApiKey(functions.config().sendgrid.apikey);

export const newOrderEmail = functions
  .region("europe-west1")
  .firestore.document("orders/{orderID}") // any write to this node will trigger email
  .onCreate(async (event, context) => {
    await event.ref.get().then(orderDoc => {
      const order = orderDoc.data();
      if (order && order.vendor) {
        return db
          .collection("vendors")
          .doc(order.vendor)
          .get()
          .then(vendorDoc => {
            const vendor = vendorDoc.data();
            if (vendor && vendor.email) {
              const msg = {
                to: vendor.email,
                from: "noreply@pard.app",
                subject: "New order in pard.app!",
                templateId: "d-148343972117401ba415ad9eab113368",
                substitutionWrappers: ["{{", "}}"],
                substitutions: {
                  name: order.name,
                  address: order.address,
                  comments: order.comments,
                  email: order.email,
                  phone: order.phone,
                  sum: order.sum,
                  orderNumber: order.orderNumber
                }
              };
              return sendgridemail
                .send(msg)
                .then(() => {
                  console.log("New order e-mail sent to: " + vendor.email);
                })
                .catch((err: any) => console.log(err));
            }
          });
      } else {
        console.log("Failed to send new order e-mail.");
        return;
      }
    });
  });
