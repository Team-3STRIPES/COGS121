$(document).ready(() => {

	let currentIndex = 0;

	let flashCards = [];

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

      // get words of this current user
      let wordPromise = firebase.firestore().collection('users').doc(user.uid).collection('words').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

          // search for definitions of each word
          let theWord = doc.data().word;
          firebase.firestore().collection('definition').where('word', '==', theWord).get().then((querySnapshot) => {
            let temp = 0;
            querySnapshot.forEach((doc) => {
              flashCards.push({
                word: doc.data().word,
                definition: doc.data().def
              });
              temp++;
            });
            if(temp === 0) {
              flashCards.push({
                word: theWord,
                definition: 'A definition was not found for this word.'
              });
            }
            setFlashCard();
            setNumbers();
          });
        });
      });
    } else {
      window.location.href = 'home.html';
    }
  });

	function setFlashCard() {
		$('.flash-card-word').first().text(flashCards[currentIndex].word);
		$('.flash-card-def').first().text(flashCards[currentIndex].definition);
	}

	function setNumbers() {
		 $("#flash-card-total").text(flashCards.length);
		 $("#flash-card-index").text(1);
	}


	function fadeLeftCard() {
		setFlashCard();
		/*$('.flash-card').first().css('left', '+=200');*/
		$('.flash-card').first().animate({
			opacity: 1,
			left: '+=100'
		}, 500);
	}

	$('.left-arrow').on('click', () => {
		currentIndex = (currentIndex + flashCards.length - 1) % flashCards.length;
		$('.flash-card').first().animate({
			opacity: 0,
			left: '-=100'
		}, 500, fadeLeftCard);
		$('#flash-card-index').text(currentIndex + 1)
	});


	function fadeRightCard() {
		setFlashCard();
		/*$('.flash-card').first().css('left', '-=200');*/
		$('.flash-card').first().animate({
			opacity: 1,
			left:'-=100'
		}, 500) ;
	}

	$('.right-arrow').on('click', () => {
		currentIndex = (currentIndex + flashCards.length - 2) % flashCards.length;
		$('.flash-card').first().animate({
			opacity: 0,
			left: '+=100'
		}, 500, fadeRightCard)
		$('#flash-card-index').text(currentIndex + 1)
	})


});
