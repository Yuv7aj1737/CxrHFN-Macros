const SUPABASE_URL =
    "https://bcrewixxvendicfxbfpb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_u6Hkn8hGCiAue-llQ9pJLA_ZHbwcmas";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard() {

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    /* USER NOT LOGGED IN */

    if (!session) {

        window.location.href = "auth.html";

        return;
    }


    const user = session.user;


    /* =========================
       USER EMAIL
    ========================= */

    const email =
        user.email || "Unknown";


    document.getElementById(
        "userEmail"
    ).textContent = email;


    document.getElementById(
        "welcomeEmail"
    ).textContent =
        "Logged in as " + email;


    /* =========================
       LOAD PROFILE
    ========================= */

    const {
        data: profile,
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();


    if (profileError) {

        console.error(
            "Profile error:",
            profileError
        );

    }


    if (!profile) {

        const {
            data: newProfile,
            error: createError
        } = await supabaseClient
            .from("profiles")
            .insert({

                id: user.id,

                country: "India"

            })
            .select()
            .single();


        if (!createError && newProfile) {

            showProfile(
                newProfile
            );

        } else {

            showDefaultProfile();

        }

    } else {

        showProfile(
            profile
        );

    }


    /* =========================
       LOAD PURCHASES
    ========================= */

    await loadPurchases(user.id);

}



/* =========================
   SHOW PROFILE
========================= */

function showProfile(profile) {

    document.getElementById(
        "username"
    ).textContent =
        profile.username ||
        "Not set";


    document.getElementById(
        "country"
    ).textContent =
        getCountryDisplay(
            profile.country
        );


    if (profile.created_at) {

        const date =
            new Date(
                profile.created_at
            );


        document.getElementById(
            "memberSince"
        ).textContent =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

    } else {

        document.getElementById(
            "memberSince"
        ).textContent =
            "Recently";

    }

}



/* =========================
   DEFAULT PROFILE
========================= */

function showDefaultProfile() {

    document.getElementById(
        "username"
    ).textContent =
        "Not set";


    document.getElementById(
        "country"
    ).textContent =
        "India 🇮🇳";


    document.getElementById(
        "memberSince"
    ).textContent =
        "Recently";

}



/* =========================
   COUNTRY DISPLAY
========================= */

function getCountryDisplay(country) {

    const countries = {

        India: "India 🇮🇳",

        USA: "USA 🇺🇸",

        Canada: "Canada 🇨🇦",

        UK: "UK 🇬🇧",

        Australia: "Australia 🇦🇺",

        Germany: "Germany 🇩🇪",

        France: "France 🇫🇷",

        Other: "Other 🌍"

    };


    return countries[country]
        || country
        || "India 🇮🇳";

}



/* =========================
   LOAD PURCHASES
========================= */

async function loadPurchases(userId) {

    const area =
        document.getElementById(
            "purchasesArea"
        );


    area.innerHTML = `
        <div class="loading">
            Loading purchases...
        </div>
    `;


    const {
        data: purchases,
        error
    } = await supabaseClient
        .from("purchases")
        .select("*")
        .eq("user_id", userId)
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Purchase error:",
            error
        );


        area.innerHTML = `
            <div class="loading">
                Unable to load purchases.
            </div>
        `;

        return;
    }


    /* NO PURCHASES */

    if (!purchases || purchases.length === 0) {

        showEmptyPurchases();

        return;
    }


    /* SHOW PURCHASES */

    area.innerHTML = "";


    purchases.forEach(
        purchase => {

            area.appendChild(
                createPurchaseCard(
                    purchase
                )
            );

        }
    );

}



/* =========================
   PURCHASE CARD
========================= */

