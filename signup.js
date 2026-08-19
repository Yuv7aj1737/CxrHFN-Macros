const SUPABASE_URL =
    "https://bcrewixxvendicfxbfpb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_u6Hkn8hGCiAue-llQ9pJLA_ZHbwcmas";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


const form =
    document.getElementById("signupForm");

const message =
    document.getElementById("message");


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;


        message.textContent =
            "Creating account...";


        const {
            data,
            error
        } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password
            });


        if (error) {

            message.textContent =
                error.message;

            return;
        }


        if (data.user) {

            message.style.color =
                "#63d890";

            message.textContent =
                "Account created! Check your email if verification is required.";

        }

    }
);