// bringing in required  files
const inquirer = require('inquirer');
const connection = require("./db/connection");
require("console.table");



startEmployeeManager();
// function to bring up the  UI  in the terminal
function startEmployeeManager() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee info",
        "Delete Employee",
        "Delete Role",
        "Delete Department",
        "Exit"
      ]
      // brings up specific choice, and depending on selection can bring up a list of employees, roles, and databases. Can also Add/delete employees roles and databases. There is also an option to update an employee's information
    }).then(function (answer) {
      switch (answer.choice) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Add Employee":
          addNewEmployee();
          break;

        case "Add Department":
          addNewDepartment();
          break;

        case "Add Role":
          addNewRole();
          break;

        case "Update Employee info":
          updateEmployeeInfo();
          break;

        case "Delete Employee":
          deleteEmployee();
          break;

        case "Delete Role":
          deleteRole();
          break;

        case "Delete Department":
          deleteDepartment();
          break;

        case "Exit":
          connection.end();
          break;
      }
      console.log(answer);
    });
}
// function to display all employees
function viewAllEmployees() {
  connection.query("SELECT * FROM employee", function(error,results){
    if(error) {
      console.error(error);
    } else {
      console.table(results);
      startEmployeeManager();
    }
  })};
// function to display all roles
function viewAllRoles() {
  connection.query("SELECT * FROM role", function(error,results){
    if(error) {
      console.error(error);
    } else {
      console.table(results);
      startEmployeeManager();
    }
  })};
// function to display all departments
function viewAllDepartments() {
  connection.query("SELECT * FROM department", function(error,results){
    if(error) {
      console.error(error);
    } else {
      console.table(results);
      startEmployeeManager();
    }
  })};
// function to add new employee
  function addNewEmployee() {
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "Please enter the employee's first name:"
        },
        {
          name: "last_name",
          type: "input",
          message: "Please enter the employee's last name:"
        },
        {
          name: "role_id",
          type: "input",
          message: "Please enter the employee's role ID:"
        },
        {
          name: "manager_id",
          type: "input",
          message: "Pleaser enter the employee's manager ID:"
        }
      ])
      .then(answers => {
        connection.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
          [answers.first_name, answers.last_name, answers.role_id, answers.manager_id],
          function (error, results) {
            if (error) {
              console.error(error);
            } else {
              console.log(`${answers.first_name} has successfully been added!`);
              startEmployeeManager();
            }
          }
        );
      });
  }
// function to add new role
  function addNewRole() {
    inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "Please enter the new role's title:"
      },
      {
        name: "salary",
        type: "input",
        message: "Please enter the new role's salary:"
      },
      {
        name: "department_id",
        type: "input",
        message: "Please enter the new role's department ID:"
      }
    ]).then(answers => {
      connection.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [answers.title, answers.salary, answers.department_id],
        function (error, results) {
          if (error) {
            console.error(error);
          } else {
            console.log(`${answers.title} has successfully been added!`);
            startEmployeeManager();
          }
        }
      );
    });
  }
// function to add new department
  function addNewDepartment() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'department_name',
        message: 'Enter a new department'
      },
    ]).then(answers => {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [answers.department_name],
        function (error, results) {
          if (error) {
            console.error(error);
          } else {
            console.log(`${answers.department_name} has been added successfully!`);
            startEmployeeManager();
          }
        }
      );
    });
  }
// function to update  employee info
function updateEmployeeInfo() {
  connection.query("SELECT * FROM employee", function (error, results) {
    if (error) {
      console.error(error);
    } else {
      const employeeChoices = results.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
      inquirer.prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Select the employee you want to update:',
          choices: employeeChoices,
        },
        {
          type: 'input',
          name: 'first_name',
          message: 'Enter the new first name:'
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'Enter the new last name:'
        },
        {
          type: 'input',
          name: 'role_id',
          message: 'Enter the new role ID:'
        },
        {
          type: 'input',
          name: 'manager_id',
          message: 'Enter the new manager ID:',
        }
      ]).then(answers => {
        const { id, first_name, last_name, role_id, manager_id } = answers;
        const updatedInfo = {};
        if (first_name !== null) {
         updatedInfo.first_name = first_name;
        }
        if (last_name !== null) {
          updatedInfo.last_name = last_name;
        }
        if (role_id !== null) {
          updatedInfo.role_id = role_id;
        }
        if (manager_id !== null) {
          updatedInfo.manager_id = manager_id;
        }
        connection.query(
          "UPDATE employee SET ? WHERE id = ?",
          [updatedInfo, id],
          function (error, results) {
            if (error) {
              console.log(`Error in updating employee with ID ${id}:`, error);
            } else {
              console.log(`Employee with ID ${id} has been updated successfully!`);
            }
            startEmployeeManager();
          }
        );
      });
    }
  });
}
// function to delete employee
function deleteEmployee() {
  connection.query("SELECT * FROM employee", function (error, results) {
    if (error) {
      console.error(error);
      startEmployeeManager();
      return;
    }
    const employeeChoices = results.map(({ id, first_name, last_name }) =>
      ({ name: `${first_name} ${last_name}`, value: id }));
    inquirer.prompt([
      {
        type: "list",
        name: "id",
        message: "Please select the employee you want to delete:",
        choices: employeeChoices
      }
    ]).then(function ({ id }) {
      connection.query("DELETE FROM employee WHERE id = ?", id, function (error) {
        if (error) {
          console.error(error);
        } else {
          console.log(`Employee with ID ${id} has been deleted successfully!`);
        }
        startEmployeeManager();
      });
    });
  });
}
// function to delete role
function deleteRole() {
  connection.query("SELECT * FROM role", function (error, results) {
    if (error) {
      console.error(error);
      startEmployeeManager();
    } else {
      const roleChoices = results.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
        {
          type: "list",
          name: "role_id",
          message: "Please select the role you want to delete:",
          choices: roleChoices
        }
      ]).then(({ role_id }) => {
        connection.query("DELETE FROM role WHERE id = ?", role_id, function (error, results) {
          if (error) {
            console.error(error);
            startEmployeeManager();
          } else {
            console.log(`Role with ID ${role_id} has been deleted successfully!`);
            startEmployeeManager();
          }
        });
      });
    }
  });
}
// function to delete department
function deleteDepartment() {
  connection.query("SELECT * FROM department", function (error, results) {
    if (error) {
      console.error(error);
      startEmployeeManager();
    } else {
      const departmentChoices = results.map(({ id, name }) => ({ name: name, value: id }));
      inquirer.prompt([
        {
          type: "list",
          name: "department_id",
          message: "Please select the department you want to delete:",
          choices: departmentChoices
        }
      ]).then(({ department_id }) => {
        connection.query("DELETE FROM department WHERE id = ?", department_id, function (error, results) {
          if (error) {
            console.error(error);
            startEmployeeManager();
          } else {
            console.log(`Department with ID ${department_id} has been deleted successfully!`);
            startEmployeeManager();
          }
        });
      });
    }
  });
}