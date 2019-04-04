var inquirer = require("inquirer");
var query = require("./query");

// function that is called once the user selects the customer view from the main menu
async function cust() {
  // returns all inventory to view, using await to make sure the results aren't displayed before the query finishes.
  let results = await query(
    "SELECT item_id as ID, product_name as Item, cust_price as Price, stock_quantity as Quantity FROM bamazon_db.products"
  );
  console.table(results);

  // using inquirer here to gather the item and quantity the user would like to purchase.  validate the item ID inside the inquirer prompt to make sure its a number that is currently attached to an item for sale.
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
    //once the user has selected what and how much to buy, this function is called with the input from the user as the arguments.  If the quantity requested is more than is available, an error message appears and the user is moved back to selected the Item/Quantity. Otherwise the database is updated to reflect the purchase and a confirmation message appears.
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

        // checking with user to either restart the workflow or exit the app.
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
