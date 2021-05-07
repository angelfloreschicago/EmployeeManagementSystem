const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
   
    password: "root",
    database: "employeeDB"
});

connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function start() {
    console.log(("\nWelcome to your employee tracker\n"));
	inquirer.prompt({
		name: 'userSelect',
		type: 'list',
		message: 'Select a task:',
		choices: [
			'View All Departments',
			'View All Roles',
			'View All Employees',
			'Add Department',
			'Add Role',
			'Add Employee',
			'Update Employee Role',
			'Exit'
        ]

	}).then(answer => {
	switch (answer.userSelect) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateRole();
                break;
            default:
                connection.end()
                break;
        }
	});
}

function viewDepartments() {
    connection.query("SELECT * FROM department", (err, departments) => {
        if (err) throw err;
        console.table(departments);
        start();
    });
}

function viewRoles() {
    var query = `
        SELECT
            role.id,
            role.title As Title,
            role.salary AS Salary,
            department.name AS Department
        FROM 
            role
        INNER JOIN department ON department.id = role.departmentId`;

    connection.query(query, (err, roles) => {
        if (err) throw err;
        console.table(roles);
        start();
    });
}

function viewEmployees() {
    var query= `
        SELECT 
            e.id,
            CONCAT(e.firstName, ' ', e.lastName) AS Employee,
            role.title AS Position,
            department.name AS Department,
            role.salary AS Salery,
            CONCAT(m.firstName, ' ', m.lastName) AS Manager
        FROM
            employee e
        LEFT JOIN employee m ON m.id = e.managerId
        INNER JOIN role ON e.roleId = role.id
        INNER JOIN department ON role.departmentId = department.id`;
  
    connection.query(query, (err, employees) => {
        if (err) throw err;
        console.table(employees);
        start();
    });
}

function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "department",
        message: "Enter new department: "
    }).then(answer => {
        connection.query("INSERT INTO department (name) VALUES (?)", [answer.department], (err, department) => {
            if (err) throw err;
            console.log(("\n Addition Successful "), "The department " + answer.department + " has been added\n");
            viewDepartments();
        });
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter job title: "
        },
        {
            type: "number",
            name: "salary",
            message: "Enter salary: "
        },
        {
            type: "number",
            name: "id",
            message: "Enter department ID: "
        }
    ]). then(answers => {
        connection.query("INSERT INTO role (title, salary, departmentId) VALUES (?, ?, ?)", [answers.title, answers.salary, answers.id], (err, role) => {
            if (err) throw err;
            console.log(("\n Addition Successful "),"The role " + answers.title + " has been added\n");
            viewRoles();
        });
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter employee first name"
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter employee last name"
        },
        {
            name: "roleId",
            type: "number",
            message: "Enter employee role ID"
        },
        {
            name: "managerId",
            type: "number",
            message: "Enter employee manager's ID"
        }
    ]).then(answers => {
        connection.query("INSERT INTO employee (firstName, lastName, roleId, managerId) VALUES (?, ?, ?, ?)", [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, employee) => {
            if (err) throw err;
            console.log(("\n Addition Successful "), answers.firstName + " was added to employees\n");
            viewEmployees();
        });
    });
}

function updateRole() {
    inquirer.prompt([
        {
            name: "employeeId",
            type: "input",
            message: "Enter employee ID of role to update"
        },
        {
            name: "roleId",
            type: "input",
            message: "Enter updated Role ID"
        }
    ]).then(answers => {
        connection.query("UPDATE employee SET roleID = ? WHERE id = ?", [answers.roleId, answers.employeeId], (err, newRole) => {
            if (err) throw err;
            console.log(("\n Update Successful "), "ID of " + answers.roleId + " now has role of " + answers.employeeId + "\n");
            viewEmployees();
        });
    });
}