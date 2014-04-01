$(document).ready(function(){
	var quiz;
	var questionArr = [];

	loadQuestions();
	startNewQuiz();

	// Clicked an answer button, process answer
	$(".answers a").click(function(){

		quiz.checkAnswer($(this).data("buttonnum"));
		quiz.displayNextQuestion();
	});

	// Clicked the restart button, start a new quiz
	$(".restart-button").click(function(){

		$(this).hide();
		$('.answers, .quiz-status').show();
		$('.question-result').css('visibility', 'hidden');

		startNewQuiz();
	});

	// Reset everything and start a new quiz.
	function startNewQuiz() {
		quiz = new Quiz( questionArr );
		quiz.displayNextQuestion();
		quiz.displayQuizStatus();
	}

	// Only load the questions into the objects once to improve performance.
	function loadQuestions() {
		questionArr.push( new Question( "Which of the following is NOT an enemy of the Doctor?",
				["The Master", "Cybermen", "The Silence", "The Face of Boe"], 3) );
		questionArr.push( new Question( "Which of the following is the Doctor’s home planet?",
				["Skaro", "Raxacoricofallapatorius", "Gallifrey", "Earth"], 2) );
		questionArr.push( new Question( "What is the Doctor called by the Daleks on their home planet?",
				["The Oncoming Storm", "The Destroyer of Daleks", "The Time Lord Warrior", "Death"], 0) );
		questionArr.push( new Question( "Who is known for saying \"Hello Sweetie\"?",
				["Rose Tyler", "Donna Noble", "Amy Pond", "River Song"], 3) );
		questionArr.push( new Question( "What does the eleventh Doctor say are cool?",
				["Fezzes", "Stetsons", "Bow ties", "All of the above"], 3) );
		questionArr.push( new Question( "Amy Pond is known as?",
				["The girl who played with fire", "The clever girl", "The girl who waited",
				"The impossible girl"], 2) );
		questionArr.push( new Question( "What device in the TARDIS is broken that keeps it looking like a Police Box?",
				["Chameleon circuit", "Cloaking device", "Disguise system", "None of the above"], 0) );
		questionArr.push( new Question( "Which of these has the Doctor used his sonic screwdriver for?",
				["Medical diagnostics and repair of organic parts", "Creating a spark to light a candle",
				"Pushing heavy objects", "All of the above"], 3) );

		//console.log(questionArr);
	}
});



// The Quiz object keeps the list of Questions, the current location in that 
// list, how many have been answered correctly so far.  It handles all the display
// of the quiz questions and answers.
function Quiz ( questionArr ) {
	this.numCorrect = 0;
	this.currentQuestionIdx = -1;
	this.questions = questionArr;	// Array of Question objects

	// Displays the next question in the quiz.  If we reached
	// the end, then the quiz results will be displayed.  Also 
	// displays the current status of the users progress in the quiz.
	this.displayNextQuestion = function () {
		this.currentQuestionIdx++;
		if (this.currentQuestionIdx < this.questions.length) {

			var thisQ = this.questions[this.currentQuestionIdx];
			$('.question').text(thisQ.getQuestion());
	
			var arr = thisQ.getAnswers();
			$('.answers a').each( function( index ) {
				$(this).text(arr[index]);
			});

		} else {
			this.displayQuizResults();
		}
		this.displayQuizStatus();
	};

	// Checks if the user's answer was right or not and calls the display function.
	this.checkAnswer = function ( answerIdx ) {
		this.displayResponse( this.questions[this.currentQuestionIdx].evalAnswer( answerIdx ) );
	};

	// Displays whether the user's answer was right or not.
	this.displayResponse = function ( isRight ) {

		$('.question-result').finish().show().css('visibility', 'visible');
		if (isRight) {
			$('.question-result').text("Fantastic!").delay(1000).fadeOut(600, function() {
					$('.question-result').show().css('visibility', 'hidden');
				});
			this.numCorrect++;
		} else {
			$('.question-result').text("Incorrect").delay(1000).fadeOut(600, function() {
					$('.question-result').show().css('visibility', 'hidden');
				});

			// Show the correct answer window
			$('.correct-answer').show().delay(1200).fadeOut();
			var thisQ = this.questions[this.currentQuestionIdx];
			$('.ques').text( thisQ.getQuestion() );
			$('.ans').text( thisQ.getCorrectAnswer() );
		}
	};

	// Show the current progress in the quiz - which question the user is on
	// and how many they've gotten correct so far.
	this.displayQuizStatus = function () {
		if (this.currentQuestionIdx < this.questions.length) {
			$('.quiz-progress').text("Q " + (this.currentQuestionIdx + 1) + " / " + this.questions.length);
		} else {
			$('.quiz-progress').text("Completed");
		}
		$('.num-correct').text(this.numCorrect + " Correct");
	};

	// The user has reached the end of the quiz, so display how they did.
	this.displayQuizResults = function () {
		$('.answers').hide();
		$('.question').text("Congratulations on completing the quiz!\n\n"
			+ "You correctly answered " + this.numCorrect 
			+ " out of " + this.questions.length + " questions.");
		$('.restart-button').show();
	};
}

// The Question object stores one question string, it's array of possible
// answers and the index to the correct answer in the answer array.
function Question ( questionStr, answersArr, correctAnswerIdx ) {
	this.questionStr = questionStr;
	this.answersArr = answersArr;
	this.correctAnswerIdx = correctAnswerIdx;

	this.getQuestion = function () {
		return this.questionStr;
	};

	this.getAnswers = function () {
		return this.answersArr;
	};

	this.getCorrectAnswer = function () {
		return this.answersArr[this.correctAnswerIdx];
	};

	// Check if the passed in answer is the correct one.  
	// Return true if it is, otherwise false.
	this.evalAnswer = function ( userChoice ) {
		if ( userChoice === this.correctAnswerIdx )
			return true;
		return false;
	};
}