var Filter = require('bad-words');
var definitions = require('../twitter_data/definitions.json')
var fs = require('fs');



let filter = new Filter();


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

    await firestoreService.restore('../twitter_data/definitions5.json');
    console.log('Upload Success');
  }
  catch (error) {
    console.log(error);
  }
};


let censor = () => {
  let filter = new Filter();
  for (let i = 0; i < definitions['definition'].length; i++) {
    definitions['definition'][i]['def'] = filter.clean(definitions['definition'][i]['def'])
  }
  var jsonData = JSON.stringify(definitions);
  fs.writeFile("../twitter_data/definitions5.json", jsonData, function(err) {
    if (err) {
        console.log(err);
    }
  });
}

//console.log(filter.clean("what the fuck"));
//censor();
jsonToFirestore();
