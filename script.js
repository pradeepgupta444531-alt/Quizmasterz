// ================================
// QUIZ QUESTIONS
// ================================

const questions = [

    {
        question: "Which compound of cement contributes mainly to early strength?",
        answers: [
            "C₃S",
            "C₂S",
            "C₃A",
            "C₄AF"
        ],
        correct: 0
    },

    {
        question: "What is the minimum initial setting time of Ordinary Portland Cement?",
        answers: [
            "10 minutes",
            "30 minutes",
            "60 minutes",
            "90 minutes"
        ],
        correct: 1
    },

    {
        question: "Which instrument is commonly used for measuring rainfall?",
        answers: [
            "Rain gauge",
            "Theodolite",
            "Planimeter",
            "Prismatic compass"
        ],
        correct: 0
    },

    {
        question: "Which type of foundation is generally used when the soil has good bearing capacity near the surface?",
        answers: [
            "Deep foundation",
            "Pile foundation",
            "Shallow foundation",
            "Caisson foundation"
        ],
        correct: 2
    },

    {
        question: "What is the approximate specific gravity of ordinary Portland cement?",
        answers: [
            "1.15",
            "2.15",
            "3.15",
            "4.15"
        ],
        correct: 2
    },

    {
        question: "Which test is used to determine the fineness of cement?",
        answers: [
            "Slump test",
            "Sieve test",
            "Impact test",
            "Los Angeles test"
        ],
        correct: 1
    },

    {
        question: "Which aggregate is retained on a 4.75 mm IS sieve?",
        answers: [
            "Fine aggregate",
            "Coarse aggregate",
            "Cement",
            "Filler"
        ],
        correct: 1
    },

    {
        question: "Which instrument is used for measuring horizontal and vertical angles in surveying?",
        answers: [
            "Chain",
            "Theodolite",
            "Ranging rod",
            "Measuring tape"
        ],
        correct: 1
    },

    {
        question: "Which law states that stress is proportional to strain within the elastic limit?",
        answers: [
            "Newton's law",
            "Hooke's law",
            "Pascal's law",
            "Bernoulli's law"
        ],
        correct: 1
    },

    {
        question: "Which method is commonly used to calculate average rainfall over an area using rainfall stations and their influence areas?",
        answers: [
            "Thiessen polygon method",
            "Rational method",
            "Unit hydrograph method",
            "Darcy method"
        ],
        correct: 0
    }

];


// ================================
// QUIZ VARIABLES
// ================================

let currentQuestion = 0;

let score = 0;

let timeLeft = 30;

let timer;


// ================================
// START QUIZ
// ================================

function startQuiz() {

    document.getElementById("home-page").style.display = "none";

    document.getElementById("quiz-page").style.display = "block";

    document.getElementById("result-page").style.display = "none";

    currentQuestion = 0;

    score = 0;

    showQuestion();

}


// ================================
// SHOW QUESTION
// ================================

function showQuestion() {

    clearInterval(timer);

    timeLeft = 30;

    updateTimer();

    startTimer();


    const questionData = questions[currentQuestion];


    document.getElementById("question-number").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    document.getElementById("question").textContent =
        questionData.question;


    const answersContainer =
        document.getElementById("answers");


    answersContainer.innerHTML = "";


    questionData.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.className = "answer-btn";

        button.textContent = answer;

        button.onclick = () => selectAnswer(index, button);

        answersContainer.appendChild(button);

    });


    const progress =
        ((currentQuestion + 1) / questions.length) * 100;


    document.getElementById("progress-bar").style.width =
        progress + "%";

}


// ================================
// SELECT ANSWER
// ================================

function selectAnswer(selectedIndex, selectedButton) {

    clearInterval(timer);


    const correctIndex =
        questions[currentQuestion].correct;


    const allButtons =
        document.querySelectorAll(".answer-btn");


    allButtons.forEach(button => {

        button.disabled = true;

    });


    if (selectedIndex === correctIndex) {

        selectedButton.classList.add("correct");

        score++;

    } else {

        selectedButton.classList.add("wrong");

        allButtons[correctIndex].classList.add("correct");

    }

}


// ================================
// NEXT QUESTION
// ================================

function nextQuestion() {

    currentQuestion++;


    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        showResult();

    }

}


// ================================
// TIMER
// ================================

function startTimer() {

    timer = setInterval(() => {

        timeLeft--;

        updateTimer();


        if (timeLeft <= 0) {

            clearInterval(timer);

            nextQuestion();

        }

    }, 1000);

}


function updateTimer() {

    document.getElementById("timer").textContent =
        `⏱️ ${timeLeft}`;

}


// ================================
// RESULT
// ================================

function showResult() {

    clearInterval(timer);


    document.getElementById("quiz-page").style.display =
        "none";


    document.getElementById("result-page").style.display =
        "block";


    document.getElementById("final-score").textContent =
        score;


    const message =
        document.getElementById("result-message");


    if (score === questions.length) {

        message.textContent =
            "🎉 Perfect! Excellent work!";

    } else if (score >= 7) {

        message.textContent =
            "🔥 Great job! Keep it up!";

    } else if (score >= 5) {

        message.textContent =
            "👍 Good effort! You can improve!";

    } else {

        message.textContent =
            "💪 Keep practicing and try again!";

    }

}


// ================================
// RESTART
// ================================

function restartQuiz() {

    startQuiz();

}


// ================================
// HOME
// ================================

function showHome() {

    clearInterval(timer);

    document.getElementById("home-page").style.display =
        "block";

    document.getElementById("quiz-page").style.display =
        "none";

    document.getElementById("result-page").style.display =
        "none";

}


// ================================
// COMING SOON
// ================================

function comingSoon() {

    alert("🚀 This category is coming soon!");

}