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
        return data;
    }

    // Gets all authorized orders for order page.
    async function getOrders() {
        const res = await fetch(`/api/orders?status=authorized`);
        const data = await res.json();
        console.log(data);
        return data;
    }

    // Gets all orders for admin page.
    async function getAllOrders() {
        const res = await fetch(`/api/orders`);
        const data = await res.json();
        console.log(data);
        return data;
    }

    // Gets all Weight Brackets for admin page. Doesnt seem to work yet.
    async function getWeights() {
        const res = await fetch(`/api/weight-brackets`);
        const data = await res.json();
        console.log(data);
        return data;
    }

    // Gets all Weight Brackets for admin page. Doesnt seem to work yet.
    async function orderComplete(order) {
        const res = await fetch(`/api/orders/${order}/complete`);
        const data = await res.json();
        console.log(`/api/orders/${order}/complete`);
        return data;
    }

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
    // document.querySelector("#checkout").addEventListener("submit", checkoutHandler);

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
                <h1 class="text-xl font-bold my-4">🏠Home</h1>
                    <h1 class="text-xl font-bold text-center">Welcome to Ege Auto Parts</h1>
                    <img src="images/EGE_AUTO.png" alt="logo" class="rounded-4xl size-64 shadow-secondary/50 outline-secondary outline-double place-self-center my-2">
                    <i class="text-center">Quality parts for all your auto needs</i>
                `;
            break;
            case "products":
                display.innerHTML = `
                    <h1 class="text-xl font-bold my-4">👨‍🔧Products</h1>

                    <label class="input input-lg">
                        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" required placeholder="Search" id="product-search" />
                    </label>

                    <table class="table-auto w-full my-4">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-6 rounded-2xl ">
                                <th class="p-2">Product</th>
                                <th class="p-2">Price</th>
                                <th class="p-2">Weight</th>
                                <th class="p-2">In Stock</th>
                                <th class="p-2"></th>
                                <th class="p-2"></th>
                            </tr>
                        </thead>
                        <tbody id="product-list">
                        </tbody>
                    </table>
                `;

                refreshProducts(); 

                // Display products
                function refreshProducts(query = "") {
                    getParts(query).then((products) => {
                        const productList = document.getElementById("product-list");
                        productList.innerHTML = products.map(product => `
                            <tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-5 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                            <div>
                                <td class="p-2 flex"><img src="${product.pictureURL}" alt="${product.description}" class="size-10 rounded-lg" /><b class="mx-4">${product.description}</b></td>
                                <td class="p-2">$${product.price.toFixed(2)}</td>
                                <td class="p-2">${product.weight.toFixed(2)}</td>
                                <td class="p-2">${product.quantity}</td>
                                <td class="p-2">
                                    <input type="number" min="1" max="${product.quantity}" value="1" class="input input-bordered w-16" id="quantity-${product.number}" />
                                    <button class="btn bg-primary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 tooltip tooltip-secondary" id="add-to-cart-${product.number}">Add to Cart</button>
                                </td>
                            </div>
                            </tr>
                        `).join("");
                    });
                }

                // Function for the search bar
                const searchInput = document.getElementById("product-search");
                searchInput.addEventListener("input", (event) => {
                    refreshProducts(event.target.value.trim());
                });

                break;
            case "orders":
                display.innerHTML = `
                    <h1 class="text-xl font-bold my-4">📋Open Orders</h1>
                    
                    <table class="table-auto w-full my-4">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-6 rounded-2xl ">
                                <th class="p-2">Order ID</th>
                                <th class="p-2">Customer</th>
                                <th class="p-2">Total</th>
                                <th class="p-2">Weight</th>
                                <th class="p-2"></th>
                                <th class="p-2"></th>
                            </tr>
                        </thead>
                        <tbody id="product-list">
                        </tbody>
                    </table>
                `;

                refreshOrders();

                // Display orders
                function refreshOrders(query = "") {
                    getOrders().then((orders) => {
                        const productList = document.getElementById("product-list");
                        productList.innerHTML = orders.map(orders => `
                            <tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-5 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                            <div>
                                <td class="p-2">${orders.order_id}</b></td>
                                <td class="p-2"><b>${orders.customer_name}</b></td>
                                <td class="p-2">$${(orders.base_price + orders.shipping_price).toFixed(2)}</td>
                                <td class="p-2">${orders.total_weight.toFixed(2)}</td>
                                <td class="p-2">
                                    <button class="btn bg-primary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 tooltip tooltip-secondary" id="complete-${orders.order_id}" num="${orders.order_id}">Complete Order</button>
                                </td>
                            </div>
                            </tr>
                        `).join("");

                        // Button Functionality
                        const completeButtons = document.querySelectorAll("[id^='complete-']");
                        completeButtons.forEach((button) => {
                            button.addEventListener("click", (event) => {
                                console.log("clicked");
                                orderComplete(event.target.getAttribute("num"));
                            });
                        });
                    });
                }
            
            break;
            case "receiving":
                display.innerHTML = `
                    <h1 class="text-xl font-bold my-4">📦Receiving</h1>

                    <label class="input input-lg">
                        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" required placeholder="Search" id="product-search" />
                    </label>

                    <table class="table-auto w-full my-4">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-7 rounded-2xl ">
                                <th class="p-2">Product</th>
                                <th class="p-2">ID</th>
                                <th class="p-2">Price</th>
                                <th class="p-2">Weight</th>
                                <th class="p-2">In Stock</th>
                                <th class="p-2"></th>
                                <th class="p-2"></th>
                            </tr>
                        </thead>
                        <tbody id="product-list">
                        </tbody>
                    </table>
                `;

                refreshProducts();

                // Display products
                function refreshProducts(query = "") {
                    getParts(query).then((products) => {
                        const productList = document.getElementById("product-list");
                        productList.innerHTML = products.map(product => `
                            <tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-6 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                            <div>
                                <td class="p-2 flex"><img src="${product.pictureURL}" alt="${product.description}" class="size-10 rounded-lg" /><b class="mx-4">${product.description}</b></td>
                                <td class="p-2">${product.number}</td>
                                <td class="p-2">$${product.price.toFixed(2)}</td>
                                <td class="p-2">${product.weight.toFixed(2)}</td>
                                <td class="p-2">${product.quantity}</td>
                                <td class="p-2">
                                    <input type="number" min="1" max="${product.quantity}" value="1" class="input input-bordered w-16" id="quantity-${product.number}" />
                                    <button class="btn bg-primary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 tooltip tooltip-secondary" id="add-to-cart-${product.number}">Add Inventory</button>
                                </td>
                            </div>
                            </tr>
                        `).join("");
                    });
                }

                // Function for the search bar
                const searchIn = document.getElementById("product-search");
                searchIn.addEventListener("input", (event) => {
                    refreshProducts(event.target.value.trim());
                });

            break;
            case "admin":
                display.innerHTML = `
                    <h1 class="text-xl font-bold my-4">🔒Admin Panel</h1>

                    <h1 class="text-xl font-bold">Weight Brackets</h1>
                    
                    <table class="table-auto w-full my-4">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-3 rounded-2xl ">
                                <th class="p-2">Weight Range</th>
                                <th class="p-2">Cost</th>
                                <th class="p-2"></th>
                            </tr>
                        </thead>
                        <tbody id="weight-list">
                        </tbody>
                    </table>
                    
                    <i class="text-l">Add Bracket</i>
                    <div class="card grid grid-cols-3 p-4 gap-2 w-1/2">
                        <input type="number" placeholder="Weight" class="input" />
                        <input type="number" placeholder="Cost" class="input" />
                        <button class="btn">Create</button>
                    </div>

                    <h1 class="text-xl font-bold">All Orders</h1>
                    <i class="text-m">Filters</i>

                    <div class="card grid grid-cols-2 p-4 gap-2 w-1/2">
                        <button popovertarget="cally-popover1" class="input input-border" id="cally1" style="anchor-name:--cally1">
                        Start Date
                        </button>
                        <div popover id="cally-popover1" class="dropdown bg-base-100 rounded-box shadow-lg" style="position-anchor:--cally1">
                        <calendar-date class="cally" onchange={document.getElementById('cally1').innerText = this.value}>
                            <svg aria-label="Previous" class="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                            <svg aria-label="Next" class="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                            <calendar-month></calendar-month>
                        </calendar-date>
                        </div>
                        <button popovertarget="cally-popover1" class="input input-border" id="cally1" style="anchor-name:--cally1">
                        End Date
                        </button>
                        <div popover id="cally-popover1" class="dropdown bg-base-100 rounded-box shadow-lg" style="position-anchor:--cally1">
                        <calendar-date class="cally" onchange={document.getElementById('cally1').innerText = this.value}>
                            <svg aria-label="Previous" class="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                            <svg aria-label="Next" class="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                            <calendar-month></calendar-month>
                        </calendar-date>
                        </div>

                        <input type="text" placeholder="Min Prize" class="input" />
                        <input type="text" placeholder="Max Prize" class="input" />

                        <select class="select">
                        <option disabled selected>Order Status</option>
                        <option>Authorized</option>
                        <option>Shipped</option>
                        </select>
                    </div>

                    <table class="table-auto w-full my-4">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-5 rounded-2xl ">
                                <th class="p-2">Order ID</th>
                                <th class="p-2">Status</th>
                                <th class="p-2">Total</th>
                                <th class="p-2">Date Ordered</th>
                                <th class="p-2"></th>
                            </tr>
                        </thead>
                        <tbody id="product-list">
                        </tbody>
                    </table>
                `;

                // getWeights(); no worky :(

                refreshOrders();

                // Display orders
                function refreshOrders(query = "") {
                    getAllOrders().then((orders) => {
                        const productList = document.getElementById("product-list");
                        productList.innerHTML = orders.map(orders => `
                            <tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-5 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                            <div>
                                <td class="p-2">${orders.order_id}</b></td>
                                <td class="p-2"><b>${orders.is_complete === 1 ? "Completed" : "Authorized"}</b></td>
                                <td class="p-2">$${(orders.base_price + orders.shipping_price).toFixed(2)}</td>
                                <td class="p-2">${orders.date_placed}</td>
                                <td class="p-2">
                                    <button class="btn bg-primary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 tooltip tooltip-secondary" id="view-${orders.order_id}">View Order</button>
                                </td>
                            </div>
                            </tr>
                        `).join("");
                    });
                }

            break;
            case "cart":
                display.innerHTML = `
                    <h1 class="text-xl font-bold my-4">🛒Cart</h1>
                    
                    <table class="table-auto w-full my-4">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-6 rounded-2xl ">
                                <th class="p-2">Product</th>
                                <th class="p-2">Price</th>
                                <th class="p-2">Weight</th>
                                <th class="p-2">Quantity</th>
                                <th class="p-2"></th>
                                <th class="p-2"></th>
                            </tr>
                        </thead>
                        <tbody id="product-list">
                        </tbody>
                    </table>
                `;
            break;
            default:
                display.innerHTML = `
                nothing here!'
            `;
        }
    }

});