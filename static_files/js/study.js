$(document).ready(() => {

  let currentIndex = 0;

  const dummyCards = [
    {
      word: 'lit',
      definition: 'amazing, spectacular',
      example: 'I loved the party last night. It was so lit!'
    },
    {
      word: 'selfie',
      definition: 'self-taken photo of yourself',
      example: 'My selfie is so beautiful!'
    },
    {
      word: 'salty',
      definition: 'being upset, angry, or bitter',
      example: 'I failed the midterm. I\'m so salty.'
    }
  ];

  function setFlashCard() {
    $('.flash-card-word').first().text(dummyCards[currentIndex].word);
    $('.flash-card-def').first().text(dummyCards[currentIndex].definition);
    $('.flash-card-ex').first().text(dummyCards[currentIndex].example);
  }

  setFlashCard();

  function fadeNewCard() {
    setFlashCard();
    $('.flash-card').first().css('left', '+=200');
    $('.flash-card').first().animate({
      opacity: 1,
      left: '-=100'
    }, 500);
  }

  $('.left-arrow').on('click', () => {
    currentIndex = (currentIndex + dummyCards.length - 1) % dummyCards.length;
    $('.flash-card').first().animate({
      opacity: 0,
      left: '-=100'
    }, 500, fadeNewCard);
  });
});
