import * as firebase from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {

    apiKey: "AIzaSyC7SWtfLHWbsR5oyg7uq6pBafiiJZMcZW8",
  
    authDomain: "instagram-clone-fe7b7.firebaseapp.com",
  
    projectId: "instagram-clone-fe7b7",
  
    storageBucket: "instagram-clone-fe7b7.appspot.com",
  
    messagingSenderId: "877418903138",
  
    appId: "1:877418903138:web:ffa2b078bf9528e81e433b",
  
    measurementId: "G-HM55QM44S6"
  
};

let app;
if(firebase.getApps().length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.getApp()
}

const auth = getAuth(app)

export { auth }