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

  function updateDefinitions() {
    
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
        updateDefinitions();

        firebase.firestore().collection('users').doc(userID).collection('history').doc(userInput).set({
          word: userInput,
          definition: data.def
        }); 
      },
      error: (jqXHR, textStatus, errorThrown) => {
        let word = jqXHR.responseJSON.word;
        finalMessage = word;
        clearInterval(loading);
        displayTranslation();
      }
    });
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
            firebase.firestore().collection('users').doc(userID).collection('words').doc(words[i]).set({
              word: words[i]
            })
          }
        }
        let $definition = $('.definition-section');
        $definition.html(`<h2 class="subtitle">Definitions</h2>`);
        for (let i = 0; i < words.length; i++) {
          firebase.firestore().collection('definition').where("word", "==", words[i])
            .get().then(function (querySnapshot) {
              querySnapshot.forEach((doc) => {
                console.log(doc.data().word)
                console.log(doc.data().def)
                $definition.append(`<p class="definition"><span class="definition-term">${doc.data().word} &mdash; </span> 
                  ${doc.data().def}</p>`);
            });    
          });
        }
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
});
