$(document).ready(() => {

  $('#login').on('click', (e) => {

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      $('#signedout').css('display', 'none');
      $('#signedin').css('display', 'flex');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  });

  $('#signout').on('click', (e) => {
    firebase.auth().signOut().then(function() {
      $('#signedin').css('display', 'none');
      $('#signedout').css('display', 'flex');
    }).catch(function(error) {
      // An error happened.
    });
  });

});