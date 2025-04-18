DROP TABLE IF EXISTS weight_brackets;
DROP TABLE IF EXISTS ordered_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS part_quantities;

CREATE TABLE part_quantities (
    part_id INT PRIMARY KEY,
    quantity INT NOT NULL DEFAULT 0
);

CREATE TABLE orders (
    order_id VARCHAR(200) PRIMARY KEY,
    is_complete BOOLEAN NOT NULL DEFAULT 0,
    customer_name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    mailing_address VARCHAR(200) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    shipping_price DECIMAL(10,2) NOT NULL,
    total_weight DECIMAL(10,2) NOT NULL,
    authorization_number VARCHAR(50) NOT NULL,
    date_placed DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_completed DATETIME
);

CREATE TABLE ordered_items (
    order_id VARCHAR(200) NOT NULL,
    part_id INT NOT NULL,
    amount_ordered INT NOT NULL,
    price DECIMAL (10,2) NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (part_id) REFERENCES part_quantities (part_id),
    PRIMARY KEY (order_id, part_id)
);

CREATE TABLE weight_brackets (
    weight_bracket_id INT AUTO_INCREMENT PRIMARY KEY,
    minimum_weight DECIMAL(10,2) UNIQUE NOT NULL,
    shipping_price DECIMAL(10,2) NOT NULL
);
