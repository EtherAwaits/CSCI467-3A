document.addEventListener("DOMContentLoaded", () => {
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
                `;
            break;
            default:
                display.innerHTML = `
                nothing here!'
            `;
        }
    }

});