import { initializeApp } from '@firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBP6uOSTfEFv6ZOT2A7WhUB5pG0Wn0cmbw",
    authDomain: "demoproject-learning.firebaseapp.com",
    databaseURL: "https://demoproject-learning-default-rtdb.firebaseio.com",
    projectId: "demoproject-learning",
    storageBucket: "demoproject-learning.appspot.com",
    messagingSenderId: "477894541355",
    appId: "1:477894541355:web:2267ac4ff4b09172876a6e"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };