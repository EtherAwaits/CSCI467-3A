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
    async function getAllOrders(query) {
        const res = await fetch(`/api/orders/${query !== undefined ? query : ""}`);
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

    // Sets order to complete.
    async function orderComplete(order) {
        const res = await fetch(`/api/orders/${order}/complete`, {
            method: "POST"
          });
        const data = await res.json();
        console.log(`/api/orders/${order}/complete`);
        return data;
    }

    // This endpoint updates the quantity of a single part
    async function addParts(order,num) {
    const res = await fetch(`/api/parts/${order}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: num,
      }),
    });
    const data = await res.json();
    console.log(data);
  }

    // Creates a weight bracket
    async function addWeight(minimum_weight, shipping_price) {
        const res = await fetch(`/api/weight-brackets`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                minimum_weight,
                shipping_price,
            }),
        });
        const data = await res.json();
        return data;
    }

    // DELETE /api/weight-brackets/[weight-bracket-ID]
    async function deleteWeight(order) {
        const res = await fetch(`/api/weight-brackets/${order}`, {
            method: "DELETE"
        });
        const data = await res.json();
        console.log(`${order}`);
        return data;
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

                    <div class="hero">
                    <div class="hero-content flex-col lg:flex-row">
                        <img
                        src="images/EGE_AUTO.png"
                        class="max-w-sm rounded-lg shadow-2xl" />
                        <div>
                        <h1 class="text-5xl font-bold">Welcome to Ege Auto Parts!</h1>
                        <p class="py-6">
                            Quality parts for all your auto needs
                        </p>
                        <button id="go-button" class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2">Shop Here</button>
                        </div>
                    </div>
                    </div>
                `;

                // Button to product page.
                const goButton = document.getElementById("go-button");
                goButton.addEventListener("click", () => {
                    updateDisplay("products");
                });

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
                // CART AREA
                refreshProduct(); 

                // Display products
                function refreshProduct(query = "") {
                    getParts(query).then((products) => {
                        const productList = document.getElementById("product-list");
                        productList.innerHTML = products.map(product => `
                            <tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-5 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                            <div>
                                <td class="p-2 flex"><img src="${product.pictureURL}" alt="${product.description}" class="size-10 rounded-lg" /><b class="mx-4">${product.description}</b></td>
                                <td class="p-2">$${product.price.toFixed(2)}</td>
                                <td class="p-2">${product.weight.toFixed(2)} lbs</td>
                                <td class="p-2">${product.quantity}</td>
                                <td class="p-2">
                                    <input type="number" min="1" max="${product.quantity}" value="1" class="input input-bordered w-16" id="quantity-${product.number}" />
                                    <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="add-to-cart-${product.number}">Add to Cart</button>
                                </td>
                            </div>
                            </tr>
                        `).join("");
                        // Button Functionality
                        const add_to_cart_btn = document.querySelectorAll("[id^='add-to-cart-']");
                        add_to_cart_btn.forEach((button) => {
                            button.addEventListener("click", (event) => {

                                // get the index of the button
                                const id = event.target.id; // "add-to-cart-##"
                                const index = parseInt(id.split("add-to-cart-")[1], 10);
                                console.log(index); // log the index

                                //  get the number from the quantity field
                                const qty2 = document.getElementById(`quantity-${index}`);
                                const ordQuantity = parseInt(qty2.value, 10);

                                // Get the product info
                                const product = products.find(product => product.number == index);

                                // localStorage.setItem("item", product.description);
                                // localStorage.setItem("quantity", ordQuantity);
                                // const name = localStorage.getItem("item");
                                // const qty = localStorage.getItem("quantity");

                                // console.log(name);
                                // console.log(qty);

                                const prevCart = JSON.parse(localStorage.getItem("cart") ?? "[]");

                                const currCart = prevCart.find(cartItem => cartItem.id === index)
                                    // If the item is already present, just update the new quantity
                                    ? prevCart.map(cartItem => cartItem.id === index
                                        ? ({ ...cartItem, quantity: cartItem.quantity + ordQuantity})
                                        : cartItem
                                      )
                                    // Otherwise, create a new item
                                    : [...prevCart, { id: index, name: product.description, quantity: ordQuantity}]

                                localStorage.setItem("cart", JSON.stringify(currCart));

                                const storedCart = JSON.parse(localStorage.getItem("cart"));
                                console.log(storedCart[0].name); // "Sprocket"

                                //orderComplete(event.target.getAttribute("num"));
                                
                                //write calls to local storage here.
                                
                            });
                        });
                    });



                }

                // Function for the search bar
                const searchInput = document.getElementById("product-search");
                searchInput.addEventListener("input", (event) => {
                    refreshProduct(event.target.value.trim());
                });

                break;
            case "orders":
                display.innerHTML = `
                    <h1 class="text-xl font-bold my-4">📋Open Orders</h1>
                    
                    <table class="table-auto w-full my-4">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-7 rounded-2xl ">
                                <th class="p-2">Order ID</th>
                                <th class="p-2">Customer</th>
                                <th class="p-2">Total</th>
                                <th class="p-2">Weight</th>
                                <th class="p-2"></th>
                                <th class="p-2"></th>
                                <th class="p-2"></th>
                            </tr>
                        </thead>
                        <tbody id="product-list">
                        </tbody>
                    </table>
                `;

                refreshOrder();

                // Display orders
                function refreshOrder(query = "") {
                    getOrders().then((orders) => {
                        const productList = document.getElementById("product-list");
                        productList.innerHTML = orders.map(orders => `
                            <tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-6 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                            <div>
                                <td class="p-2">${orders.order_id}</b></td>
                                <td class="p-2"><b>${orders.customer_name}</b></td>
                                <td class="p-2">$${(orders.base_price + orders.shipping_price).toFixed(2)}</td>
                                <td class="p-2">${orders.total_weight.toFixed(2)} lbs</td>
                                <td class="p-2">
                                    <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="complete-${orders.order_id}" num="${orders.order_id}">Complete Order</button>
                                </td>
                                <td class="p-2">
                                    <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="invoice-${orders.order_id}" num="${orders.order_id}">Print Invoice</button>
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
                                setTimeout(() => { refreshOrder(); }, 250); // Slight delay to give time for db to update
                            });
                        });

                        // Invoice Button
                        const invoiceButtons = document.querySelectorAll("[id^='invoice-']");
                        invoiceButtons.forEach(button => {
                            button.addEventListener("click", (event) => {
                                const id = event.target.getAttribute("num");

                                getAllOrders(id).then(order => {
                                    let invoice = `
                                        <h1 align='center'>Invoice</h1>
                                        <p align='center'>Ege Auto Parts</p>
                                        <p align='center'>For Order ID ${id}</p>
                                        <table>
                                            <tr>
                                                <th align='right'>Product</th>
                                                <th align='right'>Qty</th>
                                                <th align='right'>Rate</th>
                                                <th align='right'>Amount</th>
                                            </tr>
                                    `;

                                    order.items.forEach(part => {
                                        const partTotal = Math.round(part.price * part.amount_ordered * 100) / 100;
                                        const strPartTotal = `$${partTotal.toFixed(2)}`;
                                        invoice += `<tr><td align='right' width='300px'>${part.description}</td><td align='right' width='50px'>${part.amount_ordered}</td><td align='right' width='100px'>$${part.price.toFixed(2)}</td><td align='right' width='100px'>${strPartTotal}</td></tr>`;
                                    });

                                    invoice += `<tr><td><br></td></tr>`

                                    invoice += `<tr><td></td><td></td><td align='right' width='100px'>Subtotal:</td><td align='right'>$${order.base_price.toFixed(2)}</td></tr>`;
                                    invoice += `<tr><td></td><td></td><td align='right' width='100px'>Shipping:</td><td width='100px' align='right'>$${order.shipping_price.toFixed(2)}</td></tr>`;
                                    invoice += `<tr><td></td><td></td><td align='right' width='100px'>Total:</td><td width='100px' align='right'>$${(order.base_price + order.shipping_price).toFixed(2)}</td></tr></table>`;

                                    const iframe = document.createElement('iframe');

                                    iframe.onload = () => {
                                        const doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
                                        doc.getElementsByTagName('body')[0].innerHTML = invoice;

                                        iframe.contentWindow.focus(); // This is key, the iframe must have focus first
                                        iframe.contentWindow.print();
                                    }

                                    document.getElementsByTagName('body')[0].appendChild(iframe);
                                    iframe.remove();
                                })
                            })
                        })
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
                                <td class="p-2">${product.weight.toFixed(2)} lbs</td>
                                <td class="p-2">${product.quantity}</td>
                                <td class="p-2">
                                    <input type="number" min="1" max="${product.quantity}" value="1" class="input input-bordered w-16" id="quantity-${product.number}" />
                                    <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="add-to-cart-${product.number}" q="${product.quantity}" num="${product.number}">Add Inventory</button>
                                </td>
                            </div>
                            </tr>
                        `).join("");

                        // Button Functionality
                        const completeButtons = document.querySelectorAll("[id^='add-to-cart-']");
                        completeButtons.forEach((button) => {
                            button.addEventListener("click", (event) => {
                                console.log("clicked");
                                const order = event.target.getAttribute("num");           
                                const input = document.getElementById(`quantity-${order}`).value;
                                const q = event.target.getAttribute("q"); 
                                const num = Number(input) + Number(q);
                                addParts(order,num);
                                setTimeout(() => { refreshProducts(); }, 250); // Slight delay to give time for db to update
                            });
                        });
                        
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
                    
                    <table class="table-auto my-4 w-132">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-4 rounded-2xl ">
                                <th class="p-2">Weight Range</th>
                                <th class="p-2">Cost</th>
                                <th class="p-2"></th>
                                <th class="p-2"></th>
                            </tr>
                        </thead>
                        <tbody id="weight-list">
                        </tbody>
                    </table>
                    
                    <i class="text-l">Add Bracket</i>
                    <div class="card grid grid-cols-3 p-4 gap-2 w-1/2">

                        <label for="weight" class="input">                           
                        <span class="label">Weight</span>
                        <input type="number" id="weight" name ="weight" class=""/></label>

                        <label for="cost" class="input">                           
                        <span class="label">Cost</span>
                        <input type="number" id="cost" name ="cost" class=""/></label>

                        <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="create-button">Create</button>
                    </div>

                    <h1 class="text-xl font-bold">All Orders</h1>
                    <i class="text-m">Filters</i>

                    <div class="card grid grid-cols-2 p-4 gap-2 w-132">
                    
                        <label class="input">
                        <span class="label">Min Date</span>
                        <input type="date" id="min-date"/>
                        </label>

                        <label class="input">
                        <span class="label">Max Date</span>
                        <input type="date" id="max-date"/>
                        </label>

                        <label for="min-prize" class="input">                           
                        <span class="label">Min Prize</span>
                        <input type="text" id="min-prize" name ="min-prize" class=""/></label>

                        <label for="max-prize" class="input">                           
                        <span class="label">Max Prize</span>
                        <input type="text" id="max-prize" name ="max-prize" class=""/></label>

                        <label class="select">
                        <span class="label">Status</span>
                        <select class="select">
                        <option selected></option>
                        <option>Authorized</option>
                        <option>Shipped</option>
                        </select>
                        </label>

                        <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="filter-button">Filter</button>
                    </div>

                    <table class="table-auto w-full my-4">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-5 rounded-2xl" id="status">
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

                refreshWeights();
                refreshOrders();

                // Display Weights
                getWeights();
                function refreshWeights() {
                    getWeights().then((weights) => {
                        // Sort weights by minimum_weight in ascending order
                        weights.sort((a, b) => a.minimum_weight - b.minimum_weight);

                        const weightList = document.getElementById("weight-list");
                        weightList.innerHTML = weights.map((weight, index) => {
                            const nextMinWeight = weights[index + 1]?.minimum_weight - 1 || "∞"; // Use the next bracket's minimum or infinity
                            return `
                                <tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-3 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                                <div>
                                    <td class="p-2">${weight.minimum_weight} lbs to ${nextMinWeight} lbs</b></td>
                                    <td class="p-2"><b>$${weight.shipping_price.toFixed(2)}</b></td>
                                    <td class="p-2">
                                        <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="delete-${weight.weight_bracket_id}" num="${weight.weight_bracket_id}">Delete</button>
                                    </td>
                                </div>
                                </tr>
                            `;
                        }).join("");

                        const deleteButtons = document.querySelectorAll("[id^='delete-']");
                        deleteButtons.forEach((button) => {
                            button.addEventListener("click", (event) => {
                                console.log("clicked");
                                const order = event.target.getAttribute("num");           
                                deleteWeight(order);
                                setTimeout(() => { refreshWeights(); }, 250); // Slight delay to give time for db to update
                            });
                        });

                    });
                }

                // Create Bracket
                const createButton = document.getElementById("create-button");
                createButton.addEventListener("click", () => {
                    const weight = document.getElementById("weight").value;
                    const cost = document.getElementById("cost").value;
                    addWeight(weight,cost);
                    setTimeout(() => { refreshWeights(); }, 250); // Slight delay to give time for db to update
                });

                // Sorting functionality
                const minDate = document.querySelector("#min-date");
                const maxDate = document.querySelector("#max-date");
                const minPrize = document.querySelector("#min-prize");
                const maxPrize = document.querySelector("#max-prize");
                const status = document.querySelector("#status");
                const filterButton = document.getElementById("filter-button");
                filterButton.addEventListener("click", () => {
                    const minDateValue = minDate.value;
                    const maxDateValue = maxDate.value;
                    const minPrizeValue = minPrize.value;
                    const maxPrizeValue = maxPrize.value;
                    const statusValue = status.value;

                    let query = `?`;
                    if (minDateValue) query += `lowDate=${minDateValue}&`;
                    if (maxDateValue) query += `highDate=${maxDateValue}&`;
                    if (minPrizeValue) query += `lowPrice=${minPrizeValue}&`;
                    if (maxPrizeValue) query += `highPrice=${maxPrizeValue}&`;
                    if (statusValue) query += `status=${statusValue}&`;

                    console.log(query);
                    refreshOrders(query);
                });
                
                // Display orders
                function refreshOrders(query = "") {
                    getAllOrders(query).then((orders) => {
                        const productList = document.getElementById("product-list");
                        productList.innerHTML = orders.map(orders => `
                            <tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-5 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                            <div>
                                <td class="p-2">${orders.order_id}</b></td>
                                <td class="p-2"><b>${orders.is_complete === 1 ? "Completed" : "Authorized"}</b></td>
                                <td class="p-2">$${(orders.base_price + orders.shipping_price).toFixed(2)}</td>
                                <td class="p-2">${orders.date_placed}</td>
                                <td class="p-2">
                                    <button class="btn bg-secondary text-white hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="view-${orders.order_id}" num="${orders.order_id}">View Order</button>
                                </td>
                            </div>
                            </tr>
                        `).join("");

                    // View Order
                    const viewOrder = document.querySelectorAll("[id^='view-']");
                    viewOrder.forEach((button) => {
                        button.addEventListener("click", (event) => {
                            
                            const order = event.target.getAttribute("num");    
                            console.log(order);
                            Selectorder = getAllOrders(order).then((orders) => {
                                if (Selectorder) {
                                    display.innerHTML = `
                                        <h1 class="text-xl font-bold my-4">📦 Order Details</h1>
                                        <p><strong>Order ID:</strong> ${orders.order_id}</p>
                                        <p><strong>Customer Name:</strong> ${orders.customer_name}</p>
                                        <p><strong>Status:</strong> ${orders.is_complete === 1 ? "Completed" : "Authorized"}</p>
                                        <p><strong>Total Price:</strong> $${(orders.base_price + orders.shipping_price).toFixed(2)}</p>
                                        <p><strong>Total Weight:</strong> ${orders.total_weight.toFixed(2)} lbs</p>
                                        <p><strong>Date Placed:</strong> ${orders.date_placed}</p>
                                        <p><strong>Shipping Address:</strong> ${orders.mailing_address}</p>
                                        <p><strong>E-mail:</strong> ${orders.email}</p>
                                        <p><strong>Authorization:</strong> ${orders.authorization_number}</p>
                                        ${orders.items.map(item => `
                                            <div class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-4 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                                            <p class="mx-4"><strong>Part ID:</strong> ${item.part_id}</p>
                                            <p><strong>Description:</strong> ${item.description}</p>
                                            <p><strong>Amount Ordered:</strong> ${item.amount_ordered}</p>
                                            <p><strong>Weight:</strong> ${item.weight}</p>
                                            </div>
                                        `).join("")}
                                       
                                        <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 mt-4" id="back-button">Back</button>
                                    `;

                                    const backButton = document.getElementById("back-button");
                                    backButton.addEventListener("click", () => {
                                        updateDisplay("admin");
                                    });
                                } else {
                                    console.error("Order not found");
                                }
                            });
                        });
                            });
                        });
                  
                }

            break;
            case "cart":
                display.innerHTML = `
                    <h1 class="text-xl font-bold my-4">🛒Cart</h1>
                    
                    <table class="table-auto w-1/2 my-4">
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
                        <tbody id="product-list"></tbody>
                    </table>

                    <h1 class="text-xl font-bold">Checkout</h1>

                    <form id="checkout" class="">
                        <div class="card grid grid-cols-1 p-4 gap-2 w-1/2">

                            <label for="name" class="input">
                            <span class="label">Name</span>
                            <input type="text" id="name" name="name" class="" required oninvalid="this.setCustomValidity('Please enter your name')" oninput="this.setCustomValidity('')"/></label> 

                            <label for="credit-card" class="input">                           
                            <span class="label">Credit Card #</span>
                            <input type="text" id="credit-card" name ="credit-card" class=""/></label>

                            <label for="expiration-date" class="input">
                            <span class="label">Expiration Date</span>
                            <input type="text" id="expiration-date" name="expiration-date" class="" required/></label>
                            
                            <label for="email" class="input">
                             <span class="label">E-mail</span>
                            <input type="text" id="email" name="email" class=""/></label> 
                            
                            <label for="address" class="input">
                             <span class="label">Address</span>
                            <input type="text" id="address" name="address" class=""/></label> 
                            
                            <button type="submit" class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 w-1/3">Submit</button>
                        </div>
                    </form>
                `;

                function refreshCart() {
                    getParts().then((products) => {
                        const productList = document.getElementById("product-list");
                        productList.innerHTML = JSON.parse(localStorage.getItem("cart") ?? "[]").map(cartItem => {

                            const part = products.find(product => product.number === cartItem.id);
                            if (!part) return `<tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-5 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50"><div><td class="p-2">Error: Cart item not in parts query</td></div></tr>`;

                            return `<tr class="bg-base-300 hover:outline-3 hover:outline-accent rounded-2xl grid grid-cols-5 gap-2 my-2 hover:shadow-lg hover:shadow-accent/50">
                                        <div>
                                            <td class="p-2">${part.description}</td>
                                            <td class="p-2">$${part.price.toFixed(2)}</td>
                                            <td class="p-2">${part.weight.toFixed(2)} lbs</td>
                                            <td class="p-2">${cartItem.quantity}</td>
                                            <td class="p-2">
                                                <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="remove-from-cart-${cartItem.id}">Remove</button>
                                            </td>
                                        </div>
                                    </tr>
                        `}).join("");
                        
                        document.querySelectorAll("[id^='remove-from-cart-']").forEach(btn => btn.addEventListener("click", 
                            (e) => {
                                const id = e.target.id.split("remove-from-cart-")[1];

                                const prevCart = JSON.parse(localStorage.getItem("cart") ?? "[]");
                                const newCart = prevCart.filter(cartItem => cartItem.id !== Number(id));
                                
                                localStorage.setItem("cart", JSON.stringify(newCart));
                                
                                refreshCart();
                            }
                        ));
                    })
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

                    const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
                    if (!Array.isArray(cart) || cart.length < 1) return;

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
                            items: cart.map(cartItem => ({
                                part_id: cartItem.id,
                                amount_ordered: cartItem.quantity
                            }))
                        }),
                    });

                    // This just checks that our endpoint did something
                    const content = await result.json();

                    localStorage.removeItem("cart");
                    refreshCart();


                    console.log(content);
                }

                refreshCart();

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