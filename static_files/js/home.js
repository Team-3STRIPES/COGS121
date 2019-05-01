$(document).ready(() => {

  let finalMessage;
  let countDownTimer;
  const $inputBox = $('#left-text');
  const $outputBox = $('#right-text');

  $('#left-text').on('input', () => {
    finalMessage = $inputBox.val();
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
      url : "/def",
      type: "GET",
      data : {
              def: finalMessage,
             },
      success: function(data, textStatus, jqXHR)
      {
        //displayTranslation()
        finalMessage = data.def;
        displayTranslation();
      },
      error: function(jqXHR, textStatus, errorThrown)
      {
        //displayTranslation()
        let word = jqXHR.responseJSON.word;
        finalMessage = word;
        displayTranslation();
      },
    })
  }
});
