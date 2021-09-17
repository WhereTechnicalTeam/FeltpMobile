import * as firebase from 'firebase/app'
// import "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyAUS64Z_pUHVahjRyY1KqZCge2BGVfqyTE',
  authDomain: 'rn-firebase-todo-d3c6c.firebaseapp.com',
  // databaseURL: 'https://rn-firebase-todo-d3c6c.firebaseio.com',
  projectId: 'rn-firebase-todo-d3c6c',
  // storageBucket: 'rn-firebase-todo-d3c6c.appspot.com',
  // messagingSenderId: '222561225701',
  appId: '1:222561225701:android:6133e0e85cee743fe13d0c',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db, firebase };