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
    mainMenu();
});

var productCount = 0;

console.log("");
console.log("**********************************************");
console.log("               NeuroNet Manager               ");
console.log("**********************************************");
console.log("");

var mainMenu = function() {
    inquirer.prompt([{
        name: "options",
        type: "list",
        message: "Menu",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    }]).then(function(answer) {
        switch (answer.options) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;

            case "Exit":
                console.log("\nGoodbye___\n");
                process.exit();
                break;
        }
    });
};

var viewProducts = function() { //view table of available products
    connection.query('SELECT * FROM Products', function(err, res) {
        if (err) throw err;
        var productData = []; //array containing the database data
        productCount = res.length;
        for (var i = 0; i < res.length; i++) { //push data into productData array
            productData.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].CategoryName, res[i].Price + "¥", res[i].StockQuantity]);
        }
        console.log("");
        console.table(['ID', 'Product', 'Department', 'Category', 'Price', "Quantity"], productData); //populate the table
        mainMenu();
    });
};

var viewInventory = function() {
    connection.query('SELECT * FROM Products WHERE StockQuantity < 10', function(err, res) {
        if (err) throw err;
        var lowInventory = [];
        for (var i = 0; i < res.length; i++) {
            lowInventory.push([res[i].ProductName, res[i].StockQuantity]);
        }
        console.log("");
        console.table(['Products with < 10 units in stock', 'Units'], lowInventory);
        mainMenu();
    });
};

var addInventory = function() {
    connection.query('SELECT * FROM Products', function(err, res) {
        if (err) throw err;
        var productData = []; //array containing the database data
        productCount = res.length;
        for (var i = 0; i < res.length; i++) { //push data into productData array
            productData.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].CategoryName, res[i].Price + "¥", res[i].StockQuantity]);
        }
        console.log("");
        console.table(['ID', 'Product', 'Department', 'Category', 'Price', "Quantity"], productData); //populate the table
    });
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Add inventory to which product (ID)?",
        validate: function(value) {
            //validation checks ID to verify it exists
            if (parseInt(value) > productCount || isNaN(value) === true) {
                return false;
            } else {
                return true;
            }
        }
    }, {
        name: "quantity",
        type: "input",
        message: "How many units?",
        validate: function(value) {
            //validation checks ID to verify it exists
            if (parseInt(value) <= 0 || isNaN(value) === true) {
                return false;
            } else {
                return true;
            }
        }
    }]).then(function(answer) {
        connection.query('SELECT * FROM Products WHERE ?', [{
            ItemID: answer.id
        }], function(err, res) {
            productName = res[0].ProductName;
            newQuantity = parseInt(res[0].StockQuantity) + parseInt(answer.quantity);
            connection.query('UPDATE Products SET ? WHERE ?', [{
                StockQuantity: newQuantity,
            }, {
                ItemID: answer.id
            }], function(err, res) {
                console.log("\nUnits successfully added to inventory.");
                console.log("Updated quantity of", productName + ":", newQuantity, "\n");
                mainMenu();
            });
        });
    });
};

var addProduct = function() {
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "Product Name:"
    }, {
        name: "department",
        type: "input",
        message: "Department:"
    }, {
        name: "category",
        type: "input",
        message: "Category:"
    }, {
        name: "price",
        type: "input",
        message: "Product Price:",
        validate: function(value) {
            if (isNaN(value) === true || parseInt(value) < 0) {
                return false;
            } else {
                return true;
            }
        }
    }, {
        name: "stock",
        type: "input",
        message: "How many Units:",
        validate: function(value) {
            if (isNaN(value) === true || parseInt(value) < 0) {
                return false;
            } else {
                return true;
            }
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO Products SET ?", {
            ProductName: answer.product,
            DepartmentName: answer.department,
            CategoryName: answer.category,
            Price: answer.price,
            StockQuantity: answer.stock
        }, function(err, res) {
            console.log("\n...Product successfully added.\n");
            mainMenu();
        });
    });
};
