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
                    This is where the home page goes.
                `;
            break;
            case "products":
                display.innerHTML = `
                    This is where the products go.
                `;
            break;
            case "warehouse":
                display.innerHTML = `
                    This is where the warehouse stuff goes.
                `;
            break;
            case "admin":
                display.innerHTML = `
                    This is where the admin things go.
                `;
            break;
            case "cart":
                display.innerHTML = `
                    This is where the cart goes.
                `;
            break;
            default:
                display.innerHTML = `
                nothing here!'
            `;
        }
    }

});