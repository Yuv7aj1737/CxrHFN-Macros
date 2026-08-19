const SUPABASE_URL =
    "https://bcrewixxvendicfxbfpb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_u6Hkn8hGCiAue-llQ9pJLA_ZHbwcmas";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const message =
    document.getElementById("message");


function showLogin() {

    loginForm.style.display = "block";

    signupForm.style.display = "none";

    document
        .getElementById("loginTab")
        .classList.add("active");

    document
        .getElementById("signupTab")
        .classList.remove("active");

    message.textContent = "";
}


function showSignup() {

    loginForm.style.display = "none";

    signupForm.style.display = "block";

    document
        .getElementById("loginTab")
        .classList.remove("active");

    document
        .getElementById("signupTab")
        .classList.add("active");

    message.textContent = "";
}


/* LOGIN */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;


        message.textContent =
            "Logging in...";


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            message.textContent =
                error.message;

            return;
        }


        message.textContent =
            "Login successful!";


        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 700);

    }
);


/* SIGN UP */

signupForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("signupEmail").value;

        const password =
            document.getElementById("signupPassword").value;


        message.textContent =
            "Creating account...";


        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {
                    emailRedirectTo:
                        window.location.origin + "/auth.html"
                }

            });


        if (error) {

            message.textContent =
                error.message;

            return;
        }


        message.textContent =
            "Account created! Check your email to confirm your account.";

    }
);