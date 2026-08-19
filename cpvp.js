const durationButtons =
    document.querySelectorAll(".duration");

const priceElement =
    document.getElementById("price");

const buyButton =
    document.getElementById("buyButton");

const message =
    document.getElementById("purchaseMessage");


let selectedMonths = 1;
let selectedPrice = 299;


/* =========================
   DURATION SELECTION
========================= */

durationButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            durationButtons.forEach(
                item => {
                    item.classList.remove(
                        "active"
                    );
                }
            );


            button.classList.add(
                "active"
            );


            selectedMonths =
                Number(
                    button.dataset.months
                );


            selectedPrice =
                Number(
                    button.dataset.price
                );


            priceElement.textContent =
                "₹" +
                selectedPrice;

        }
    );

});


/* =========================
   BUY BUTTON
========================= */

buyButton.addEventListener(
    "click",
    () => {

        message.textContent =
            `Selected: ${selectedMonths} Month${
                selectedMonths === 1
                    ? ""
                    : "s"
            } — ₹${selectedPrice}`;

        /*
            Real payment system will be
            connected here later.
        */

    }
);