const firebaseConfig = {
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
