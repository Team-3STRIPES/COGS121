$(document).ready(() => {

	let currentIndex = 0;
	let answerValue;

	// pulls test questions from Firebase
	let fake_answers = [], test_bank = [], dummyQuestions = [];
	const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/cogs121-c88c5/databases/(default)/documents/question_set/question_set';
	$.get(FIREBASE_URL, function(data) {
		// cleans up the JSON (original data can be viewed at FIREBASE_URL)
		fake_answers = data.fields.fake_questions.arrayValue.values.map((val) => val.stringValue);
		test_bank = data.fields.test_bank.arrayValue.values.map((val) => [
			val.mapValue.fields.term.stringValue,
			val.mapValue.fields.definition.stringValue
		]);
		// for each question
		for (qIndex in test_bank) {
			const qitem = test_bank[qIndex];
			const term = qitem[0], definition = qitem[1];
			// random answer index for correct definition
			const trueIndex = 1 + Math.floor(Math.random() * 4);
			// creates the answer array
			let options = fake_answers
				.filter((fAns) => fAns !== definition)
				.sort(() => 0.5 - Math.random())
				.slice(0, 3);
			options.splice(trueIndex - 1, 0, definition);
			// maintains original dummyQuestions schema
			let jobj = {
				question: `What does \"${term}\" mean?`,
				correct: 'a' + trueIndex
			};
			for (o in options) {
				const shifted = parseInt(o) + 1;
				jobj['a' + shifted] = options[o];
			}
			dummyQuestions.push(jobj);
		}
		// must be in the callback because it depends on dummyQuestions, which is populated above
		setQuestions();
	});

	setButton();
	setCircle();

	function setQuestions() {
	    $('#question').text(dummyQuestions[currentIndex].question);
	    $('#a1').text(dummyQuestions[currentIndex].a1);
	    $('#a2').text(dummyQuestions[currentIndex].a2);
	    $('#a3').text(dummyQuestions[currentIndex].a3);
	    $('#a4').text(dummyQuestions[currentIndex].a4);
  	}

  	function setButton() {
  		if (currentIndex === 9) {
  			$('.submitbtn').text("SUBMIT");
  		}
  		else {
			$('.submitbtn').text("NEXT");
  		}
  	}

  	function setCircle() {
  		for (i = 0; i <= currentIndex; i++) {
				$('.progress-circle').eq(i).css("background-color", "#EEE");
			}
  	}

  	// marks selected as yellow, not selected as gray

  	$('.answer-option').on('click', function() {
  		$('.answer-option').css("background-color", "#EEE");
  		$(this).css("background-color", "#f7d345");
  		answerValue = $(this).attr('id');
  	})

  	//updates button text and questions every time the button is pressed

  	function updateQuestion() {
  		//e.preventDefault();
  		if (currentIndex === 9) {
    			alert("You have reached the end of the test.");
    		}
  		else {
  			currentIndex++;
        answerValue = null;
  			$('.answer-option').css("background-color", "#EEE");
  			setQuestions();
  			setButton();
  			setCircle();
  		}
  	}

  	function submitAction() {
  		if (answerValue === dummyQuestions[currentIndex].correct) {
  			$('#'+answerValue).css("background-color","#7aea6b");
  			console.log(answerValue);
  		}
  		else {
  			$('#'+dummyQuestions[currentIndex].correct).css("background-color","#7aea6b");
  			$('#'+answerValue).css("background-color","#e2685a");
  		}
  		setTimeout(updateQuestion,1500);
  	}

  	$('.submitbtn').on('click', (e) => {
      if(!answerValue) {
        alert("You must select an answer.");
        return;
      }
  		submitAction();
  	})


	})
