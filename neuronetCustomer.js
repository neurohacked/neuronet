var table = require('console.table'); //populates table of products
var inquirer = require('inquirer'); //user prompts
var mysql = require('mysql'); //initiliaze mysql database

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "neuronetDB"
});
connection.connect(function(err) {
    if (err) throw err;
    displayDB();
});

console.log("");
console.log("********************************************************************");
console.log("                      Welcome to NeuroNet");
console.log("                            ------");
console.log("                   An online marketplace for");
console.log("         neuro enhancements and neuro-controlled gear.");
console.log("********************************************************************");
console.log("");

var productCount = 0;

var displayDB = function() {
    connection.query('SELECT * FROM Products', function(err, res) {
        if (err) throw err;
        var productData = []; //array containing the database data
        productCount = res.length;
        for (var i = 0; i < res.length; i++) { //push data into the productData
            productData.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].CategoryName, res[i].Price + "¥", res[i].StockQuantity]);
        }
        console.table(['ID', 'Product', 'Department', 'Category', 'Price', "Quantity"], productData); //populate the table
        orderPrompt();
    });
};

var orderPrompt = function() {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Enter the ID of the product you would like to purchase:",
        validate: function(value) { // checks ID to verify it exists
            if (parseInt(value) > productCount || parseInt(value) < 1 || isNaN(value) === true) {
                return false;
            } else {
                return true;
            }
        }
    }, {
        name: "quantity",
        type: "input",
        message: "How many units of the product do you would like to purchase?",
        validate: function(value) {
            if (isNaN(value) === true || parseInt(value) <= 0) { //validation
                return false;
            } else {
                return true;
            }
        }
    }]).then(function(answer) {
        connection.query('SELECT * FROM Products WHERE ItemID = ?', [answer.id], function(err, res) {
            if (answer.quantity > res[0].StockQuantity) {
                console.log("\nInsufficient quantity in stock. Select fewer units or a different product.\n");
                orderPrompt(); //return to order
            } else {
                var stockRemaining = res[0].StockQuantity - answer.quantity; //process remaining units
                processOrder(answer.id, stockRemaining);
                calculatePrice(answer.id, answer.quantity);
            }
        });
    });
};

var processOrder = function(id, quantity) { //update stock in database
    connection.query('UPDATE Products SET ? WHERE ?', [{
        StockQuantity: quantity
    }, {
        ItemID: id
    }], function(err, res) {});
};

var calculatePrice = function(id, quantity) { //eval the total cost of purchase
    connection.query('SELECT * FROM Products WHERE ItemID = ?', [id], function(err, res) {
        var orderTotal = quantity * res[0].Price;
        addOrderToDB(orderTotal, res[0].DepartmentName, res[0].CategoryName);
        console.log("**********************************************");
        console.log("                 Order Invoice\n");
        console.log("Product:", res[0].ProductName, "(" + res[0].CategoryName + ")");
        console.log("Units:", quantity);
        console.log("Total Cost:", orderTotal, "¥");
        console.log("**********************************************");
        orderAgain();
    });
};

var addOrderToDB = function(total, department, category) {
    connection.query('UPDATE Departments SET ? WHERE ?', [{
        TotalSales: total
    }, {
        DepartmentName: department
    }, {
        CategoryName: category
    }], function(err, res) {});

};

var orderAgain = function() { //check if another order will be placed
    inquirer.prompt([{
        name: "orderAgain",
        type: "list",
        message: "Would you like to order again?",
        choices: ["Yes", "No"]
    }]).then(function(answer) {
        if (answer.orderAgain === "Yes") {
            displayDB(); //call table function and restart
        } else {
            console.log("\nGoodbye___\n");
            process.exit(); //exit program
        }
    });
};
