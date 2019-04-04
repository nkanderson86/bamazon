var inquirer = require("inquirer");
var query = require("./query");

// prompt to select which channel to send user to.  switch statement below calls the appropriate function.
function mgr() {
  inquirer
    .prompt([
      {
        name: "mgrPrompt",
        message: "Please select from the following options...",
        type: "list",
        choices: [
          "See All Items",
          "See Low Inventory Items (<5)",
          "Update Inventory",
          "Add New Item",
          "Quit"
        ]
      }
    ])
    .then(answer => {
      switch (answer.mgrPrompt) {
        case "See All Items":
          inventory();
          break;
        case "See Low Inventory Items (<5)":
          lowInventory();
          break;
        case "Update Inventory":
          addInventory();
          break;
        case "Add New Item":
          addNewItem();
          break;
        case "Quit":
          // ??? add function to exit app// NOTE PUTTING NOTHING HERE STILL EXITS THE APP!
          break;
      }
    });
}
// function that selects all inventory for sale from the db
async function inventory() {
  let results = await query(
    "SELECT item_id as ID, product_name as Item, cust_price as Price, stock_quantity as Quantity FROM bamazon_db.products"
  );
  console.table(results);
  mgr();
}

// function that selects all inventory with low quantity (less than 5 units left)
async function lowInventory() {
  let results = await query(
    "SELECT item_id as ID, product_name as Item, cust_price as Price, stock_quantity as Quantity FROM bamazon_db.products WHERE stock_quantity <= 5"
  );
  console.table(results);
  mgr();
}

// function that allows user to adjust inventory.  handles negative numbers if the user needs to reduce the inventory.
async function addInventory() {
  let results = await query("SELECT * FROM bamazon_db.products");
  console.table(results);
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the item ID you'd like to update",
        name: "id",
        validate: input => {
          if (input <= results) {
            return true;
          } else return false;
        }
      },
      {
        type: "input",
        message: "How many units are being added to inventory?",
        name: "units",
        validate: input => {
          if (!isNaN(input)) {
            return true;
          } else return false;
        }
      }
    ])
    .then(async answer => {
      await query(
        `UPDATE bamazon_db.products SET stock_quantity = stock_quantity + ${
          answer.units
        } WHERE item_id = ${answer.id}`
      );
      let newResults = await query(
        `SELECT * FROM bamazon_db.products WHERE item_id = ${answer.id}`
      );
      console.log(`UPDATE: ${answer.units} units added to item ${answer.id}`);
      console.table(newResults);
      mgr();
    });
}

// function that gathers all the required information for a new product in the table and feeds that information to the database in an INSERT INTO statement
async function addNewItem() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the product you'll be adding?",
        default: "New Product"
      },
      {
        type: "input",
        name: "department",
        message: "What department does the new product fall under?",
        default: "Sporting Goods"
      },
      {
        type: "input",
        name: "price",
        message: "What price will the new product sell for?",
        default: "99.99"
      },
      {
        type: "input",
        name: "units",
        message: "How many units are being added to inventory?"
      }
    ])
    .then(async answer => {
      await query(
        `INSERT INTO bamazon_db.products (product_name, department, cust_price, stock_quantity) VALUES ('${
          answer.name
        }', '${answer.department}', ${answer.price}, ${answer.units})`
      );
      let results = await query("SELECT * FROM bamazon_db.products");
      console.log(`${answer.name} added to inventory!`);
      console.table(results);
      mgr();
    });
}

module.exports = mgr;
