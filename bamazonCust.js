var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "admin",
  database: "bamazon_db"
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("connected as id " + con.threadId + "\n");
// });

function showProducts() {
  con.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    takeOrder();
  });
}

function takeOrder() {
  inquirer
    .prompt([
      {
        type: "input",
        message:
          "\n Please select an item to purchase by entering the item_id!",
        name: "selection"
      },
      {
        type: "input",
        message: "\n How many would you like?",
        name: "quantity"
      }
    ])
    .then(function(response) {
      console.log("RESPONSE: ", response);
      con.query(
        "SELECT * FROM products WHERE item_id =" + response.selection,
        function(err, res) {
          if (err) throw err;
          else if (res[0].stock_quantity < response.quantity) {
            console.log(
              "We don't have enough! Please select a smaller quanity or purchase a different item"
            );
            takeOrder();
          } else {
            let updatedQ = res[0].stock_quantity - response.quantity;
            let item = response.selection;
            console.log(item, updatedQ);
            con.query(
              `UPDATE products SET stock_quantity = ${updatedQ} WHERE item_id =${item}`
            );
            console.log(
              "Thank you for your purchase. Your total is $" +
                res[0].cust_price * response.quantity
            );
            con.end();
          }
        }
      );
    });
}
showProducts();

//  // grabbing row count to validate user input
//  con.query("SELECT COUNT(item_id) FROM bamazon_db.products", function(
//     err,
//     res
//   ) {
//     if (err) throw err;
//     console.log(res);
//     con.end();
//   });
