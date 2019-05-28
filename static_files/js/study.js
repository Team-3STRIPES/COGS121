$(document).ready(() => {

	let currentIndex = 0;

	let dummyCards = [];
	const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/cogs121-c88c5/databases/(default)/documents/flashcards';
	$.get(FIREBASE_URL, function(data) {
		// cleans up the JSON (original data can be viewed at FIREBASE_URL)
		const cards = data.documents.map((val) => [
			val.fields.term.stringValue,
			val.fields.definition.stringValue,
			val.fields.example.stringValue
		]);
		// for each card
		for (cIndex in cards) {
			const citem = cards[cIndex];
			dummyCards.push({
				word: citem[0],
				definition: citem[1],
				example: citem[2]
			});
		}
		// must be in the callback because it depends on dummyCards, which is populated above
		setFlashCard();
		setNumbers();
	});

	function setFlashCard() {
		$('.flash-card-word').first().text(dummyCards[currentIndex].word);
		$('.flash-card-def').first().text(dummyCards[currentIndex].definition);
		$('.flash-card-ex').first().text(dummyCards[currentIndex].example);
	}

	function setNumbers() {
		 $("#flash-card-total").text(dummyCards.length);
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
		currentIndex = (currentIndex + dummyCards.length - 1) % dummyCards.length;
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
		currentIndex = (currentIndex + dummyCards.length - 2) % dummyCards.length;
		$('.flash-card').first().animate({
			opacity: 0,
			left: '+=100'
		}, 500, fadeRightCard)
		$('#flash-card-index').text(currentIndex + 1)
	})


});
