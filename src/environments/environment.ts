// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
    production: false,
    // firebase: {
    //   apiKey: "AIzaSyD9nUUR3U6sbOmJygwSOpCutTJybO_qEyY",
    //   authDomain: "pard-dev.firebaseapp.com",
    //   databaseURL: "https://pard-dev.firebaseio.com",
    //   projectId: "pard-dev",
    //   storageBucket: "pard-dev.appspot.com",
    //   messagingSenderId: "796248555901",
    //   appId: "1:796248555901:web:3804e973110dafadd04c14",
    //   gs: "gs://pard-dev.appspot.com",
    //   measurementId: "G-EV5CHRKTHM"
    // }
    firebase: {
        apiKey: "AIzaSyBcDFmnE_2GGgrJwFCRI_Sz5x_7ktjOp9k",
        authDomain: "pard-app.firebaseapp.com",
        databaseURL: "https://pard-app.firebaseio.com",
        projectId: "pard-app",
        storageBucket: "pard-app.appspot.com",
        messagingSenderId: "146692342733",
        appId: "1:146692342733:web:79f9e4aa3ae4a36380fa84",
        measurementId: "G-2TXL7TZE0M",
        gs: "gs://pard-app.appspot.com",
    },
    stripeConfig: {
        clientId: "ca_HILhZG81aT4uMmUH1AulxZh5wmmP7jGF",
    },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
