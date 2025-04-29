# NIU CSCI467-3A

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-4F46E5?style=for-the-badge&logo=daisyui&logoColor=white)

---

## Table of Contents
- [Contributors](#contributors)
- [Project Overview: Ege Auto Parts](#project-overview-ege-auto-parts)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Assignment Description](#assignment-description)
- [Database Connection Documentation](#database-connection-documentation)

---

## Contributors
- **Ryan Groch** – Back-end Development  
- **Brett Williams** – Front-end Development  
- **Garrett Berg** – Miscellaneous

---

## Project Overview: Ege Auto Parts

**Ege Auto Parts** is a dynamic web application developed to manage the inventory and sales of a fictional auto parts company.  
The application uses **Node.js** and **Express** for server-side operations and database connectivity, while **TailwindCSS** and **DaisyUI** provide a modern and responsive front-end design.

## Tech Stack
- **Front-end:** TailwindCSS, DaisyUI, HTML, JavaScript
- **Back-end:** Node.js, Express.js
- **Database:** MySQL

## Screenshots

**Home Screen**  
![Home Screen](https://i.imgur.com/Uyg69tX.png)

**Product Screen**  
Add available items to your cart.  
![Product Screen](https://i.imgur.com/WqOmRRO.png)

**Orders Display**  
Assign orders as complete and print invoices or packing lists.  
![Orders Display](https://i.imgur.com/YvzkNju.png)

**Receiving Display**  
Add additional parts into stock. (This view showcases the optional Night Mode.)  
![Receiving Display](https://i.imgur.com/I0AeP6t.png)

**Admin Display**  
Adjust shipping bracket prices and filter/view all orders.  
![Admin Display](https://i.imgur.com/h39dC2G.png)

**Order Viewing**  
Example of viewing an order from Admin Display.  
![Order Viewing](https://i.imgur.com/iXwVTLa.png)

**Cart Screen**  
View, remove, and checkout items. Customers receive an email confirmation upon successful order completion.  
![Cart Screen](https://i.imgur.com/vCPPsbD.png)

---

## Assignment Description

> **Product System - Problem Statement**  
> *(Original Assignment Description.)*
> 
> As a group of software engineers with a company that sells auto parts via a catalog and mail order, you are tasked to build a new system that enables Internet customers to place and pay for orders online. The system will handle credit card payment, assist in packing and shipping of the order, and keep inventory.
> 
> Internet customers will be presented with a custom ordering program that allows them to select products from a catalog. Each product is displayed with its name, description, picture, price and available quantity. The customer can order products with differing quantities. The system computes the total price, adds shipping and handling charge. Customers then provide their name, email, mailing address and credit card information to finalize the order. Once the credit card is authorized the order is complete and ready for packing and shipping. An email is sent to the customer confirming the order.
> 
> The company already maintains a legacy product database which contains the part number, description, weight, picture link and price for all products it offers. The new system has to interface with this database (details provided later). A suitable database system has to be selected for additionally needed information: such as quantity on hand for each product, and customer orders.
> 
> Credit card authorization is done via an interface to a credit card processing system which requires the credit card number, expiration date and purchase amount. The processing system confirms with an authorization number (details provided later).
> 
> A second interface to the new system will run on workstations in the warehouse: there workers can print packing lists for completed orders, retrieve the items from the warehouse, package them up, add an invoice and shipping label (both printed with the new system). Successful packing and shipping completes the order and is recorded in the order status. An email is sent to the customer confirming that the order has shipped.
> 
> A third interface also runs in the warehouse, at the receiving desk. Whenever products are delivered they are added to the inventory: they can be recognized by their description or part number. Their quantity on hand is updated. Note that the legacy product database does not contain inventory information.
> 
> And lastly, there will be an administrative interface that allows to set the shipping and handling charges, as well as view all orders. Shipping and handling charges are based on the weight of a complete order. This interface allows to set the weight brackets and their charges. Orders can be searched based on date range, status (authorized, shipped) or prize range. The complete order detail is displayed for a selected order.

---

## Database Connection Documentation

*(Written by Ryan)*

You'll need to make two changes before you can properly connect to the database:

1. Change the string (wrapped in double quotes) in `.env.example` to match the URL of desired database.
2. Rename `.env.example` to `.env`.

The database schema (i.e., the `CREATE TABLE` statements) should all be put in `schema.js`, which is meant to run as a standalone script to initialize the database. To run `schema.js`, you can enter either `node schema.js` or `npm run schema` into a terminal (whether that's using CMD/PowerShell on Windows, or Bash/ZSH/whatever on MacOS/Linux).

To connect to the database, you'll need code similar to the following:

```js
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the database!");
});
```

The simplest way to make a query is like this:

```js
con.query("SELECT * FROM Example;");
```

To close the connection to the database:

```js
con.end();
```
