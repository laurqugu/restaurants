import firebase from 'firebase/app'
import 'firebase/firestore'
  
const firebaseConfig = {
apiKey: "AIzaSyDhPpz0MlMm5ckiqSgDZWE57fgU_JfjMQA",
authDomain: "restaurants-e4e86.firebaseapp.com",
projectId: "restaurants-e4e86",
storageBucket: "restaurants-e4e86.appspot.com",
messagingSenderId: "300186241534",
appId: "1:300186241534:web:d0816c454cf4f0ba4898af"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig)
