/* This file contains all of the scripts necessary for the flash cards studying
 * page. The database is first pinged for all of the words that the user has
 * seen before. Then, the flash cards are populated into an object (flashCards).
 * There are also button click event handlers for navigating between the cards.
 */

$(document).ready(() => {

	let currentIndex = 0;
	const flashCards = [];

  // make sure user is logged in; must be authenticated to view this page
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

      // get words of this current user
      firebase.firestore().collection('users').doc(user.uid).collection('words').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

          // get for definitions of each word
          let theWord = doc.data().word;
          let theDef = doc.data().def;
          flashCards.push({
            word: theWord,
            definition: theDef
          });
        });

        // set the first flash card and counter
        setFlashCard();
        setNumbers();
      });
    } else {

      // kick user back to home page if not logged in
      window.location.href = 'home.html';
    }
  });

  // sets the flash card to the current index
	function setFlashCard() {
		$('.flash-card-word').first().text(flashCards[currentIndex].word);
		$('.flash-card-def').first().text(flashCards[currentIndex].definition);
	}

  // sets the counter to the current index
	function setNumbers() {
		 $("#flash-card-total").text(flashCards.length);
		 $("#flash-card-index").text(1);
	}

  // handles the animation for navigating the cards to the left
	function fadeLeftCard() {
		setFlashCard();
		$('.flash-card').first().animate({
			opacity: 1,
			left: '+=100'
		}, 500);
	}

  // button handler when the user wants to navigate left
	$('.left-arrow').on('click', () => {
		currentIndex = (currentIndex + flashCards.length - 1) % flashCards.length;
		$('.flash-card').first().animate({
			opacity: 0,
			left: '-=100'
		}, 500, fadeLeftCard);
		$('#flash-card-index').text(currentIndex + 1)
	});

  // handles the animation for navigating the cards to the right
	function fadeRightCard() {
		setFlashCard();
		$('.flash-card').first().animate({
			opacity: 1,
			left:'-=100'
		}, 500) ;
	}

  // button handler when the user wants to navigate right
	$('.right-arrow').on('click', () => {
		currentIndex = (currentIndex + 1) % flashCards.length;
		$('.flash-card').first().animate({
			opacity: 0,
			left: '+=100'
		}, 500, fadeRightCard)
		$('#flash-card-index').text(currentIndex + 1)
	})


});
