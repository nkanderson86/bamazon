-- Creates database
CREATE DATABASE bamazon_db;

-- Selects database 
USE bamazon_db;

-- Creates table with appropriate columns and data types
CREATE TABLE products
(
    item_id INT NOT NULL
    AUTO_INCREMENT,
  product_name VARCHAR
    (45) NULL,
  department VARCHAR
    (45) NULL,
  cust_price DECIMAL
    (10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY
    (item_id)
);

    -- Inserting data to use 
    INSERT INTO products
        (product_name, department, cust_price, stock_quantity)
    VALUES
        ("golf shoes", "sporting goods", 80, 10),
        ("sand wedge", "sporting goods", 90, 10),
        ("driver", "sporting goods", 350, 10),
        ("iron set", "sporting goods", 800, 10),
        ("3 wood", "sporting goods", 250, 10),
        ("hoody", "clothing", 20, 15),
        ("sweats", "clothing", 20, 15),
        ("shirt", "clothing", 10, 50),
        ("socks", "clothing", 5, 100),
        ("pants", "clothing", 20, 25);
