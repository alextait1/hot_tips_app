import firebase from 'firebase';

// Initialize Firebase
  const config = {
    apiKey: "AIzaSyBZzPulA4iwE0BrD4EUZ8_UwkVtCMc94kg",
    authDomain: "ready-set-c35e4.firebaseapp.com",
    databaseURL: "https://ready-set-c35e4.firebaseio.com",
    projectId: "ready-set-c35e4",
    storageBucket: "",
    messagingSenderId: "532452386335"
  };

  firebase.initializeApp(config);

  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();

  export default firebase;