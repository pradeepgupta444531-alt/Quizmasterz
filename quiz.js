// ============================================================
// QUIZMASTER - QUIZ ENGINE
// ============================================================


// ============================================================
// QUIZ VARIABLES
// ============================================================

let quizQuestions = [];

let currentQuestion = 0;

let score = 0;

let timeLeft = 30;

let timer = null;

let selectedCategory = "civil-engineering";

let userAnswers = [];


// ============================================================
// DEFAULT QUIZ SETTINGS
// ============================================================
// If quizSettings already exists in data.js, we use it.
// Otherwise, these defaults are created.
// ============================================================

if (typeof quizSettings === "undefined") {

    window.quizSettings = {

        questionsPerQuiz: 10,

        timePerQuestion: 30,

        shuffleQuestions: true

    };

}


// ============================================================
// HIDE ALL PAGES
// ============================================================

function hideAllPages() {

    const pages = [

        "home-page",

        "setup-page",

        "quiz-page",

        "result-page",

        "review-page",

        "dashboard-page"

    ];


    pages.forEach(function (id) {

        const page =
            document.getElementById(id);

        if (page) {

            page.style.display = "none";

        }

    });

}


// ============================================================
// SHOW QUIZ SETUP
// ============================================================

function showQuizSetup(
    category = "civil-engineering"
) {

    selectedCategory = category;

    clearInterval(timer);

    hideAllPages();


    const setupPage =
        document.getElementById(
            "setup-page"
        );


    if (setupPage) {

        setupPage.style.display = "block";

    }


    loadCategoryDropdown();

}


// ============================================================
// LOAD CATEGORY DROPDOWN
// ============================================================

function loadCategoryDropdown() {

    const dropdown =
        document.getElementById(
            "category-select"
        );


    if (!dropdown) {

        return;

    }


    dropdown.innerHTML = "";


    if (
        typeof categories ===
        "undefined"
    ) {

        console.error(
            "Categories data not found."
        );

        return;

    }


    categories.forEach(function (category) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            category.id;


        option.textContent =
            category.name;


        if (
            category.id ===
            selectedCategory
        ) {

            option.selected = true;

        }


        dropdown.appendChild(
            option
        );

    });


    dropdown.onchange =
        function () {

            selectedCategory =
                this.value;

        };

}


// ============================================================
// START CONFIGURED QUIZ
// ============================================================

function startConfiguredQuiz() {

    const difficultyElement =
        document.getElementById(
            "difficulty-select"
        );


    const questionCountElement =
        document.getElementById(
            "question-count"
        );


    const timeElement =
        document.getElementById(
            "time-select"
        );


    if (
        !difficultyElement ||
        !questionCountElement ||
        !timeElement
    ) {

        console.error(
            "Quiz setup elements are missing."
        );

        return;

    }


    const difficulty =
        difficultyElement.value;


    const questionCount =
        Number(
            questionCountElement.value
        );


    const time =
        Number(
            timeElement.value
        );


    quizSettings.questionsPerQuiz =
        questionCount > 0
            ? questionCount
            : 10;


    quizSettings.timePerQuestion =
        time > 0
            ? time
            : 30;


    // --------------------------------------------------------
    // CHECK QUESTION BANK
    // --------------------------------------------------------

    if (
        typeof questionBank ===
        "undefined"
    ) {

        alert(
            "Question bank could not be loaded."
        );

        return;

    }


    // --------------------------------------------------------
    // FILTER CATEGORY
    // --------------------------------------------------------

    let availableQuestions =
        questionBank.filter(
            function (question) {

                return (
                    question.category ===
                    selectedCategory
                );

            }
        );


    // --------------------------------------------------------
    // FILTER DIFFICULTY
    // --------------------------------------------------------

    if (
        difficulty &&
        difficulty !== "all"
    ) {

        availableQuestions =
            availableQuestions.filter(
                function (question) {

                    return (
                        question.difficulty ===
                        difficulty
                    );

                }
            );

    }


    // --------------------------------------------------------
    // CHECK QUESTIONS
    // --------------------------------------------------------

    if (
        availableQuestions.length === 0
    ) {

        alert(
            "No questions available for this selection."
        );

        return;

    }


    // --------------------------------------------------------
    // SHUFFLE
    // --------------------------------------------------------

    quizQuestions =
        [...availableQuestions];


    if (
        quizSettings.shuffleQuestions
    ) {

        shuffleArray(
            quizQuestions
        );

    }


    // --------------------------------------------------------
    // LIMIT QUESTIONS
    // --------------------------------------------------------

    quizQuestions =
        quizQuestions.slice(
            0,
            quizSettings.questionsPerQuiz
        );


    // --------------------------------------------------------
    // RESET
    // --------------------------------------------------------

    currentQuestion = 0;

    score = 0;

    userAnswers = [];

    clearInterval(timer);


    // --------------------------------------------------------
    // SHOW QUIZ
    // --------------------------------------------------------

    hideAllPages();


    const quizPage =
        document.getElementById(
            "quiz-page"
        );


    if (quizPage) {

        quizPage.style.display =
            "block";

    }


    showQuestion();

}


