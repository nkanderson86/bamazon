var inquirer = require("inquirer");
var query = require("./query");

async function cust() {
  let results = await query(
    "SELECT item_id as ID, product_name as Item, cust_price as Price, stock_quantity as Quantity FROM bamazon_db.products"
  );
  console.table(results);

  inquirer
    .prompt([
      {
        type: "input",
        message:
          " Please select an item to purchase by entering the ID! \n   ID: ",
        name: "id",
        validate: input => {
          if (isNaN(input) || input > results.length || input < 1) {
            console.log("\nPlease enter a valid ID ");
            return false;
          }
          return true;
        }
      },
      {
        type: "input",
        message: " How many would you like? \n   Quantity: ",
        name: "quantity"
      }
    ])
    .then(async answer => {
      let purchaseInfo = await query(
        `SELECT * FROM bamazon_db.products WHERE item_id = ${answer.id}`
      );
      let itemName = purchaseInfo[0].product_name;
      let itemPrice = purchaseInfo[0].cust_price;
      let inventoryQ = purchaseInfo[0].stock_quantity;
      let total = answer.quantity * itemPrice;

      if (inventoryQ < answer.quantity) {
        console.log(
          "Oops! We don't have enough. Note the quantity available and try again."
        );
        cust();
      } else {
        await query(
          `UPDATE bamazon_db.products SET stock_quantity = stock_quantity - ${
            answer.quantity
          } WHERE item_id = ${answer.id}`
        );

        console.log(
          `Thank you for your order.  The total for ${
            answer.quantity
          } ${itemName} is ${total}`
        );

        inquirer
          .prompt([
            {
              type: "confirm",
              message: "Would you like to make another purchase?",
              name: "continue"
            }
          ])
          .then(answer => {
            if (answer.continue) {
              cust();
            } else {
              console.log("Thank you for your business!");
            }
          });
      }
    });
}

module.exports = cust;
