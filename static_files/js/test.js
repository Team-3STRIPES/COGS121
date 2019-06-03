/* This file contains all of the scripts necessary for the testing page. There
 * are various, simple button event handlers. Most of the functionalities in
 * here are for retrieving questions from the database, and for making sure the
 * quiz is randomized each time.
 */

$(document).ready(() => {

	let currentIndex = 0;
	let answerValue;
  let numCorrect = 0;
  let words = [];
  let dummyAnswers = [];
  const testQuestions = [];

  // make sure user is logged in; must be authenticated to view this page
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

          // user should not be able to take quiz if they have less than 10 words
          window.location.href = 'profile.html';
        }

        // randomize the word order
        words = shuffle(words);

        // choose 3 random answers for the other options
        for(let i = 0; i < 10; i++) {
          let randomAnswers = [words[i].definition];
          let checked = []; // easy way to check for duplicate answers
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

          // randomize the answer order
          randomAnswers = shuffle(randomAnswers);

          // figure out which answer is the correct one
          let correct;
          for(let j = 0; j < randomAnswers.length; j++) {
            if(randomAnswers[j] == words[i].definition) {
              correct = j + 1;
              break;
            }
          }

          // populate list of test questions
          testQuestions.push({
            question: `What does "${words[i].word}" mean?`,
            a1: randomAnswers[0],
            a2: randomAnswers[1],
            a3: randomAnswers[2],
            a4: randomAnswers[3],
            correct: 'a' + correct
          });
        }

        // set the first question
      	setQuestions();
      	setButton();
      	setCircle();
      });
    } else {

      // kick user back to home page if not logged in
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

  // set the question to the current index
	function setQuestions() {
	    $('#question').text(testQuestions[currentIndex].question);
      $('#question-number').text(currentIndex + 1 + ". ");
	    $('#a1').text(testQuestions[currentIndex].a1);
	    $('#a2').text(testQuestions[currentIndex].a2);
	    $('#a3').text(testQuestions[currentIndex].a3);
	    $('#a4').text(testQuestions[currentIndex].a4);
  	}

  // set the button text
	function setButton() {
		if (currentIndex === 9) {
			$('.submitbtn').text("SUBMIT");
		}
		else {
		$('.submitbtn').text("NEXT");
		}
	}

  // advance progress on the progress bar
	function setCircle() {
		$('.progress-circle').eq(currentIndex).css("background-color", "#F7D345");
    if(currentIndex > 0) $('.progress-circle').eq(currentIndex - 1).css("background-color", "#EEE");
	}

	// marks selected as yellow, not selected as gray
	$('.answer-option').on('click', function() {
		$('.answer-option').css("background-color", "#EEE");
		$(this).css("background-color", "#f7d345");
		answerValue = $(this).attr('id');
	})

	// updates button text and questions every time the button is pressed
	function updateQuestion() {
		if (currentIndex === 9) {

      // the test is completed
			alert("You have reached the end of the test. You scored: " + numCorrect + "/10.");
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 0);
		}
		else {

      // advance the question
			currentIndex++;
      answerValue = null;
			$('.answer-option').css("background-color", "#EEE");
			setQuestions();
			setButton();
			setCircle();
		}
	}

  // checks if user chose the correct answer and advances to next question
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

  // handle submit button click
	$('.submitbtn').on('click', (e) => {
    if(!answerValue) {
      alert("You must select an answer.");
      return;
    }
		submitAction();
	})
})
