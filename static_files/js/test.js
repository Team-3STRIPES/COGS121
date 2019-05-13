$(document).ready(() => {

	let currentIndex = 0;

	const dummyQuestions = [
		{
			question: 'What does lit mean?',
			a1: 'amazing; spectacular; very good',
			a2: 'terrible, depressing',
			a3: 'to light a candle',
			a4: 'bright; luminescent',
			correct: 'a1'

		},
		{
			question: 'What does "fire" mean?',
			a1: 'burning',
			a2: 'extremely amazing; fantastic',
			a3: 'to light a candle',
			a4: 'bright; luminescent',
			correct: 'a2'


		},
		{
			question: 'What does "kickback" mean?',
			a1: 'kicking someone backwards',
			a2: 'terrible, depressing',
			a3: 'a party',
			a4: 'bright; luminescent',
			correct: 'a3'

		},
		{
			question: 'What does "yeet" mean?',
			a1: 'good',
			a2: 'alright',
			a3: 'terrible',
			a4: 'an herbal medicine',
			correct: 'a2'


		},
		{
			question: 'What does "stan" mean?',
			a1: 'good',
			a2: 'alright',
			a3: 'terrible',
			a4: 'stalker fan; passionately obsessed with something',
			correct: 'a4'

		},
		{
			question: 'What does "on fleek" mean?',
			a1: 'good',
			a2: 'bad',
			a3: 'perfect; great',
			a4: 'an herbal medicine',
			correct: 'a3'

		},
		{
			question: 'What does "finna" mean?',
			a1: 'good',
			a2: 'fixing to',
			a3: 'perfect; great',
			a4: 'an herbal medicine',
			correct: 'a2'


		},
		{
			question: 'What does "highkey" mean?',
			a1: 'good',
			a2: 'bad',
			a3: 'extremely; obviously',
			a4: 'an herbal medicine',
			correct: 'a3'


		},
		{
			question: 'What does "lowkey" mean?',
			a1: 'good',
			a2: 'bad',
			a3: 'discretely; not obviously',
			a4: 'an herbal medicine',
			correct: 'a3'


		},
		{
			question: 'What does "fam" mean?',
			a1: 'good',
			a2: 'bad',
			a3: 'perfect; great',
			a4: 'family',
			correct: 'a4'


		},
	];

	function setQuestions() {
	    $('#question').text(dummyQuestions[currentIndex].question);
	    $('#a1').text(dummyQuestions[currentIndex].a1);
	    $('#a2').text(dummyQuestions[currentIndex].a2);
	    $('#a3').text(dummyQuestions[currentIndex].a3);
	    $('#a4').text(dummyQuestions[currentIndex].a4);
  	}

  	setQuestions();

  	// marks selected as yellow, not selected as gray

  	$('.answer-option').on('click', function() {
  		$('.answer-option').css("background-color", "#EEE");
  		$(this).css("background-color", "#f7d345");

  	})

  	$('.submitbtn').on('click', (e) => {
  		e.preventDefault();
  		if (currentIndex === 9) {
  			alert("You friccin moron.");
  		}
		else {
			currentIndex++;
			setQuestions();
		}
  	})



});
