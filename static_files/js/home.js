$(document).ready(() => {
  let userID;
  let userInput;
  let finalMessage;
  let countDownTimer;
  const $inputBox = $('#left-text');
  const $outputBox = $('#right-text');

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

  $('.f-to-s').on('click', () => {
    $('.s-to-f').removeClass('active');
    $('.f-to-s').addClass('active');
  });

  $('.s-to-f').on('click', () => {
    $('.f-to-s').removeClass('active');
    $('.s-to-f').addClass('active');
  });

  function displayTranslation() {
    if(finalMessage !== "\n") {
      $outputBox.css('color', '#111');
    } else {
      finalMessage = 'Translation';
      $outputBox.css('color', '#999');
    }
    $outputBox.val(finalMessage);
  }

  function requests() {
    reqDefinition();
    reqSlang();
  }

  function reqDefinition() {
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
    $.ajax({
      url: "/def",
      type: "GET",
      data: {
              def: userInput,
            },
      success: (data, textStatus, jqXHR) => {
        finalMessage = data.def;
        clearInterval(loading);
        displayTranslation();

        firebase.firestore().collection('users').doc(userID).collection('history').doc(userInput).set({
          word: userInput,
          definition: data.def
        }, {merge: true});

      },
      error: (jqXHR, textStatus, errorThrown) => {
        let word = jqXHR.responseJSON.word;
        finalMessage = word;
        clearInterval(loading);
        displayTranslation();
      }
    });
  }

  function updateDefinition(word) {
    $.ajax({
      url: "/new_word",
      type: "GET",
      data: {
              def: word,
            },
      success: (data, textStatus, jqXHR) => {
        console.log(data.def)
        let $definition = $('.definition-section');
        if (data.def != "") {
          $definition.append(`<p class="definition"><span class="definition-term">${word} &mdash; </span>
            ${data.def}</p>`);
          firebase.firestore().collection('users').doc(userID).collection('words').doc(word).set({
            def: data.def
          });
        }
        else {
          firebase.firestore().collection('users').doc(userID).collection('words').doc(word).delete();
        }

      },
      error: (jqXHR, textStatus, errorThrown) => {
        return "";
      }
    });
  }

  function addDefinition(words) {
    let $definition = $('.definition-section');
    $definition.html(`<h2 class="subtitle">Definitions</h2>`);
    for (let i = 0; i < words.length; i++) {
      firebase.firestore().collection('definition').where("word", "==", words[i])
        .get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          console.log(doc.data().word)
          console.log(doc.data().def)
          firebase.firestore().collection('users').doc(userID).collection('words').doc(doc.data().word).set({
            word: doc.data().word,
            def: doc.data().def
          })
          if (words.includes(doc.data().word)) {
            words[words.indexOf(doc.data().word)] = "";
          }
          $definition.append(`<p class="definition"><span class="definition-term">${doc.data().word} &mdash; </span>
            ${doc.data().def}</p>`);
        });
      });
    }
    return words;
  }

  function reqSlang() {
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
            firebase.firestore().collection('users').doc(userID).collection('words').doc(words[i]).set({
              word: words[i]
            })
          }
        }

        $.when(addDefinition(words)).then((e) => {
          for (let i = 0; i < e.length; i++) {
            if (e[i] != "") {
              updateDefinition(e[i]);
            }
          }
        })

        firebase.firestore().collection('users').doc(userID).get().then((doc) => {
          let curWordCount = parseInt(doc.data().wordCount);
          curWordCount+= words.length;
          firebase.firestore().collection('users').doc(userID).set({
            wordCount: curWordCount
          });
        })
      },
      error: (jqXHR, textStatus, errorThrown) => {

      }
    });
  }

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

  $('#left-sound').click(() => {
     $.ajax({
      url: "/tts",
      type: "GET",
      data: {
              def: userInput,
            },
      success: (data, textStatus, jqXHR) => {
        console.log("SUCCESS")
        new Audio(data.msg).play()
      },
      error: (jqXHR, textStatus, errorThrown) => {

      }
    });
  });

  $('#right-sound').click(() => {
    console.log($outputBox.val())
     $.ajax({
      url: "/tts",
      type: "GET",
      data: {
              def: finalMessage,
            },
      success: (data, textStatus, jqXHR) => {
        console.log("RIGHT SUCCESS")
        new Audio(data.msg).play()
      },
      error: (jqXHR, textStatus, errorThrown) => {

      }
    });
  });
});
