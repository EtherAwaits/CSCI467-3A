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
    updateCartIndicator(); // Update cart count on load

    // Handle tab switching
    tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
            const tabName = tab.getAttribute("tab-data");
            updateDisplay(tabName);
        });
    });

    // Toast Alerts 
    function showToast(message, color = "bg-info") {
        const toast = document.createElement("div");
        toast.className = `toast toasty fixed bottom-1 right-1 p-3 text-white rounded-lg shadow-lg ${color}`;
        toast.style.transition = "opacity 0.5s ease";
        toast.textContent = message;

        // Remove previous toast if needed.
        if (document.querySelector(".toasty")) {
            document.querySelector(".toasty").remove();
        }
        document.body.appendChild(toast);

        // Fade out
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3000);
    } 

    function updateCartIndicator(){ // Update cart count indicator.
        const cart = document.getElementById("cart-indicator");
        const cartItems = JSON.parse(localStorage.getItem("cart") ?? "[]");
        if (cartItems.length > 0) { // Display cart size.
            const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
            cart.textContent = totalItems;
            cart.classList.remove("hidden");
        }
        else { // Hide if cart is empty.
            cart.textContent = 0;
            cart.classList.add("hidden");
        }

    } 


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
                        class="max-w-sm card shadow-2xl" />
                        <div>
                        <h1 class="text-5xl font-bold">Welcome to Ege Auto Parts!</h1>
                        <p class="py-6">
                            Quality parts for all your auto needs
                        </p>
                        <button id="go-button" class="btn-form">Shop Here</button>
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

                    <i id="product-count" class="text-sm"></i> 

                    <table class="table table-fixed w-full my-2">
                        <thead>
                            <tr class="theader grid-cols-5">
                                <th class="">Product</th>
                                <th class="">Price</th>
                                <th class="">Weight</th>
                                <th class="">In Stock</th>
                                <th class=""></th>
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
                        const productCount = document.getElementById("product-count");
                        productList.innerHTML = products.map(product => `
                            <tr class="tcontent">
                            <div>
                                <td class=" flex"><img src="${product.pictureURL}" alt="${product.description}" class="size-10 card" /><b class="mx-4">${product.description}</b></td>
                                <td class="">$${product.price.toFixed(2)}</td>
                                <td class="">${product.weight.toFixed(2)} lbs</td>
                                <td class="">${product.quantity}</td>
                                <td class="">
                                    <input type="number" min="1" max="${product.quantity}" value="1" class="input input-bordered w-12" id="quantity-${product.number}" />
                                    <button class="btn-form" id="add-to-cart-${product.number}">Add Cart</button>
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

                                if (product.quantity < ordQuantity) {
                                    showToast(`Not enough stock available.`, "bg-error");
                                    return;
                                }

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
                                updateCartIndicator();
                                showToast(`(${ordQuantity}) ${product.description} added to cart.`, "bg-info");
                            });
                        });

                        // Update the product count
                        productCount.textContent = `Found ${products.length} product(s)`;
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

                    <i id="order-count" class="text-sm"></i> 
                    
                    <table class="table table-fixed w-full my-4">
                        <thead>
                            <tr class="theader grid-cols-5">
                                <th class="">Order ID</th>
                                <th class="">Customer</th>
                                <th class="">Total</th>
                                <th class="">Weight</th>
                                <th class=""></th>
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
                        const orderCount = document.getElementById("order-count");
                        productList.innerHTML = orders.map(orders => `
                            <tr class="tcontent">
                            <div>
                                <td class="">${orders.order_id}</b></td>
                                <td class=""><b>${orders.customer_name}</b></td>
                                <td class="">$${(orders.base_price + orders.shipping_price).toFixed(2)}</td>
                                <td class="">${orders.total_weight.toFixed(2)} lbs</td>
                                <td class="grid grid-cols-2">
                                    <button class="btn-form" id="complete-${orders.order_id}" num="${orders.order_id}">Complete</button>
                                    <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="invoice-${orders.order_id}" num="${orders.order_id}">Print Invoice</button>
                                    <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="packing-list-${orders.order_id}" num="${orders.order_id}">Print Packing List</button>
                                    <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="label-${orders.order_id}" num="${orders.order_id}">Print Shipping Label</button>
                                <div>
                                <td class="">
                                    <button class="btn-form" id="complete-${orders.order_id}" num="${orders.order_id}">Complete</button>

                                    <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="invoice-${orders.order_id}" num="${orders.order_id}">Invoice</button>

                                    <button class="btn text-white bg-secondary hover:bg-accent hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2" id="packing-list-${orders.order_id}" num="${orders.order_id}">Packing List</button>
                                </td>
                            </div>
                            </tr>
                        `).join("");

                        // Button Functionality
                        const completeButtons = document.querySelectorAll("[id^='complete-']");
                        completeButtons.forEach((button) => {
                            button.addEventListener("click", (event) => {
                                console.log("clicked");
                                showToast(`Order Completed.`, "bg-success");
                                orderComplete(event.target.getAttribute("num"));
                                setTimeout(() => { refreshOrder(); }, 250); // Slight delay to give time for db to update
                            });
                        });

                        // Shipping Label Button
                        const shippingLabelButtons = document.querySelectorAll("[id^='label-']");
                        shippingLabelButtons.forEach(button => {
                            button.addEventListener("click", (event) => {
                                const id = event.target.getAttribute("num");

                                getAllOrders(id).then(order => {
                                    console.log(order);
                                    let label = `
                                        <p>Ship To: ${order.mailing_address}</p>
                                        <p>Weight: ${order.total_weight} lbs</p>
                                    `;

                                    const iframe = document.createElement('iframe');
                                    iframe.classList.add("hidden");

                                    iframe.onload = () => {
                                        const doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
                                        doc.getElementsByTagName('body')[0].innerHTML = label;

                                        iframe.contentWindow.focus(); 
                                        iframe.contentWindow.print();
                                    }

                                    document.getElementsByTagName('body')[0].appendChild(iframe);
                                    iframe.remove();
                                })
                            })
                        })

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
                                        invoice += `
                                            <tr>
                                                <td align='right' width='300px'>${part.description}</td>
                                                <td align='right' width='50px'>${part.amount_ordered}</td>
                                                <td align='right' width='100px'>$${part.price.toFixed(2)}</td>
                                                <td align='right' width='100px'>${strPartTotal}</td>
                                            </tr>`;
                                    });

                                    invoice += `
                                        <tr>
                                            <td><br></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td align='right' width='100px'>Subtotal:</td>
                                            <td align='right'>$${order.base_price.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td align='right' width='100px'>Shipping:</td>
                                            <td width='100px' align='right'>$${order.shipping_price.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td align='right' width='100px'>Total:</td>
                                            <td width='100px' align='right'>$${(order.base_price + order.shipping_price).toFixed(2)}</td>
                                        </tr>
                                    </table>`;

                                    const iframe = document.createElement('iframe');
                                    iframe.classList.add("hidden");

                                    iframe.onload = () => {
                                        const doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
                                        doc.getElementsByTagName('body')[0].innerHTML = invoice;

                                        iframe.contentWindow.focus(); 
                                        iframe.contentWindow.print();
                                    }

                                    document.getElementsByTagName('body')[0].appendChild(iframe);
                                    iframe.remove();
                                })
                            })
                        })

                        // Packing List Button
                        const packingListButtons = document.querySelectorAll("[id^='packing-list-']");
                        packingListButtons.forEach(button => {
                            button.addEventListener("click", (event) => {
                                const id = event.target.getAttribute("num");

                                getAllOrders(id).then(order => {
                                    let packingList = `
                                        <h1 align='center'>Packing List</h1>
                                        <p align='center'>Ege Auto Parts</p>
                                        <p align='center'>For Order ID ${id}</p>
                                        <table>
                                            <tr>
                                                <th align='right'>Product</th>
                                                <th align='right'>Qty</th>
                                                <th align='right'>Weight Per Item</th>
                                                <th align='right'>Overall Weight</th>
                                            </tr>
                                    `;

                                    order.items.forEach(part => {
                                        packingList += `
                                            <tr>
                                                <td align='right' width='300px'>${part.description}</td>
                                                <td align='right' width='50px'>${part.amount_ordered}</td>
                                                <td align='right' width='100px'>${part.weight} lbs</td>
                                                <td align='right' width='100px'>${(part.weight * part.amount_ordered).toFixed(2)} lbs</td>
                                            </tr>`;
                                    });

                                    packingList += `
                                        <tr>
                                            <td><br></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td align='right' width='100px'>Total Weight:</td>
                                            <td width='100px' align='right'>${order.total_weight} lbs</td>
                                        </tr>
                                    </table>`;

                                    const iframe = document.createElement('iframe');
                                    iframe.classList.add("hidden");

                                    iframe.onload = () => {
                                        const doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
                                        doc.getElementsByTagName('body')[0].innerHTML = packingList;

                                        iframe.contentWindow.focus(); 
                                        iframe.contentWindow.print();
                                    }

                                    document.getElementsByTagName('body')[0].appendChild(iframe);
                                    iframe.remove();
                                })
                            })
                        })
                        // Update the product count
                        orderCount.textContent = `Found ${orders.length} order(s)`;
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

                    <i id="product-count" class="text-sm my-2"></i>

                    <table class="table table-fixed w-full">
                        <thead>
                            <tr class="theader grid-cols-6">
                                <th class="">Product</th>
                                <th class="">ID</th>
                                <th class="">Price</th>
                                <th class="">Weight</th>
                                <th class="">In Stock</th>
                                <th class=""></th>
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
                        const prodCount = document.getElementById("product-count");
                        productList.innerHTML = products.map(product => `
                            <tr class="tcontent">
                            <div>
                                <td class=" flex"><img src="${product.pictureURL}" alt="${product.description}" class="size-10 rounded-lg" /><b class="mx-4">${product.description}</b></td>
                                <td class="">#${product.number}</td>
                                <td class="">$${product.price.toFixed(2)}</td>
                                <td class="">${product.weight.toFixed(2)} lbs</td>
                                <td class="">${product.quantity}</td>
                                <td class="">
                                    <input type="number" min="1" max="9999" value="1" class="input input-bordered w-16" id="quantity-${product.number}" />
                                    <button class="btn-form" id="add-to-cart-${product.number}" q="${product.quantity}" desc="${product.description}" num="${product.number}">Add Stock</button>
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
                                const desc = event.target.getAttribute("desc");    
                                const input = document.getElementById(`quantity-${order}`).value;
                                const q = event.target.getAttribute("q"); 
                                const num = Number(input) + Number(q);
                                showToast(`(${input}) ${desc} added to stock.`, "bg-success");
                                addParts(order,num);
                                setTimeout(() => { refreshProducts(); }, 250); // Slight delay to give time for db to update
                            });
                        });

                        // Update the product count
                        prodCount.textContent = `Found ${products.length} product(s)`;
                        
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

                    <div class="divider divider-primary"><h1 class="text-xl font-bold">Weight Brackets</h1></div>
                    <div class="w-full flex justify-center">
                    <table class="table table-fixed my-2 w-132">
                        <thead>
                            <tr class="theader grid-cols-3">
                                <th class="">Weight Range</th>
                                <th class="">Cost</th>
                                <th class=""></th>
                            </tr>
                        </thead>
                        <tbody id="weight-list">
                        </tbody>
                    </table>
                    </div>

                    <div class="w-full flex justify-center">
                    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border my-2 p-6">
                    <legend class="fieldset-legend">Add Weight Bracket</legend>
                    <div class="card grid grid-cols-3 gap-2 w-120">

                        <label for="weight" class="input">                           
                        <span class="label">Min lbs</span>
                        <input type="number" id="weight" name ="weight" class="" min="0"/></label>

                        <label for="cost" class="input">                           
                        <span class="label">Cost</span>
                        <input type="number" id="cost" name ="cost" class="" min="0"/></label>

                        <button class="btn-form" id="create-button">Create</button>
                    </div>
                    </fieldset>
                    </div>

                    <div class="divider divider-primary"><h1 class="text-xl font-bold">All Orders</h1></div>
                    
                    <div class="w-full flex justify-center">

                    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend class="fieldset-legend">Filters</legend>
                    <div class="card grid grid-cols-2 gap-2 w-120">
                    
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

                        <label class="select selected">
                        <span class="label">Status</span>
                        <select class="select" id="status-select">
                        <option selected></option>
                        <option>Authorized</option>
                        <option>Complete</option>
                        </select>
                        </label>

                        <button class="btn-form" id="filter-button">Filter</button>
                    </div>
                    </fieldset>
                    </div>

                    <i id="order-count" class="text-sm my-2"></i> 

                    <table class="table table-fixed w-full">
                        <thead>
                            <tr class="theader grid-cols-5" id="status">
                                <th class="">Order ID</th>
                                <th class="">Status</th>
                                <th class="">Total</th>
                                <th class="">Date Ordered</th>
                                <th class=""></th>
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
                                <tr class="tcontent">
                                <div>
                                    <td class="">${weight.minimum_weight} lbs to ${nextMinWeight} lbs</b></td>
                                    <td class=""><b>$${weight.shipping_price.toFixed(2)}</b></td>
                                    <td class="">
                                        <button class="btn-form" id="delete-${weight.weight_bracket_id}" num="${weight.weight_bracket_id}">Delete</button>
                                    </td>
                                </div>
                                </tr>
                            `;
                        }).join("");

                        // Add delete events.
                        const deleteButtons = document.querySelectorAll("[id^='delete-']");
                        deleteButtons.forEach((button) => {
                            button.addEventListener("click", (event) => {
                                console.log("clicked");
                                const order = event.target.getAttribute("num");           
                                deleteWeight(order);
                                showToast(`Removed weight bracket.`, "bg-success");
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
                    showToast(`Added weight bracket.`, "bg-success");
                    addWeight(weight,cost);
                    setTimeout(() => { refreshWeights(); }, 250); // Slight delay to give time for db to update
                });

                // Sorting functionality
                const minDate = document.querySelector("#min-date");
                const maxDate = document.querySelector("#max-date");
                const minPrize = document.querySelector("#min-prize");
                const maxPrize = document.querySelector("#max-prize");
                const status = document.getElementById("status-select");
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
                        const orderCount = document.getElementById("order-count");
                        productList.innerHTML = orders.map(orders => `
                            <tr class="tcontent">
                            <div>
                                <td class="">${orders.order_id}</b></td>
                                <td class=""><b>${orders.is_complete === 1 ? "Completed" : "Authorized"}</b></td>
                                <td class="">$${(orders.base_price + orders.shipping_price).toFixed(2)}</td>
                                <td class="">${orders.date_placed}</td>
                                <td class="">
                                    <button class="btn-form" id="view-${orders.order_id}" num="${orders.order_id}">View</button>
                                </td>
                            </div>
                            </tr>
                        `).join("");

                    // View Full Order
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
                                        <table class="table table-fixed w-full">
                                        <thead>
                                            <tr class="theader grid-cols-4">
                                                <th class="">Part ID</th>
                                                <th class="">Description</th>
                                                <th class="">Quantity</th>
                                                <th class="">Weight</th>
                                            </tr>
                                        </thead>
                                        </table>
                                        ${orders.items.map(item => `
                                            <div class="bg-base-200 hover:outline-2 hover:outline-accent card grid grid-cols-4 p-2 my-3 hover:shadow-md hover:shadow-accent/50">
                                            <p class="mx-3">${item.part_id}</p>
                                            <p class="mx-3">${item.description}</p>
                                            <p class="mx-6">${item.amount_ordered}</p>
                                            <p class="mx-6">${item.weight} Ibs</p>
                                            </div>
                                        `).join("")}
                                       
                                        <button class="btn-form" id="back-button">Back</button>
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
                            // Update the product count
                            orderCount.textContent = `Found ${orders.length} order(s)`;
                        });
                    });
                }

            break;
            case "cart":
                display.innerHTML = `
                    <h1 class="text-xl font-bold my-4">🛒Cart</h1>

                    <div class="w-full flex justify-center">
                    <table class="table table-fixed w-132 my-2" id="cart-labels">
                        <thead>
                            <tr class="theader grid-cols-5">
                                <th class="">Product</th>
                                <th class="">Price</th>
                                <th class="">Weight</th>
                                <th class="">Quantity</th>
                                <th class=""></th>
                            </tr>
                        </thead>
                        <tbody id="product-list"></tbody>
                    </table>
                    </div>
                    <div class="divider divider-primary"><h1 class="text-xl font-bold">Checkout</h1></div>

                    <i id="product-count" class="text-sm"></i>

                <div class="w-full flex justify-center">
                    <form id="checkout" class="">
                        <div class="card grid grid-cols-1 gap-2">
                        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend class="fieldset-legend">Customer Information</legend>
                            <label for="name" class="input">
                            <span class="label">Name</span>
                            <input type="text" id="name" name="name" class="" required oninvalid="this.setCustomValidity('Please enter your name')" oninput="this.setCustomValidity('')"/></label> 

                            <label for="credit-card" class="input">                           
                            <span class="label">Credit Card #</span>
                            <input type="text" id="credit-card" name ="credit-card" class="" required/></label>

                            <label for="expiration-date" class="input">
                            <span class="label">Expiration Date</span>
                            <input type="text" id="expiration-date" name="expiration-date" class="" required/></label>
                            
                            <label for="email" class="input">
                            <span class="label">E-mail</span>
                            <input type="text" type="email" id="email" name="email" class="validator" required/></label> 
                            
                            <label for="address" class="input">
                             <span class="label">Address</span>
                            <input type="text" id="address" name="address" class="" required/></label> 
                            
                            <button type="submit" class="btn-form w-1/3">Submit</button>
                        </fieldset>
                        </div>
                    </form>
                <div>
                `;

                // Display the full cart.
                function refreshCart() {
                    getParts().then((products) => {
                        const productList = document.getElementById("product-list");
                        const prodCount = document.getElementById("product-count");
                        productList.innerHTML = JSON.parse(localStorage.getItem("cart") ?? "[]").map(cartItem => {
                            const part = products.find(product => product.number === cartItem.id);
                            if (!part) return `<tr class="tcontent"><div><td class="">Error: Cart item not in parts query</td></div></tr>`;
                            return `<tr class="tcontent">
                                        <div>
                                            <td class=""><b>${part.description}</b></td>
                                            <td class="">$${part.price.toFixed(2)}</td>
                                            <td class="">${part.weight.toFixed(2)} lbs</td>
                                            <td class="">${cartItem.quantity}</td>
                                            <td class="">
                                                <button class="btn-form -mx-4" id="remove-from-cart-${cartItem.id}" desc="${cartItem.name}">Remove</button>
                                            </td>
                                        </div>
                                    </tr>
                        `}).join("");
                        if (productList.innerHTML === ""){
                            const cartLabel = document.getElementById("cart-labels");
                            cartLabel.innerHTML = `
                            <i>Your cart is empty.</i><br>
                            <button id="go-button" class="btn-form">Shop Here</button>
                            `;

                            // Button to product page.
                            const goButton = document.getElementById("go-button");
                            goButton.addEventListener("click", () => {
                                updateDisplay("products");
                            });
                        }

                        // Remove from cart event.
                        document.querySelectorAll("[id^='remove-from-cart-']").forEach(btn => btn.addEventListener("click", 
                            (e) => {
                                const id = e.target.id.split("remove-from-cart-")[1];
                                const desc = e.target.getAttribute("desc"); 
                                const prevCart = JSON.parse(localStorage.getItem("cart") ?? "[]");
                                const newCart = prevCart.filter(cartItem => cartItem.id !== Number(id));
                                showToast(`${desc} removed to cart.`, "bg-info");
                                localStorage.setItem("cart", JSON.stringify(newCart));
                                
                                refreshCart();
                            }
                        ));
                    })

                    updateCartIndicator();
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
                    if (!Array.isArray(cart) || cart.length < 1)
                    {
                        showToast(`Your cart is empty. Please add items to your cart before checking out.`, "bg-error");
                        return;
                    } 

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
                    if (result.status === 200) {
                        showToast(`Order has been placed. Thank you for shopping!`, "bg-success");
                    }
                    else {
                        showToast(`Error placing order: ${result.statusText}. Please ensure all information is correct.`, "bg-error");
                        return;
                    }

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