const database = require("./db/dbIndex");
const inquirer = require('inquirer');
const path = require("path");
const {writeFile} = require("fs/promises");
const connection = require("./db/connection")

startEmployeeManager();

async function startEmployeeManager() {
  try {
    const answer = await inquirer.prompt({
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
        "Exit"
      ]
    });
    
    console.log(answer);
    
    switch (answer.choice) {
      case "View All Employees":
        await viewAllEmployees();
        break;

      case "View All Departments":
        await viewAllDepartments();
        break;

      case "View All Roles":
        await viewAllRoles();
        break;

      case "Add Employee":
        await addEmployee();
        break;

      case "Add Department":
        await addDepartment();
        break;

      case "Add Role":
        await addRole();
        break;

      case "Update Employee Role":
        await updateEmployeeRole();
        break;

      case "Exit":
        connection.end();
        break;
    }
  } catch (err) {
    console.error(err);
  }
}

async function viewAllEmployees() {
  try {
    const [rows] = await connection.promise().query("SELECT * FROM employee");
    console.table(rows);
  } catch (err) {
    console.error(err);
  }
  startEmployeeManager();
}

async function viewAllRoles() {
  try {
    const [rows] = await connection.promise().query("SELECT * FROM role");
    console.table(rows);
    startEmployeeManager();
  } catch (err) {
    console.log(err);
  }
}

async function viewAllDepartments() {
  try {
    const [rows] = await connection.promise().query("SELECT * FROM department");
    console.table(rows);
    startEmployeeManager();
  } catch (err) {
    console.log(err);
  }
}

  async function addEmployeeQuestions() {
    const { first_name, last_name, role_id, salary, manager_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter employee first name:'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter employee last name:'
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter employee role ID:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter employee salary:'
      },
      {
        type: 'input',
        name: 'manager_id',
        message: 'Enter employee manager ID:'
      }
    ]);
  
    return { first_name, last_name, role_id, salary, manager_id };
  }
  async function addEmployee() {
  
  
    const newEmployee = await addEmployeeQuestions();
  
    const [results, fields] = await connection.query(
      `INSERT INTO employee (first_name, last_name, role_id, salary, manager_id)
       VALUES (?, ?, ?, ?, ?)`,
      [newEmployee.first_name, newEmployee.last_name, newEmployee.role_id, newEmployee.salary, newEmployee.manager_id]
    );
  
    console.log(`Added ${newEmployee.first_name} to the database`);
  }
  
  async function addNewRole() {
    try {
      const [departments] = await connection.promise().query('SELECT * FROM department')
      const departmentarry = departments.map(({id, department_name})=>({name:department_name,value:id}))
      console.log(departmentarry);
      
      const {title, salary, department_id} = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter job title',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter job salary',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Select department',
          choices: departmentarry
        },
      ]);
      
      await connection.promise().query('INSERT INTO role SET ?', {title, salary, department_id});
      
      console.log(`Added ${title} role to the database`);
      
    } catch (err) {
      console.log(err);
    }
    
    startEmployeeManager();
  }