// ============================================================
// SHUFFLE ARRAY
// ============================================================

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

}


// ============================================================
// START QUIZ DIRECTLY
// ============================================================

function startQuiz(
    category = "civil-engineering"
) {

    selectedCategory =
        category;


    if (
        typeof questionBank ===
        "undefined"
    ) {

        alert(
            "Question bank could not be loaded."
        );

        return;

    }


    quizQuestions =
        questionBank.filter(
            function (question) {

                return (
                    question.category ===
                    category
                );

            }
        );


    if (
        quizQuestions.length === 0
    ) {

        alert(
            "No questions available for this category."
        );

        return;

    }


    if (
        quizSettings.shuffleQuestions
    ) {

        shuffleArray(
            quizQuestions
        );

    }


    quizQuestions =
        quizQuestions.slice(
            0,
            quizSettings.questionsPerQuiz
        );


    currentQuestion = 0;

    score = 0;

    userAnswers = [];

    clearInterval(timer);

    hideAllPages();


    const quizPage =
        document.getElementById(
            "quiz-page"
        );


    if (quizPage) {

        quizPage.style.display =
            "block";

    }


    showQuestion();

}


// ============================================================
// SHOW QUESTION
// ============================================================

function showQuestion() {

    clearInterval(timer);


    if (
        !quizQuestions[currentQuestion]
    ) {

        showResult();

        return;

    }


    const question =
        quizQuestions[
            currentQuestion
        ];


    timeLeft =
        quizSettings.timePerQuestion;


    updateTimer();

    startTimer();


    // --------------------------------------------------------
    // QUESTION NUMBER
    // --------------------------------------------------------

    const questionNumber =
        document.getElementById(
            "question-number"
        );


    if (questionNumber) {

        questionNumber.textContent =
            "Question " +
            (currentQuestion + 1) +
            " of " +
            quizQuestions.length;

    }


    // --------------------------------------------------------
    // QUESTION TEXT
    // --------------------------------------------------------

    const questionElement =
        document.getElementById(
            "question"
        );


    if (questionElement) {

        questionElement.textContent =
            question.question;

    }


    // --------------------------------------------------------
    // ANSWERS
    // --------------------------------------------------------

    const answersContainer =
        document.getElementById(
            "answers"
        );


    if (!answersContainer) {

        console.error(
            "Answers container not found."
        );

        return;

    }


    answersContainer.innerHTML = "";


    question.options.forEach(
        function (option, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "answer-btn";


            button.textContent =
                option;


            button.onclick =
                function () {

                    selectAnswer(
                        index,
                        button
                    );

                };


            answersContainer.appendChild(
                button
            );

        }
    );


    // --------------------------------------------------------
    // PROGRESS BAR
    // --------------------------------------------------------

    const progress =
        (
            (currentQuestion + 1) /
            quizQuestions.length
        ) * 100;


    const progressBar =
        document.getElementById(
            "progress-bar"
        );


    if (progressBar) {

        progressBar.style.width =
            progress + "%";

    }


    // --------------------------------------------------------
    // NEXT BUTTON
    // --------------------------------------------------------

    const nextButton =
        document.getElementById(
            "next-button"
        );


    if (nextButton) {

        nextButton.style.display =
            "none";

    }

}


