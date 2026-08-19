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
    document.getElementById("loginForm");

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


        message.style.color =
            "#7d899e";

        message.textContent =
            "Logging in...";


        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            message.style.color =
                "#ff7d7d";

            message.textContent =
                error.message;

            return;
        }


        if (data.user) {

            message.style.color =
                "#63d890";

            message.textContent =
                "Login successful!";


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 700);

        }

    }
);