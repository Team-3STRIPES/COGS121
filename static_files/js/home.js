$(document).ready(() => {

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
    countDownTimer = setTimeout(reqDefinition, 500);
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
      },
      error: (jqXHR, textStatus, errorThrown) => {
        let word = jqXHR.responseJSON.word;
        finalMessage = word;
        clearInterval(loading);
        displayTranslation();
      }
    });
  }

});