// ============================================================
// SELECT ANSWER
// ============================================================

function selectAnswer(
    selectedIndex,
    selectedButton
) {

    clearInterval(timer);


    const question =
        quizQuestions[
            currentQuestion
        ];


    if (!question) {

        return;

    }


    const correctIndex =
        typeof question.answer !==
        "undefined"
            ? question.answer
            : question.correctAnswer;


    const allButtons =
        document.querySelectorAll(
            ".answer-btn"
        );


    allButtons.forEach(
        function (button) {

            button.disabled = true;

        }
    );


    const isCorrect =
        selectedIndex ===
        correctIndex;


    // --------------------------------------------------------
    // SAVE ANSWER FOR REVIEW
    // --------------------------------------------------------

    userAnswers[
        currentQuestion
    ] = {

        question:
            question.question,

        options:
            question.options,

        selected:
            selectedIndex,

        correct:
            correctIndex,

        isCorrect:
            isCorrect

    };


    // --------------------------------------------------------
    // CORRECT
    // --------------------------------------------------------

    if (isCorrect) {

        selectedButton.classList.add(
            "correct"
        );


        score++;

    }


    // --------------------------------------------------------
    // WRONG
    // --------------------------------------------------------

    else {

        selectedButton.classList.add(
            "wrong"
        );


        if (
            allButtons[
                correctIndex
            ]
        ) {

            allButtons[
                correctIndex
            ].classList.add(
                "correct"
            );

        }

    }


    // --------------------------------------------------------
    // SHOW NEXT BUTTON
    // --------------------------------------------------------

    const nextButton =
        document.getElementById(
            "next-button"
        );


    if (nextButton) {

        nextButton.style.display =
            "block";

    }

}


// ============================================================
// NEXT QUESTION
// ============================================================

function nextQuestion() {

    clearInterval(timer);


    currentQuestion++;


    if (
        currentQuestion <
        quizQuestions.length
    ) {

        showQuestion();

    }

    else {

        showResult();

    }

}


// ============================================================
// TIMER
// ============================================================

function startTimer() {

    clearInterval(timer);


    timer =
        setInterval(
            function () {

                timeLeft--;


                updateTimer();


                if (
                    timeLeft <= 0
                ) {

                    clearInterval(
                        timer
                    );


                    saveTimedOutAnswer();


                    nextQuestion();

                }

            },
            1000
        );

}


// ============================================================
// SAVE TIMED OUT ANSWER
// ============================================================

function saveTimedOutAnswer() {

    if (
        userAnswers[
            currentQuestion
        ]
    ) {

        return;

    }


    const question =
        quizQuestions[
            currentQuestion
        ];


    if (!question) {

        return;

    }


    const correctIndex =
        typeof question.answer !==
        "undefined"
            ? question.answer
            : question.correctAnswer;


    userAnswers[
        currentQuestion
    ] = {

        question:
            question.question,

        options:
            question.options,

        selected:
            null,

        correct:
            correctIndex,

        isCorrect:
            false

    };

}


// ============================================================
// UPDATE TIMER
// ============================================================

function updateTimer() {

    const timerElement =
        document.getElementById(
            "timer"
        );


    if (timerElement) {

        timerElement.textContent =
            "⏱️ " + timeLeft;

    }

}


// ============================================================
// SHOW RESULT
// ============================================================

