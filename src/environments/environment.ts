// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBcDFmnE_2GGgrJwFCRI_Sz5x_7ktjOp9k",
    authDomain: "pard-app.firebaseapp.com",
    databaseURL: "https://pard-app.firebaseio.com",
    projectId: "pard-app",
    storageBucket: "pard-app.appspot.com",
    messagingSenderId: "146692342733",
    appId: "1:146692342733:web:8441318822dc983f80fa84",
    measurementId: "G-DB639S9E3J",
    gs: "gs://pard-app.appspot.com"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
