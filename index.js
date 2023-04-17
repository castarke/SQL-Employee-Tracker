const db = require("./db/dbIndex");
const inquirer = require('inquirer');
const connection = require("./db/connection");
require("console.table");


startEmployeeManager();

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
        "Update Employee Role",
        "Delete Employee",
        "Delete Role",
        "Delete Department",
        "Exit"
      ]
    }) .then(function(answer) {
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

        case "Update Employee Role":
          updateEmployeeRole();
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
    
function viewAllEmployees() {
  connection.promise().query("SELECT * FROM employee")
.then(([rows]) => {
  console.table(rows);
  startEmployeeManager();
});}

function viewAllRoles() {
  connection.promise().query("SELECT * FROM role")
.then(([rows]) => {
  console.table(rows);
  startEmployeeManager();
});}

function viewAllDepartments() {
  connection.promise().query("SELECT * FROM department")
.then(([rows]) => {
  console.table(rows);
  startEmployeeManager();
});}

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
          connection.promise().query(
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
              [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
          )
              .then(() => {
                  console.log(`${answers.first_name} has been added successfully!`);
                  startEmployeeManager();
              })
              .catch(err => {
                  console.log("Error adding new employee:", err);
                  startEmployeeManager();
              });
      });
}

function addNewRole() {
  connection.promise().query('SELECT * FROM department')
    .then(([rows]) => {
      const departmentChoices = rows.map(({ id, department_name }) => 
      ({ name: department_name, value: id }));

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Enter new job title',
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter new job salary',
          },
          {
            type: 'list',
            name: 'department_id',
            message: 'Select department',
            choices: departmentChoices
          },
        ])
        .then(answers => {
          connection.promise().query(
            "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
            [answers.title, answers.salary, answers.department_id]
          )
          .then(() => {
            console.log(`${answers.title} has been added successfully!`);
            startEmployeeManager();
          })
          .catch(err => {
            console.log("Error adding new role", err);
            startEmployeeManager();
          });
        });
    })
}

function addNewDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department_name',
        message: 'Enter a new department'
      },
    ])
    .then(answers => {
      connection.promise().query(
        "INSERT INTO department (name) VALUES (?)",
        [answers.department_name]
      )
      .then(() => {
        console.log(`${answers.department_name} has been added successfully!`);
        startEmployeeManager();
      })
      .catch(err => {
        console.log("Error adding new department", err);
        startEmployeeManager();
      });
    });
}

function updateEmployeeRole() {
  connection.promise().query(
    "SELECT * FROM employee"
  ).then(([rows])=>{
    const employeeChoices = rows.map(({id,first_name,last_name})=>({name:`${first_name} ${last_name}`, value:id}));
    return inquirer
    .prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Select the employee you want to update:',
        choices: employeeChoices,
      },
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the new first name:',
        default: null,
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the new last name:',
        default: null,
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter the new role ID:',
        default: null,
      },
      {
        type: 'input',
        name: 'manager_id',
        message: 'Enter the new manager ID:',
        default: null,
      }
    ]).then(answers=> {
      const {id, first_name, last_name, role_id, manager_id} = answers;
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
      connection.promise().query("UPDATE employee SET WHERE id = ?, first_name =?, last_name =?, role_id = ?, manager_id = ?", [updatedInfo, id])
      .then(()=>{
        console.log(`Employee with ${id} has been updated!`);
        startEmployeeManager();
        
      })
      .catch(err =>{
        console.log(`Error in updating ${first_name}`, err);
        startEmployeeManager();
      })
    })
  })
  }

function deleteEmployee() {
  connection.promise().query("SELECT * FROM employee")
    .then(([rows]) => {
      const employeeChoices = rows.map(({ id, first_name, last_name}) => 
      ({ name: `${first_name} ${last_name}`, value: id }));
       
      return inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Select the employee you want to delete:",
          choices: employeeChoices
        }
      ]);
    })
    .then(({ id}) => {
      connection.promise().query("DELETE FROM employee WHERE id = ?", id)
        .then(() => {
          console.log(`Employee with ID ${id} has been deleted successfully!`);
          startEmployeeManager();
        })
        .catch(err => {
          console.log("Error deleting employee", err);
          startEmployeeManager();
        });
    })
}

function deleteRole() {
  connection.promise().query("SELECT * FROM role")
    .then(([rows]) => {
      const roleChoices = rows.map(({ id, title }) => 
      ({ name: title, value: id }));
      return inquirer
      .prompt([
        {
          type: "list",
          name: "role_id",
          message: "Select the role you want to delete:",
          choices: roleChoices
        }
      ]);
    })
    .then(({ role_id }) => {
      connection.promise().query("DELETE FROM role WHERE id = ?", role_id)
        .then(() => {
          console.log(`Role with ID ${role_id} has been deleted successfully!`);
          startEmployeeManager();
        })
        .catch(err => {
          console.log("Error deleting role", err);
          startEmployeeManager();
        });
    })
}

function deleteDepartment() {
  connection.promise().query("SELECT * FROM department")
    .then(([rows]) => {
      const departmentChoices = rows.map(({ id, name}) => 
      ({ name: name, value: id }));
       
      return inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Select the employee you want to delete:",
          choices: departmentChoices
        }
      ]);
    })
    .then(({ id}) => {
      connection.promise().query("DELETE FROM department WHERE id = ?", id)
        .then(() => {
          console.log(`Department with ID ${id} has been deleted successfully!`);
          startEmployeeManager();
        })
        .catch(err => {
          console.log("Error deleting department", err);
          startEmployeeManager();
        });
    })
}
