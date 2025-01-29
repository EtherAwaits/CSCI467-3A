# CSCI467-3A
##Group Project Assignment for Group 3A
**Assignment Description is as follows**

Product System - Problem Statement
As a group of software engineers with a company that sells auto parts via a catalog and mail order, you are tasked to build a new system that enables Internet customers to place and pay for orders online. The system will handle credit card payment, assist in packing and shipping of the order, and keep inventory.

Internet customers will be presented with a custom ordering program that allows them to select products from a catalog. Each product is displayed with its name, description, picture, price and available quantity. The customer can order products with differing quantities. The system computes the total price, adds shipping and handling charge. Customers then provide their name, email, mailing address and credit card information to finalize the order. Once the credit card is authorized the order is complete and ready for packing and shipping. An email is sent to the customer confirming the order.

The company already maintains a legacy product database which contains the part number, description, weight, picture link and price for all products it offers. The new system has to interface with this database (details provided later). A suitable database system has to be selected for additionally needed information: such as quantity on hand for each product, and customer orders.

Credit card authorization is done via an interface to a credit card processing system which requires the credit card number, expiration date and purchase amount. The processing system confirms with an authorization number (details provided later).

A second interface to the new system will run on workstations in the warehouse: there workers can print packing lists for completed orders, retrieve the items from the warehouse, package them up, add an invoice and shipping label (both printed with the new system). Successful packing and shipping completes the order and is recorded in the order status. An email is sent to the customer confirming that the order has shipped.

A third interface also runs in the warehouse, at the receiving desk. Whenever products are delivered they are added to the inventory: they can be recognized by their description or part number. Their quantity on hand is updated. Note that the legacy product database does not contain inventory information.

And lastly, there will be an administrative interface that allows to set the shipping and handling charges, as well as view all orders. Shipping and handling charges are based on the weight of a complete order. This interface allows to set the weight brackets and their charges. Orders can be searched based on date range, status (authorized, shipped) or prize range. The complete order detail is displayed for a selected order.
