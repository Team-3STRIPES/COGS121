const firebaseConfig = {
      apiKey: "AIzaSyBjQZdC4RzK-EOz-f8-w34MEV68lRYPASs",
      authDomain: "cogs121-c88c5.firebaseapp.com",
      databaseURL: "https://cogs121-c88c5.firebaseio.com",
      projectId: "cogs121-c88c5",
      storageBucket: "cogs121-c88c5.appspot.com",
      messagingSenderId: "570075063656",
      appId: "1:570075063656:web:7631847ba177ded3"
    };

const serviceAccount = require('./sa.json');

const firestoreService = require('firestore-export-import');

const jsonToFirestore = async () => {
  try {
    console.log('Initialzing Firebase');
    await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL);
    console.log('Firebase Initialized');

    await firestoreService.restore('../twitter_data/definitions.json');
    console.log('Upload Success');
  }
  catch (error) {
    console.log(error);
  }
};


jsonToFirestore();

