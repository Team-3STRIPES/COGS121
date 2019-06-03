$(document).ready(() => {

	let currentIndex = 0;
	let answerValue;
  let words = [];
  let dummyAnswers = [];
  let testQuestions = [];

  let numCorrect = 0;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

      // get words of this current user
      let numWords = 0;
      firebase.firestore().collection('users').doc(user.uid).collection('words').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

          // get the definitions of each word
          words.push({
            word: doc.data().word,
            definition: doc.data().def
          });
          dummyAnswers.push(doc.data().def);
          numWords++;
        });

        // choose 10 words for the question
        if(numWords < 10) {
          window.location.href = 'profile.html';
        }

        words = shuffle(words);

        for(let i = 0; i < 10; i++) {
          let randomAnswers = [words[i].definition];
          let checked = [];
          for(let j = 0; j < dummyAnswers.length; j++) {
            checked.push(false);
            if(dummyAnswers[j] == words[i].definition) checked[j] = true;
          }
          while(randomAnswers.length < 4) {
            let rand = Math.floor(Math.random() * dummyAnswers.length);
            if(checked[rand]) continue;
            else {
              randomAnswers.push(dummyAnswers[rand]);
              checked[rand] = true;
            }
          }

          randomAnswers = shuffle(randomAnswers);

          let correct;
          for(let j = 0; j < randomAnswers.length; j++) {
            if(randomAnswers[j] == words[i].definition) {
              correct = j + 1;
              break;
            }
          }

          testQuestions.push({
            question: `What does "${words[i].word}" mean?`,
            a1: randomAnswers[0],
            a2: randomAnswers[1],
            a3: randomAnswers[2],
            a4: randomAnswers[3],
            correct: 'a' + correct
          });
        }
        console.log(testQuestions);
      	setQuestions();
      });
    } else {
      window.location.href = 'home.html';
    }
  });

  // shuffles array in place. fisher-yates shuffle algorithm
  function shuffle(arr) {
    var j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}

	setButton();
	setCircle();

	function setQuestions() {
	    $('#question').text(testQuestions[currentIndex].question);
      $('#question-number').text(currentIndex + 1 + ". ");
	    $('#a1').text(testQuestions[currentIndex].a1);
	    $('#a2').text(testQuestions[currentIndex].a2);
	    $('#a3').text(testQuestions[currentIndex].a3);
	    $('#a4').text(testQuestions[currentIndex].a4);
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
  			alert("You have reached the end of the test. You scored: " + numCorrect + "/10.");
        setTimeout(() => {
          window.location.href = 'profile.html';
        }, 0);
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
		if (answerValue === testQuestions[currentIndex].correct) {
			$('#'+answerValue).css("background-color","#7aea6b");
			console.log(answerValue);
      numCorrect++;
		}
		else {
			$('#'+testQuestions[currentIndex].correct).css("background-color","#7aea6b");
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