function showResult() {

    clearInterval(timer);

    hideAllPages();


    const resultPage =
        document.getElementById(
            "result-page"
        );


    if (resultPage) {

        resultPage.style.display =
            "block";

    }


    const total =
        quizQuestions.length;


    const percentage =
        total > 0
            ? Math.round(
                (
                    score /
                    total
                ) * 100
            )
            : 0;


    // --------------------------------------------------------
    // FINAL SCORE
    // --------------------------------------------------------

    const finalScore =
        document.getElementById(
            "final-score"
        );


    if (finalScore) {

        finalScore.textContent =
            score;

    }


    // --------------------------------------------------------
    // TOTAL
    // --------------------------------------------------------

    const finalTotal =
        document.getElementById(
            "final-total"
        );


    if (finalTotal) {

        finalTotal.textContent =
            total;

    }


    // --------------------------------------------------------
    // PERCENTAGE
    // --------------------------------------------------------

    const percentageElement =
        document.getElementById(
            "percentage"
        );


    if (percentageElement) {

        percentageElement.textContent =
            percentage + "%";

    }


    // --------------------------------------------------------
    // RESULT MESSAGE
    // --------------------------------------------------------

    const message =
        document.getElementById(
            "result-message"
        );


    if (message) {

        if (
            score === total
        ) {

            message.textContent =
                "🎉 Perfect! Excellent work!";

        }

        else if (
            score >=
            total * 0.7
        ) {

            message.textContent =
                "🔥 Great job!";

        }

        else if (
            score >=
            total * 0.5
        ) {

            message.textContent =
                "👍 Good effort!";

        }

        else {

            message.textContent =
                "💪 Keep practicing!";

        }

    }


    // --------------------------------------------------------
    // SAVE RESULT
    // --------------------------------------------------------

    saveQuizResult(
        selectedCategory,
        score,
        total,
        percentage
    );

}


// ============================================================
// SAVE QUIZ RESULT
// ============================================================
// For now this keeps your existing local history.
// Later we will connect this function to Supabase.
// ============================================================

function saveQuizResult(
    category,
    scoreValue,
    total,
    percentage
) {

    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "quizHistory"
                )
            ) || [];

    }

    catch (error) {

        console.error(
            "Could not read quiz history:",
            error
        );

        history = [];

    }


    const result = {

        category:
            category,

        score:
            scoreValue,

        total:
            total,

        percentage:
            Number(percentage),

        date:
            new Date().toLocaleString()

    };


    history.push(
        result
    );


    localStorage.setItem(
        "quizHistory",
        JSON.stringify(
            history
        )
    );


    console.log(
        "Quiz result saved:",
        result
    );

}


// ============================================================
// SHOW ANSWER REVIEW
// ============================================================

