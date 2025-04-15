document.addEventListener("DOMContentLoaded", () => {

    // Brett - this an example of retrieving the parts data from the legacy database.
    // Of course, feel free to either modify or just delete the code I've added to
    // this file - it's just here to get you started.
    // I have examples for other endpoints in the /tests directory that you can
    // reference if you'd like.
    // Thanks for everything you've been doing with the frontend thus far, (looks really good btw)
    // and let me know if you have any questions!
    async function getParts(searchQuery) {
        const res = await fetch(`/api/parts${searchQuery !== undefined ? `?search=${searchQuery}` : ""}`);
        const data = await res.json();
        console.log(data);
    }

    // Get just the parts that contain "windshi" in their description:
    getParts("windshi");

    // Get every part in the legacy database:
    getParts();

    // This is some starter code for processing a checkout.
    // This function should run when the user clicks "submit"
    // on the checkout form (see addEventListener call below).
    async function checkoutHandler(event) {
        // Ensures that the page does not refresh when we submit.
        event.preventDefault();

        // Note that the "#credit-card" here means that "credit-card"
        // is the name of the ID on a text <input /> field. These lines
        // get whatever value has currently been typed into the input
        // fields by the user (assuming that you've put id="credit-card",
        // id="expiration-date", etc. on the <input /> tags)
        const creditCard = document.querySelector("#credit-card").value;
        const expDate = document.querySelector("#expiration-date").value;
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const address = document.querySelector("#address").value;

        // Now we actually make the call to our backend using
        // the data that was typed into the form.
        const result = await fetch(`/api/checkout`, {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cc: creditCard,
                exp: expDate,
                name: name,
                email: email,
                address: address,

                // The items that they are purchasing are currently
                // hardcoded. Once we've implemented the cart, 
                // this will change.
                items: [
                  {
                    part_id: 104,
                    amount_ordered: 1,
                  },
                  {
                    part_id: 105,
                    amount_ordered: 4,
                  },
                ],
              }),
        });

        // This just checks that our endpoint did something
        const content = await result.json();
        console.log(content)
    }

    // Assuming that you have a form with an id of checkout, this will call
    // the checkoutHandler function when the user clicks submit.
    //document.querySelector("#checkout").addEventListener("submit", checkoutHandler);

    // So, essentially, the form might look like this:
    // <form id="checkout">
    //     <input type="text" id="credit-card"/>
    //     <input type="text" id="expiration-date"/>
    //     <input type="text" id="name"/>
    //     <input type="text" id="email"/>
    //     <input type="text" id="address"/>
    //     <button type="submit">Submit</button>
    // </form>

    // This is the end of the checkout starter code.
    // The rest of Brett's code starts below.

    const tabs = document.querySelectorAll(".tab-button");
    const display = document.getElementById("display");

    updateDisplay("home"); //Begin at home tab

    // Handle tab switching
    tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("tab-data");
      updateDisplay(tabName);
    });
  });

    // Update the display based on the tab
    function updateDisplay(tabName) {
        switch (tabName) {
            case "home":
                display.innerHTML = `
                    <h1 class="text-xl font-bold text-center">Welcome to Ege Auto Parts</h1>
                    <img src="images/EGE_AUTO.png" alt="logo" class="rounded-4xl size-64 shadow-secondary/50 outline-secondary outline-double place-self-center my-2">
                    <i class="text-center">Quality parts for all your auto needs</i>
                    
                `;
            break;
            case "products":
                display.innerHTML = `
                    <h1 class="text-xl font-bold">Products</h1>
                    <div class="card grid grid-cols-1 p-12 gap-2 bg-base-300 border-neutral border-2 h-9/10 overflow-y-auto">
                        <div class="btn grid grid-cols-2 bg-primary hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 tooltip tooltip-secondary">
                            <div class="flex gap-2 justify-start items-center">
                            <h3 class="font-bold truncate text-sm text-left align-center">part label idk</h3>
                            </div>
                            <div class="flex gap-2 justify-end items-center">
                            <p class="opacity-80 p-1 place-self-center text-xs w-16 sm:w-20 bg-base-300 border-neutral border-2 text-center">button</p>
                            </div>
                        </div>
                    </div>
                `;
            break;
            case "warehouse":
                display.innerHTML = `
                    <h1 class="text-xl font-bold">Warehouse Info</h1>
                    <div class="card grid grid-cols-1 p-12 gap-2 bg-base-300 border-neutral border-2 h-9/10 overflow-y-auto">
                        <div class="btn grid grid-cols-2 bg-primary hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 tooltip tooltip-secondary">
                            <div class="flex gap-2 justify-start items-center">
                            <h3 class="font-bold truncate text-sm text-left align-center">warehouse label idk</h3>
                            </div>
                            <div class="flex gap-2 justify-end items-center">
                            <p class="opacity-80 p-1 place-self-center text-xs w-16 sm:w-20 bg-base-300 border-neutral border-2 text-center">button</p>
                            </div>
                        </div>
                    </div>
                `;
            break;
            case "admin":
                display.innerHTML = `
                    <h1 class="text-xl font-bold">Admin Access</h1>
                    This is where the admin things go.
                `;
            break;
            case "cart":
                display.innerHTML = `
                    <h1 class="text-xl font-bold">Cart</h1>
                    <div class="card grid grid-cols-1 p-12 gap-2 bg-base-300 border-neutral border-2 h-9/10 overflow-y-auto">
                        <div class="btn grid grid-cols-2 bg-primary hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 tooltip tooltip-secondary">
                            <div class="flex gap-2 justify-start items-center">
                            <h3 class="font-bold truncate text-sm text-left align-center">cart label idk</h3>
                            </div>
                            <div class="flex gap-2 justify-end items-center">
                            <p class="opacity-80 p-1 place-self-center text-xs w-16 sm:w-20 bg-base-300 border-neutral border-2 text-center">button</p>
                            </div>
                        </div>
                    </div>
                    <form id="checkout">
                        <label for="credit-card">Credit Card:</label> <input type="text" id="credit-card" name ="credit-card"/><br>
                        <label for="expiration-date">Expiration Date:</label> <input type="text" id="expiration-date" name="expiration-date" required/><br>
                        <label for="name">Name:</label> <input type="text" id="name" name="name" required oninvalid="this.setCustomValidity('Please enter your name')" oninput="this.setCustomValidity('')"/><br>
                        <label for="email">E-mail:</label> <input type="text" id="email" name="email"/><br>
                        <label for="address">Address:</label> <input type="text" id="address" name="address"/><br>
                        <button type="submit">Submit</button>
                    </form>
                `;
                document.querySelector("#checkout").addEventListener("submit", checkoutHandler);

                /*
                     {"vendor":"VE001-99", **? // unsure of what a vendor is in this context... the location?
                     "trans":"907-670448-296",
                     "cc":"6011 1234 4321 1234",
                     "name":"John Doe",
                     "exp":"12/2026",
                     "amount":"654.32",
                     "brand":"discover",    ***
                     "authorization":"10432", ***
                     "timeStamp":1744747069232, ***
                     "_id":"67feba3d68830e001ec00786"} *** 

                     to_do: 
                     figure out timestame, id, and authorization generations
                     
                     ensure that all required fields are filled with valid information
                        If they are invalid, mark them and leave the other fields alone
                */
            break;
            default:
                display.innerHTML = `
                nothing here!'
            `;
        }
    }

});