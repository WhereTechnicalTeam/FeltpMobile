import * as firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAUS64Z_pUHVahjRyY1KqZCge2BGVfqyTE',
  authDomain: 'your-auth-domain-b1234.firebaseapp.com',
  databaseURL: 'https://rn-firebase-todo-d3c6c.firebaseio.com',
  projectId: 'rn-firebase-todo-d3c6c',
  storageBucket: 'rn-firebase-todo-d3c6c.appspot.com',
  messagingSenderId: '12345-insert-yourse',
  appId: '1:222561225701:android:6133e0e85cee743fe13d0c',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };