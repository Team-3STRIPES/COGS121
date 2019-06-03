/*
 * This file contains all of the scripts that are necessary for the home page.
 * Various things such as button click event handlers are contained within here,
 * as well as more complex things like calling the back end scripts for
 * translations and updating information the database.
 */

$(document).ready(() => {

  let userID;
  let userInput;
  let finalMessage;
  let countDownTimer;
  const $inputBox = $('#left-text');
  const $outputBox = $('#right-text');

  // next set of 3 functions handles user input into the translation text box
  $('#left-text').on('input', () => {
    userInput = $inputBox.val();
  });

  $inputBox.on('keydown', () => {
    clearTimeout(countDownTimer);
  });

  $inputBox.on('keyup', () => {
    clearTimeout(countDownTimer);
    countDownTimer = setTimeout(requests, 500);
  });

  // displays the translation, assuming that the back end has already been pinged
  function displayTranslation() {
    if(finalMessage !== "\n") {
      $outputBox.css('color', '#111');
    } else {
      finalMessage = 'Translation';
      $outputBox.css('color', '#999');
    }
    $outputBox.val(finalMessage);
  }

  // bundle of functions that calls backend routes for detecting slang and getting definitions for them
  function requests() {
    reqDefinition();
    reqSlang();
  }

  // calls backend route to retrieve the translation of the phrase that the user typed in
  function reqDefinition() {

    // this handles the animation while waiting for a response from the backend
    let loadingMsg = 'Translating..';
    const maxTimes = 5;
    let curTimes = 0;
    let loading = setInterval(() => {
      $outputBox.css('color', '#999');
      $outputBox.val(`${loadingMsg}.`);
      if(curTimes === maxTimes) {
        loadingMsg = 'Translating..';
        curTimes = 0;
      } else {
        loadingMsg += ".";
        curTimes++;
      }
    }, 150);

    // ajax call to backend route to translate the user's input
    $.ajax({
      url: "/def",
      type: "GET",
      data: {
              def: userInput
            },
      success: (data, textStatus, jqXHR) => {
        finalMessage = data.def;
        clearInterval(loading);
        displayTranslation();

        // update the user's translation history
        firebase.firestore().collection('users').doc(userID).collection('history').doc(userInput).set({
          word: userInput,
          definition: data.def
        }, {merge: true});

      },
      error: (jqXHR, textStatus, errorThrown) => {

        // error
        let word = jqXHR.responseJSON.word;
        finalMessage = word;
        clearInterval(loading);
        displayTranslation();
      }
    });
  }

  // this function retrieves definitions of detected slang and displays them on the front end (pings Urban Dictionary if the word is not found already in the database)
  function updateDefinition(word) {
    $.ajax({
      url: "/new_word",
      type: "GET",
      data: {
              def: word
            },
      success: (data, textStatus, jqXHR) => {

        // update front-end to display definitions
        let $definition = $('.definition-section');
        if (data.def != "") {
          $definition.append(`<p class="definition"><span class="definition-term">${word} &mdash; </span>${data.def}</p>`);

          // update collection of words this user has seen
          firebase.firestore().collection('users').doc(userID).collection('words').doc(word).set({
            word: word,
            def: data.def
          });
        }
        else {
          firebase.firestore().collection('users').doc(userID).collection('words').doc(word).delete();
        }

      },
      error: (jqXHR, textStatus, errorThrown) => {

        // error
        return "";
      }
    });
  }

  // retrieves definitions of slang words to display underneath translation, and updates user's collection of words
  function addDefinition(words) {

    let $definition = $('.definition-section');
    for (let i = 0; i < words.length; i++) {

      // ping database for definitions
      firebase.firestore().collection('definition').where("word", "==", words[i])
        .get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {

          // add word to user's collection of words
          firebase.firestore().collection('users').doc(userID).collection('words').doc(doc.data().word).set({
            word: doc.data().word,
            def: doc.data().def
          })
          if (words.includes(doc.data().word)) {
            words[words.indexOf(doc.data().word)] = "";
          }

          // update front end to display definitions
          $definition.append(`<p class="definition"><span class="definition-term">${doc.data().word} &mdash; </span>${doc.data().def}</p>`);
        });
      });
    }
    return words;
  }

  // retrieves the slang words that were detected
  function reqSlang() {

    // call to back end route
    $.ajax({
      url: "/slang",
      type: "GET",
      data: {
              def: userInput,
            },
      success: (data, textStatus, jqXHR) => {

        //data.words is the words separated by '+'
        let words = data.words.trim().split("+");
        if (words.length > 0 && words[0] !== "") {
          for (let i = 0; i < words.length; i++) {
            if (words[i] == "") {
              break;
            }

            // add the word to the user's collection
            firebase.firestore().collection('users').doc(userID).collection('words').doc(words[i]).set({
              word: words[i]
            })
          }
        }

        // update definition in collection of definitions if does not exist
        $.when(addDefinition(words)).then((e) => {
          for (let i = 0; i < e.length; i++) {
            if (e[i] != "") {
              updateDefinition(e[i]);
            }
          }
        })

        // update the running total word count for this user
        firebase.firestore().collection('users').doc(userID).get().then((doc) => {
          let curWordCount = parseInt(doc.data().wordCount);
          curWordCount+= words.length;
          firebase.firestore().collection('users').doc(userID).set({
            wordCount: curWordCount
          });
        })
      },
      error: (jqXHR, textStatus, errorThrown) => {

        // error
      }
    });
  }

  // detect if user is signed in; must be authenticated to view this page
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      userID = user.uid;
      $('#signedout').css('display', 'none');
      $('#signedin').css('display', 'flex');
    } else {
      $('#signedin').css('display', 'none');
      $('#signedout').css('display', 'flex');
    }
  });

  // text-to-speech for the user's input
  $('#left-sound').click(() => {
     $.ajax({
      url: "/tts",
      type: "GET",
      data: {
              def: userInput,
            },
      success: (data, textStatus, jqXHR) => {
        new Audio(data.msg).play()
      },
      error: (jqXHR, textStatus, errorThrown) => {

        // error
      }
    });
  });

  // text-to-speech for the translation
  $('#right-sound').click(() => {
     $.ajax({
      url: "/tts",
      type: "GET",
      data: {
              def: finalMessage,
            },
      success: (data, textStatus, jqXHR) => {
        new Audio(data.msg).play()
      },
      error: (jqXHR, textStatus, errorThrown) => {

        // error
      }
    });
  });
});
