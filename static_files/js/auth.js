/*
 * This file contains all of the scripts necessary for authentication. Our web
 * application uses Firebase for authentication, which is connected to Google.
 * Users can use our web application using their Google account. They can also
 * translate words without logging in.
*/

$(document).ready(() => {

  // login button handler
  $('#login').on('click', (e) => {

    // sign in with Google
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {

      // check if this is the first time has logged in, i.e. account creation
      firebase.firestore().collection('users').doc(user.uid).get().then((doc) => {
        if(!doc.data()) createUserDoc(user.uid);
      });

      // css updates for nav bar once user is logged in
      $('#signedout').css('display', 'none');
      $('#signedin').css('display', 'flex');
    }).catch(function(error) {

      // error
    });
  });

  // sign out button handler
  $('#signout').on('click', (e) => {

    // sign out with Firebase auth API
    firebase.auth().signOut().then(function() {

      // css updates once user has logged out
      $('#signedin').css('display', 'none');
      $('#signedout').css('display', 'flex');
    }).catch(function(error) {

      // error
    });
  });

  // creates a new document for this user in Firestore
  function createUserDoc(id) {
    firebase.firestore().collection('users').doc(id).set({
      wordCount: 0
    })
  }
});