function showAnswerReview() {

    clearInterval(timer);

    hideAllPages();


    const reviewPage =
        document.getElementById(
            "review-page"
        );


    if (reviewPage) {

        reviewPage.style.display =
            "block";

    }


    const reviewSummary =
        document.getElementById(
            "review-summary"
        );


    const reviewList =
        document.getElementById(
            "review-list"
        );


    if (!reviewList) {

        console.error(
            "review-list not found."
        );

        return;

    }


    reviewList.innerHTML = "";


    let correctCount = 0;


    userAnswers.forEach(
        function (answer, index) {

            if (
                answer &&
                answer.isCorrect
            ) {

                correctCount++;

            }

        }
    );


    // --------------------------------------------------------
    // REVIEW SUMMARY
    // --------------------------------------------------------

    if (reviewSummary) {

        reviewSummary.innerHTML = `

            <div class="review-summary-card">

                <h2>
                    📊 Your Performance
                </h2>

                <p>
                    Correct Answers:
                    <strong>
                        ${correctCount}
                    </strong>
                    /
                    <strong>
                        ${quizQuestions.length}
                    </strong>
                </p>

                <p>
                    Score:
                    <strong>
                        ${Math.round(
                            (
                                correctCount /
                                quizQuestions.length
                            ) * 100
                        ) || 0}%
                    </strong>
                </p>

            </div>

        `;

    }


    // --------------------------------------------------------
    // EACH ANSWER
    // --------------------------------------------------------

    quizQuestions.forEach(
        function (question, index) {

            const answer =
                userAnswers[index];


            if (!answer) {

                return;

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "review-item";


            const selectedText =
                answer.selected === null ||
                typeof answer.selected ===
                "undefined"

                    ? "Not answered"

                    : answer.options[
                        answer.selected
                    ];


            const correctText =
                answer.options[
                    answer.correct
                ];


            const status =
                answer.isCorrect
                    ? "✅ Correct"
                    : "❌ Incorrect";


            card.innerHTML = `

                <div class="review-question">

                    <strong>
                        Question ${index + 1}
                    </strong>

                    <p>
                        ${escapeHtml(
                            question.question
                        )}
                    </p>

                </div>


                <div class="review-answer">

                    <p>
                        <strong>
                            Your Answer:
                        </strong>

                        ${escapeHtml(
                            selectedText
                        )}
                    </p>


                    <p>
                        <strong>
                            Correct Answer:
                        </strong>

                        ${escapeHtml(
                            correctText
                        )}
                    </p>


                    <p>
                        <strong>
                            Result:
                        </strong>

                        ${status}
                    </p>

                </div>

            `;


            reviewList.appendChild(
                card
            );

        }
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    if (
        value === null ||
        typeof value === "undefined"
    ) {

        return "";

    }


    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// ============================================================
// RESTART QUIZ
// ============================================================

function restartQuiz() {

    startQuiz(
        selectedCategory
    );

}


// ============================================================
// SHOW HOME
// ============================================================

function showHome() {

    clearInterval(timer);

    hideAllPages();


    const home =
        document.getElementById(
            "home-page"
        );


    if (home) {

        home.style.display =
            "block";

    }

}


// ============================================================
// SHOW DASHBOARD
// ============================================================

function showDashboard() {

    clearInterval(timer);

    hideAllPages();


    const dashboard =
        document.getElementById(
            "dashboard-page"
        );


    if (dashboard) {

        dashboard.style.display =
            "block";

    }


    loadDashboard();

}


// ============================================================
// LOAD DASHBOARD
// ============================================================

function loadDashboard() {

    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "quizHistory"
                )
            ) || [];

    }

    catch (error) {

        console.error(
            "Could not load quiz history:",
            error
        );

        history = [];

    }


    const stats =
        document.getElementById(
            "dashboard-stats"
        );


    const historyContainer =
        document.getElementById(
            "quiz-history"
        );


    const subjectContainer =
        document.getElementById(
            "subject-performance"
        );


    // --------------------------------------------------------
    // NO HISTORY
    // --------------------------------------------------------

    if (
        history.length === 0
    ) {

        if (stats) {

            stats.innerHTML = `

                <div class="dashboard-empty">

                    <h2>
                        📚 No quizzes yet
                    </h2>

                    <p>
                        Complete your first quiz
                        to see your progress.
                    </p>

                </div>

            `;

        }


        if (historyContainer) {

            historyContainer.innerHTML =
                "<p>No quiz history yet.</p>";

        }


        if (subjectContainer) {

            subjectContainer.innerHTML =
                "<p>No subject performance yet.</p>";

        }


        createPerformanceChart(
            history
        );


        return;

    }


    // --------------------------------------------------------
    // TOTAL QUIZZES
    // --------------------------------------------------------

    const totalQuizzes =
        history.length;


    // --------------------------------------------------------
    // VALID SCORES
    // --------------------------------------------------------

    const scores =
        history.map(
            function (quiz) {

                return Number(
                    quiz.percentage
                ) || 0;

            }
        );


    // --------------------------------------------------------
    // BEST SCORE
    // --------------------------------------------------------

    const bestScore =
        Math.max(
            ...scores
        );


    // --------------------------------------------------------
    // AVERAGE
    // --------------------------------------------------------

    const averageScore =
        Math.round(
            scores.reduce(
                function (
                    sum,
                    value
                ) {

                    return (
                        sum +
                        value
                    );

                },
                0
            ) /
            scores.length
        );


    // --------------------------------------------------------
    // DASHBOARD STATISTICS
    // --------------------------------------------------------

    if (stats) {

        stats.innerHTML = `

            <div class="dashboard-card">

                <div class="dashboard-card-icon">
                    📝
                </div>

                <strong>
                    ${totalQuizzes}
                </strong>

                <span>
                    Quizzes Taken
                </span>

            </div>


            <div class="dashboard-card">

                <div class="dashboard-card-icon">
                    🏆
                </div>

                <strong>
                    ${bestScore}%
                </strong>

                <span>
                    Best Score
                </span>

            </div>


            <div class="dashboard-card">

                <div class="dashboard-card-icon">
                    📈
                </div>

                <strong>
                    ${averageScore}%
                </strong>

                <span>
                    Average Score
                </span>

            </div>

        `;

    }


    // --------------------------------------------------------
    // SUBJECT PERFORMANCE
    // --------------------------------------------------------

    if (subjectContainer) {

        const subjects = {};


        history.forEach(
            function (quiz) {

                const category =
                    quiz.category ||
                    "unknown";


                const percentage =
                    Number(
                        quiz.percentage
                    ) || 0;


                if (
                    !subjects[
                        category
                    ]
                ) {

                    subjects[
                        category
                    ] = [];

                }


                subjects[
                    category
                ].push(
                    percentage
                );

            }
        );


        subjectContainer.innerHTML =
            "";


        Object.keys(
            subjects
        ).forEach(
            function (category) {

                const categoryScores =
                    subjects[
                        category
                    ];


                const average =
                    Math.round(
                        categoryScores.reduce(
                            function (
                                sum,
                                value
                            ) {

                                return (
                                    sum +
                                    value
                                );

                            },
                            0
                        ) /
                        categoryScores.length
                    );


                const best =
                    Math.max(
                        ...categoryScores
                    );


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "subject-card";


                card.innerHTML = `

                    <h3>
                        ${formatCategory(
                            category
                        )}
                    </h3>


                    <p>
                        Quizzes:
                        <strong>
                            ${categoryScores.length}
                        </strong>
                    </p>


                    <p>
                        Average:
                        <strong>
                            ${average}%
                        </strong>
                    </p>


                    <p>
                        Best:
                        <strong>
                            ${best}%
                        </strong>
                    </p>


                    <div
                        class="subject-progress">

                        <div
                            style="
                                width: ${average}%;
                            ">
                        </div>

                    </div>

                `;


                subjectContainer.appendChild(
                    card
                );

            }
        );

    }


    // --------------------------------------------------------
    // QUIZ HISTORY
    // --------------------------------------------------------

    if (historyContainer) {

        historyContainer.innerHTML =
            "";


        const reversedHistory =
            [...history].reverse();


        reversedHistory.forEach(
            function (quiz) {

                const percentage =
                    Number(
                        quiz.percentage
                    ) || 0;


                let statusClass =
                    "history-good";


                if (
                    percentage < 50
                ) {

                    statusClass =
                        "history-bad";

                }

                else if (
                    percentage < 70
                ) {

                    statusClass =
                        "history-average";

                }


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "history-item";


                item.innerHTML = `

                    <div>

                        <strong>
                            ${formatCategory(
                                quiz.category
                            )}
                        </strong>

                        <small>
                            ${quiz.date || ""}
                        </small>

                    </div>


                    <div
                        class="${statusClass}">

                        ${percentage}%

                    </div>

                `;


                historyContainer.appendChild(
                    item
                );

            }
        );

    }


    // --------------------------------------------------------
    // CHART
    // --------------------------------------------------------

    createPerformanceChart(
        history
    );

}


