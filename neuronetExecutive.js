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

console.log("");
console.log("**********************************************");
console.log("          NeuroNet Executive Portal           ");
console.log("**********************************************");
console.log("");

var mainMenu = function() {
    inquirer.prompt([{
        name: "options",
        type: "list",
        message: "Menu",
        choices: [
            "View Product Sales by Department",
            "Create New Department",
            "Exit"
        ]
    }]).then(function(answer) {
        switch (answer.options) {
            case "View Product Sales by Department":
                viewSales();
                break;

            case "Create New Department":
                addDepartment();
                break;

            case "Exit":
                console.log("\nGoodbye___\n");
                process.exit();
                break;
        }
    });
};

var viewSales = function() {
    connection.query('SELECT * FROM Departments', function(err, res) {
        if (err) throw err;
        var deptData = []; //array containing database data
        for (var i = 0; i < res.length; i++) { //push data into the productsArr
            var profit = parseInt(res[i].TotalSales) - parseInt(res[i].OverHeadCosts);
            deptData.push([res[i].DepartmentID, res[i].DepartmentName, res[i].OverHeadCosts + "¥", res[i].TotalSales + "¥", profit + "¥"]);
        }
        console.log("");
        console.table(['DepartmentID', 'Department', 'Overhead Costs', 'Total Sales', "Total Profit"], deptData); //populate the table
        mainMenu();
    });

};

var addDepartment = function() {
    inquirer.prompt([{
        name: "dept",
        type: "input",
        message: "Department Name:"
    }, {
        name: "overhead",
        type: "input",
        message: "Overhead Cost:",
        validate: function(value) {
            if (isNaN(value) === true || parseInt(value) < 0) {
                return false;
            } else {
                return true;
            }
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO Departments SET ?", {
            DepartmentName: answer.dept,
            OverHeadCosts: answer.overhead,
        }, function(err, res) {
            console.log("\n...Department successfully added.\n");
            mainMenu();
        });
    });
};
