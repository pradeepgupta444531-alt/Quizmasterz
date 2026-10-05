// ========================================
// QUIZMASTER - APP.JS
// ========================================


// ========================================
// SHOW HOME PAGE
// ========================================

function showHome() {

    // Stop quiz timer
    if (typeof timer !== "undefined") {
        clearInterval(timer);
    }

    // Show home
    document.getElementById("home-page").style.display = "block";

    // Hide other pages
    document.getElementById("setup-page").style.display = "none";

    document.getElementById("quiz-page").style.display = "none";

    document.getElementById("result-page").style.display = "none";
    document.getElementById("review-page").style.display = "none";
document.getElementById("dashboard-page").style.display = "none";
}


// ========================================
// SHOW QUIZ SETUP
// ========================================

function openQuizSetup(category = "civil-engineering") {

    // Make sure the setup function from quiz.js exists
    if (typeof showQuizSetup === "function") {

        showQuizSetup(category);

    } else {

        console.error(
            "showQuizSetup() was not found."
        );

    }
}


// ========================================
// CREATE CATEGORY CARDS
// ========================================

function loadCategories() {

    const container =
        document.getElementById("category-container");


    // Check if category container exists
    if (!container) {

        console.error(
            "category-container was not found."
        );

        return;
    }


    // Clear existing cards
    container.innerHTML = "";


    // Check categories
    if (
        typeof categories === "undefined" ||
        typeof questionBank === "undefined"
    ) {

        console.error(
            "Categories or questionBank is not loaded."
        );

        return;
    }


    // Create cards
    categories.forEach(category => {

        const card =
            document.createElement("div");


        card.className =
            `category-card ${category.color}`;


        // Count questions
        const questionCount =
            questionBank.filter(
                question =>
                    question.category === category.id
            ).length;


        const available =
            questionCount > 0;


        // Card HTML
        card.innerHTML = `

            <div class="category-icon">
                ${category.icon}
            </div>

            <h3>
                ${category.name}
            </h3>

            <p>
                ${category.description}
            </p>

            <small>
                ${questionCount}
                question${questionCount !== 1 ? "s" : ""}
                available
            </small>

            <button
                class="category-btn"
                data-category="${category.id}">

                ${
                    available
                        ? "🚀 Start Quiz"
                        : "🔒 Coming Soon"
                }

            </button>

        `;


        // Find button
        const button =
            card.querySelector(".category-btn");


        // Enable only if questions exist
        if (available) {

            button.addEventListener(
                "click",
                () => {

                    showQuizSetup(
                        category.id
                    );

                }
            );

        } else {

            button.addEventListener(
                "click",
                () => {

                    comingSoon();

                }
            );

        }


        // Add card to page
        container.appendChild(card);

    });

}


// ========================================
// COMING SOON MESSAGE
// ========================================

function comingSoon() {

    alert(
        "🚀 This category is coming soon!"
    );

}


// ========================================
// INITIALIZE WEBSITE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "QuizMaster application loaded successfully!"
        );


        // Load categories
        loadCategories();


        // Make sure home is visible
        showHome();

    }
);