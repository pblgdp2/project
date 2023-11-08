import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvK-QbsqLjXV9fz8FlOGeBQUSDx-_qNQY",
  authDomain: "project-blog-bf120.firebaseapp.com",
  projectId: "project-blog-bf120",
  storageBucket: "project-blog-bf120.appspot.com",
  messagingSenderId: "979591801281",
  appId: "1:979591801281:web:e39c885b8c983308b62740"
};

export default {
  app: firebase.initializeApp(firebaseConfig).firestore(),
  firebase,
};