// ============================================================
// FORMAT CATEGORY
// ============================================================

function formatCategory(
    category
) {

    if (!category) {

        return "Unknown";

    }


    return String(category)
        .replaceAll(
            "-",
            " "
        )
        .replace(
            /\b\w/g,
            function (letter) {

                return letter.toUpperCase();

            }
        );

}


// ============================================================
// PERFORMANCE CHART
// ============================================================

function createPerformanceChart(
    history
) {

    const canvas =
        document.getElementById(
            "performance-chart"
        );


    if (!canvas) {

        return;

    }


    const ctx =
        canvas.getContext("2d");


    if (!ctx) {

        return;

    }


    // --------------------------------------------------------
    // CANVAS SIZE
    // --------------------------------------------------------

    canvas.width = 700;

    canvas.height = 350;


    const width =
        canvas.width;


    const height =
        canvas.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------------------------------
    // NO DATA
    // --------------------------------------------------------

    if (
        !history ||
        history.length === 0
    ) {

        ctx.font =
            "18px Arial";


        ctx.textAlign =
            "center";


        ctx.fillStyle =
            "#555";


        ctx.fillText(
            "Complete some quizzes to see your performance.",
            width / 2,
            height / 2
        );


        return;

    }


    // --------------------------------------------------------
    // SCORES
    // --------------------------------------------------------

    const scores =
        history.map(
            function (quiz) {

                return Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            quiz.percentage
                        ) || 0
                    )
                );

            }
        );


    const padding = 55;


    const chartWidth =
        width -
        padding * 2;


    const chartHeight =
        height -
        padding * 2;


    const bottom =
        height -
        padding;


    // --------------------------------------------------------
    // AXES
    // --------------------------------------------------------

    ctx.beginPath();


    ctx.moveTo(
        padding,
        padding
    );


    ctx.lineTo(
        padding,
        bottom
    );


    ctx.lineTo(
        width - padding,
        bottom
    );


    ctx.strokeStyle =
        "#999";


    ctx.lineWidth =
        1;


    ctx.stroke();


    // --------------------------------------------------------
    // Y AXIS
    // --------------------------------------------------------

    ctx.font =
        "12px Arial";


    ctx.textAlign =
        "right";


    ctx.fillStyle =
        "#333";


    for (
        let percentage = 0;
        percentage <= 100;
        percentage += 20
    ) {

        const y =
            bottom -
            (
                percentage /
                100
            ) *
            chartHeight;


        ctx.fillText(
            percentage + "%",
            padding - 10,
            y + 4
        );


        ctx.beginPath();


        ctx.moveTo(
            padding,
            y
        );


        ctx.lineTo(
            width - padding,
            y
        );


        ctx.strokeStyle =
            "#eeeeee";


        ctx.stroke();

    }


    // --------------------------------------------------------
    // POINTS
    // --------------------------------------------------------

    const points =
        scores.map(
            function (
                value,
                index
            ) {

                let x;


                if (
                    scores.length === 1
                ) {

                    x =
                        width / 2;

                }

                else {

                    x =
                        padding +
                        (
                            index /
                            (
                                scores.length - 1
                            )
                        ) *
                        chartWidth;

                }


                const y =
                    bottom -
                    (
                        value /
                        100
                    ) *
                    chartHeight;


                return {

                    x: x,

                    y: y,

                    score: value

                };

            }
        );


    // --------------------------------------------------------
    // LINE
    // --------------------------------------------------------

    ctx.beginPath();


    points.forEach(
        function (
            point,
            index
        ) {

            if (
                index === 0
            ) {

                ctx.moveTo(
                    point.x,
                    point.y
                );

            }

            else {

                ctx.lineTo(
                    point.x,
                    point.y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#6c5ce7";


    ctx.lineWidth =
        3;


    ctx.stroke();


    // --------------------------------------------------------
    // POINTS
    // --------------------------------------------------------

    points.forEach(
        function (point) {

            ctx.beginPath();


            ctx.arc(
                point.x,
                point.y,
                6,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#6c5ce7";


            ctx.fill();


            ctx.font =
                "12px Arial";


            ctx.textAlign =
                "center";


            ctx.fillStyle =
                "#222";


            ctx.fillText(
                point.score + "%",
                point.x,
                point.y - 12
            );

        }
    );


    // --------------------------------------------------------
    // X AXIS LABELS
    // --------------------------------------------------------

    points.forEach(
        function (
            point,
            index
        ) {

            ctx.font =
                "12px Arial";


            ctx.textAlign =
                "center";


            ctx.fillStyle =
                "#333";


            ctx.fillText(
                "Quiz " +
                (index + 1),
                point.x,
                height - 20
            );

        }
    );

}


// ============================================================
// OPTIONAL SUBJECT PERFORMANCE CHART
// ============================================================
// Supports the canvas used in your current HTML:
// id="subjectPerformanceChart"
// ============================================================

function createSubjectPerformanceChart(
    history
) {

    const canvas =
        document.getElementById(
            "subjectPerformanceChart"
        );


    if (!canvas) {

        return;

    }


    const ctx =
        canvas.getContext("2d");


    if (!ctx) {

        return;

    }


    canvas.width = 700;

    canvas.height = 400;


    const width =
        canvas.width;


    const height =
        canvas.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const subjects = {};


    history.forEach(
        function (quiz) {

            const category =
                quiz.category;


            const percentage =
                Number(
                    quiz.percentage
                ) || 0;


            if (!category) {

                return;

            }


            if (
                !subjects[
                    category
                ]
            ) {

                subjects[
                    category
                ] = [];

            }


            subjects[
                category
            ].push(
                percentage
            );

        }
    );


    const categoriesList =
        Object.keys(
            subjects
        );


    if (
        categoriesList.length === 0
    ) {

        ctx.font =
            "18px Arial";


        ctx.textAlign =
            "center";


        ctx.fillStyle =
            "#555";


        ctx.fillText(
            "Complete a quiz to see subject performance.",
            width / 2,
            height / 2
        );


        return;

    }


    const values =
        categoriesList.map(
            function (category) {

                const scores =
                    subjects[
                        category
                    ];


                return Math.round(
                    scores.reduce(
                        function (
                            sum,
                            value
                        ) {

                            return (
                                sum +
                                value
                            );

                        },
                        0
                    ) /
                    scores.length
                );

            }
        );


    const left =
        70;


    const right =
        30;


    const top =
        40;


    const bottom =
        330;


    const chartWidth =
        width -
        left -
        right;


    const chartHeight =
        bottom -
        top;


    // --------------------------------------------------------
    // Y AXIS
    // --------------------------------------------------------

    ctx.beginPath();


    ctx.moveTo(
        left,
        top
    );


    ctx.lineTo(
        left,
        bottom
    );


    ctx.lineTo(
        width - right,
        bottom
    );


    ctx.strokeStyle =
        "#999";


    ctx.stroke();


    for (
        let value = 0;
        value <= 100;
        value += 20
    ) {

        const y =
            bottom -
            (
                value /
                100
            ) *
            chartHeight;


        ctx.font =
            "12px Arial";


        ctx.textAlign =
            "right";


        ctx.fillStyle =
            "#333";


        ctx.fillText(
            value + "%",
            left - 10,
            y + 4
        );


        ctx.beginPath();


        ctx.moveTo(
            left,
            y
        );


        ctx.lineTo(
            width - right,
            y
        );


        ctx.strokeStyle =
            "#eeeeee";


        ctx.stroke();

    }


    // --------------------------------------------------------
    // BARS
    // --------------------------------------------------------

    const spacing =
        chartWidth /
        categoriesList.length;


    const barWidth =
        Math.min(
            80,
            spacing * 0.55
        );


    categoriesList.forEach(
        function (
            category,
            index
        ) {

            const value =
                values[index];


            const barHeight =
                (
                    value /
                    100
                ) *
                chartHeight;


            const x =
                left +
                index *
                spacing +
                (
                    spacing -
                    barWidth
                ) / 2;


            const y =
                bottom -
                barHeight;


            ctx.fillStyle =
                "#6c5ce7";


            ctx.fillRect(
                x,
                y,
                barWidth,
                barHeight
            );


            ctx.font =
                "14px Arial";


            ctx.textAlign =
                "center";


            ctx.fillStyle =
                "#222";


            ctx.fillText(
                value + "%",
                x +
                barWidth / 2,
                y - 8
            );


            ctx.font =
                "12px Arial";


            ctx.fillText(
                formatCategory(
                    category
                ),
                x +
                barWidth / 2,
                bottom + 25
            );

        }
    );

}


// ============================================================
// INITIALIZE DASHBOARD CHARTS
// ============================================================

function refreshDashboardCharts() {

    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "quizHistory"
                )
            ) || [];

    }

    catch (error) {

        history = [];

    }


    createPerformanceChart(
        history
    );


    createSubjectPerformanceChart(
        history
    );

}


// ============================================================
// STARTUP MESSAGE
// ============================================================

console.log(
    "QuizMaster quiz.js loaded successfully."
);