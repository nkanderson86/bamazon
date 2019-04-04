let cust = require("./bamazonCust2");
let manager = require("./bamazonMgr");
let inquirer = require("inquirer");

// simple prompt with a switch statement to route user to the proper menu
function bamazon() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "profile",
        message: "Which account do you need to access today?",
        choices: ["Customer", "Manager", "Quit"],
        default: "Customer"
      }
    ])
    .then(async answer => {
      switch (answer.profile) {
        case "Customer":
          await cust();
          break;
        case "Manager":
          await manager();
          break;
        case "Quit":
          break;
      }
    });
}

bamazon();
