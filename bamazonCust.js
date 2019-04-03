require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PW,
  database: "bamazon_db"
});

function inventory() {
  con.query(
    "SELECT item_id as ID, product_name as Item, cust_price as Price, stock_quantity as Quantity FROM products",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      takeOrder();
    }
  );
}

function takeOrder() {
  let itemCount = function() {
    return new Promise((resolve, reject) => {
      con.query("SELECT COUNT(*) as IDcount FROM products", function(err, res) {
        if (err) reject(err);
        let count = res[0].IDcount;
        resolve(count);
      });
    });
  };
  let rowNumCheck = async function(input) {
    let count = await itemCount();
    if (isNaN(input) || input > count || input < 1) {
      console.log("\nPlease enter a valid ID ");
      return false;
    }
    return true;
  };

  inquirer
    .prompt([
      {
        type: "input",
        message:
          " Please select an item to purchase by entering the ID! \n   ID: ",
        name: "selection",
        validate: rowNumCheck
      },
      {
        type: "input",
        message: " How many would you like? \n   Quantity: ",
        name: "quantity"
      }
    ])
    .then(function(response) {
      con.query(
        "SELECT * FROM products WHERE item_id =" + response.selection,
        function(err, res) {
          if (err) throw err;
          else if (res[0].stock_quantity < response.quantity) {
            let maxQ = res[0].stock_quantity;
            console.log(
              `   We don't have enough! \n   The most you can order is ${maxQ} \n   Please select a smaller quanity or purchase a different item`
            );
            takeOrder();
          } else {
            let updatedQ = res[0].stock_quantity - response.quantity;
            let item = response.selection;
            con.query(
              `UPDATE products SET stock_quantity = ${updatedQ} WHERE item_id =${item}`
            );
            console.log(
              "Thank you for your purchase. Your total is $" +
                res[0].cust_price * response.quantity
            );
            inventory();
          }
        }
      );
    });
}

module.exports = inventory;