function createPurchaseCard(
    purchase
) {

    const card =
        document.createElement(
            "div"
        );


    card.style.padding =
        "18px";

    card.style.marginBottom =
        "12px";

    card.style.borderRadius =
        "12px";

    card.style.background =
        "rgba(8, 14, 26, 0.8)";

    card.style.border =
        "1px solid rgba(75, 110, 155, 0.18)";


    const product =
        purchase.product_name
        || "Minecraft Macro";


    const duration =
        purchase.duration_months
        || 1;


    const price =
        purchase.price
        || 0;


    const currency =
        purchase.currency
        || "INR";


    const orderStatus =
        purchase.order_status
        || "pending";


    const activationStatus =
        purchase.activation_status
        || "pending";


    /* =========================
       ACTIVATION TEXT
    ========================= */

    let activationText =
        "Activation Pending";


    if (
        activationStatus
        === "active"
    ) {

        activationText =
            "Activation Active";

    }


    /* =========================
       DOWNLOAD
    ========================= */

    let downloadButton = "";


    if (
        purchase.download_url
    ) {

        downloadButton = `

            <a
                href="${escapeHtml(
                    purchase.download_url
                )}"
                target="_blank"
                style="
                    display:inline-block;
                    margin-top:12px;
                    padding:9px 14px;
                    border-radius:7px;
                    background:#3e9df5;
                    color:white;
                    text-decoration:none;
                    font-size:12px;
                    font-weight:700;
                "
            >
                Download Macro
            </a>

        `;

    }


    /* =========================
       CARD HTML
    ========================= */

    card.innerHTML = `

        <div style="
            display:flex;
            justify-content:space-between;
            gap:15px;
            align-items:flex-start;
        ">

            <div>

                <div style="
                    color:#526f91;
                    font-size:9px;
                    font-weight:700;
                    letter-spacing:1.5px;
                    margin-bottom:6px;
                ">
                    MINECRAFT MACRO
                </div>


                <h3 style="
                    font-size:18px;
                    margin-bottom:6px;
                ">
                    ${escapeHtml(product)}
                </h3>


                <div style="
                    color:#718096;
                    font-size:12px;
                ">
                    ${duration} Month${duration === 1 ? "" : "s"}
                </div>

            </div>


            <div style="
                color:#57b3ff;
                font-size:17px;
                font-weight:800;
            ">
                ${escapeHtml(currency)}
                ${Number(price).toFixed(2)}
            </div>

        </div>


        <div style="
            display:flex;
            gap:10px;
            flex-wrap:wrap;
            margin-top:16px;
        ">

            <span style="
                padding:5px 9px;
                border-radius:20px;
                background:rgba(70,130,220,0.08);
                color:#75aee0;
                font-size:10px;
                font-weight:700;
            ">
                Order: ${escapeHtml(orderStatus)}
            </span>


            <span style="
                padding:5px 9px;
                border-radius:20px;
                background:rgba(70,200,110,0.08);
                color:#63d890;
                font-size:10px;
                font-weight:700;
            ">
                ${activationText}
            </span>

        </div>


        ${downloadButton}

    `;


    return card;

}



/* =========================
   EMPTY PURCHASES
========================= */

function showEmptyPurchases() {

    const area =
        document.getElementById(
            "purchasesArea"
        );


    area.innerHTML = `

        <div class="empty-purchases">

            <div class="empty-icon">
                🛒
            </div>


            <h3>
                No purchases yet
            </h3>


            <p>
                Your purchased Minecraft macros
                will appear here after you complete
                an order.
            </p>


            <a
                href="index.html"
                class="store-button">

                Browse Macros

            </a>

        </div>

    `;

}



/* =========================
   HTML ESCAPE
========================= */

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}



/* =========================
   LOGOUT
========================= */

document
    .getElementById(
        "logoutButton"
    )
    .addEventListener(
        "click",
        async function () {

            const {
                error
            } =
                await supabaseClient
                .auth
                .signOut();


            if (error) {

                alert(
                    "Logout failed: "
                    + error.message
                );

                return;
            }


            window.location.href =
                "auth.html";

        }
    );



/* =========================
   START DASHBOARD
========================= */

loadDashboard();