/* This file contains all of the scripts necessary for the profile page.
 * Some functionalities include various button click handlers. This also pings
 * the database to retrieve information about the user, such as their word
 * count, their level, and their translation history.
 */

$(document).ready(() => {

  // arbitrary cutoffs for levels
  const iron = 0;
  const bronze = 10;
  const silver = 50;
  const gold = 100;
  const platinum = 250;
  const diamond = 500;

  // check if user is logged in; must be authenticated to view this page
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

      // determine if they have enough words to take a test (>10)
      firebase.firestore().collection('users').doc(user.uid).collection('words').get().then((querySnapshot) => {
        let numWords = 0;
        querySnapshot.forEach((doc) => {
          numWords++;
        });

        // disable testing functionality if they do not have enough words
        if(numWords < 10) {
          $('#test-button').attr('href', '#');
          $('#test-button').on('mouseenter', (e) => {
            $('#test-button').css('cursor', 'not-allowed');
          });
          $('#test-button').on('click', (e) => {
            alert("You must have more than 10 words translated to use this function!");
          });
        }
      });

      // set profile information
      $('.profile-name').first().text(user.displayName);
      let userRef = firebase.firestore().collection('users').doc(user.uid);
      userRef.get().then((doc) => {
        let wordCount = doc.data().wordCount;
        if(!wordCount) {
          firebase.database().ref('/users/' + user.uid).set({
            wordCount: 0
          });
          wordCount = 0;
        }
        let level;

        // determine user's level
        if(wordCount < bronze) level = "Iron";
        else if(wordCount < silver) level = "Bronze";
        else if(wordCount < gold) level = "Silver";
        else if(wordCount < platinum) level = "Gold";
        else if(wordCount < diamond) level = "Platinum";
        else level = "Diamond";

        $('#profile-level').text(level);
        let $star = $('.fa-star').first();

        // set star color
        switch(level) {
          case "Iron":
            $star.css('color', '#726358');
            break;
          case "Bronze":
            $star.css('color', '#9b5726');
            break;
          case "Silver":
            $star.css('color', '#cccccc');
            break;
          case "Gold":
            $star.css('color', '#edc62d');
            break;
          case "Platinum":
            $star.css('color', '#bed8db');
            break;
          case "Diamond":
            $star.css('color', '#72d9e5');
            break;
          default:
            // something broke if it goes here
            break;
        }
      });

      // set history
      let $history = $('#history-list');
      userRef.collection('history').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          $history.append(`<li><span class="term">${doc.data().word}</span> &mdash; <span class="term-def">${doc.data().definition}</span></li>`);
        })
      })
    } else {

      // kick user back to home page if not authenticated
      window.location.href = "home.html";
    }
  });
});
