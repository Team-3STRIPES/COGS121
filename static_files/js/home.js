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
    if(finalMessage) {
      $outputBox.css('color', '#111');
    } else {
      finalMessage = 'Translation';
      $outputBox.css('color', '#999');
    }
    $outputBox.val(finalMessage);
  }

  function reqDefinition() {
   $.ajax({
      url: "/def",
      type: "GET",
      data: {
              def: userInput,
            },
      success: (data, textStatus, jqXHR) => {
        finalMessage = data.def;
        displayTranslation();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        let word = jqXHR.responseJSON.word;
        finalMessage = word;
        displayTranslation();
      }
    });
  }
  
});