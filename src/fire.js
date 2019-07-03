import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCvwzJyyTRFCNF8mt2Om1lPolweWoNkNRU",
    authDomain: "green-flights.firebaseapp.com",
    databaseURL: "https://green-flights.firebaseio.com",
    projectId: "green-flights",
    storageBucket: "green-flights.appspot.com",
    messagingSenderId: "913693404042",
    appId: "1:913693404042:web:f326bd05449d7cf2"
  };
var fire = firebase.initializeApp(firebaseConfig);
export default fire;