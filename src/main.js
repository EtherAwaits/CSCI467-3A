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

    // Get just the parts that contain "windshi" in their description:
    getParts("windshi");

    // Get every part in the legacy database:
    getParts();

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
                    <h1 class="text-xl font-bold my-2">Products</h1>

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
                            <tr class="bg-primary text-white grid grid-cols-6 gap-2 rounded-2xl ">
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

                // Display products
                getParts().then((products) => {
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

                // Function for the search bar
                const searchInput = document.getElementById("product-search");
                searchInput.addEventListener("input", (event) => {
                    const query = event.target.value.trim();
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
                });

                break;
            case "orders":
                display.innerHTML = `
                    <h1 class="text-xl font-bold">Open Orders</h1>
                    
                    <table class="table-auto w-full my-4">
                        <thead>
                            <tr class="bg-primary text-white grid grid-cols-6 gap-2 rounded-2xl ">
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

                // Display products
                getParts().then((products) => {
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
            break;
            case "receiving":
                display.innerHTML = `
                    <h1 class="text-xl font-bold">Receiving</h1>

                    <label class="input my-2">
                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                    <input type="search" required placeholder="Search"/>
                    </label>

                    <div class="card grid grid-cols-1 p-12 gap-2 bg-base-300 border-neutral border-2 h-9/10 overflow-y-auto my-2">
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
                    <h1 class="text-xl font-bold">Weight Brackets</h1>
                    This is where the weights things go.
                    
                    <i class="text-l">Add Bracket</i>
                    <div class="card grid grid-cols-3 p-4 gap-2 w-1/2">
                        <input type="number" placeholder="Weight" class="input" />
                        <input type="number" placeholder="Cost" class="input" />
                        <button class="btn">Create</button>
                    </div>

                    <h1 class="text-xl font-bold">Past Orders</h1>
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
            case "cart":
                display.innerHTML = `
                    <h1 class="text-xl font-bold">Cart</h1>
                    <div class="card grid grid-cols-1 p-12 gap-2 bg-base-300 border-neutral border-2 h-9/10 overflow-y-auto my-2">
                        <div class="btn grid grid-cols-2 bg-primary hover:border-accent hover:border-single hover:border-2 hover:shadow-lg hover:shadow-accent/50 p-2 tooltip tooltip-secondary">
                            <div class="flex gap-2 justify-start items-center">
                            <h3 class="font-bold truncate text-sm text-left align-center">cart label idk</h3>
                            </div>
                            <div class="flex gap-2 justify-end items-center">
                            <p class="opacity-80 p-1 place-self-center text-xs w-16 sm:w-20 bg-base-300 border-neutral border-2 text-center">button</p>
                            </div>
                        </div>
                    </div>
                `;
            break;
            default:
                display.innerHTML = `
                nothing here!'
            `;
        }
    }

});