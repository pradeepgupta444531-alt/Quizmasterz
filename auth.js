// ========================================
// QUIZMASTER AUTHENTICATION
// ========================================

// Your Supabase project URL
const SUPABASE_URL = "https://izefodhambfytokguxdf.supabase.co";

// Your Supabase anon/public key
const SUPABASE_ANON_KEY = "sb_publishable_dBHjyzwjd7ZqgO00mo901Q_VGXkbvN9";


// Create Supabase client
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ========================================
// REGISTER USER
// ========================================

async function registerUser() {

    const name =
        document.getElementById("register-name")?.value.trim();

    const email =
        document.getElementById("register-email")?.value.trim();

    const password =
        document.getElementById("register-password")?.value;


    if (!name || !email || !password) {

        alert("Please fill all fields.");

        return;
    }


    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");

        return;
    }


    console.log("Registering user...");


    const {
        data,
        error
    } = await supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {

            data: {
                name: name
            }

        }

    });


    if (error) {

        console.error(
            "Registration error:",
            error
        );

        alert(
            "Registration failed: " +
            error.message
        );

        return;
    }


    console.log(
        "Registration successful:",
        data
    );


    alert(
        "Registration successful!"
    );
}
// ========================================
// OPEN REGISTER PAGE
// ========================================

function openRegister() {

    console.log("Opening register page...");

    if (typeof hideAllPages === "function") {
        hideAllPages();
    }

    const registerPage =
        document.getElementById("register-page");

    if (registerPage) {

        registerPage.style.display = "block";

    } else {

        console.error(
            "register-page element was not found."
        );

    }
}