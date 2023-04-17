const connection =require("./connection")

class Database {
    constructor (connection) {
        this.connection = connection;
    };

findEachDepartment(){
    return this.connection.promise().query(
        "SELECT department.id, department.name FROM department"
    );
}

createDepartment(department){
    return this.connection.promise().query(
        "INSERT INTO department SET ?", department
    );
}

removeDepartment(departmentID) {
    return this.connection.promise().query(
        "DELETE FROM department WHERE id = ?", departmentID
    );
}

findEachRole() {
    return this.connection.promise().query(
        "SELECT role.id, role.title, role.salary, role.department_id FROM role"
    );
}

createRoles(role){
    return this.connection.promise().query(
        "INSERT INTO role SET ?", role
    );
}

removeRole(roleID) {
    return this.connection.promise().query(
        "DELETE FROM role WHERE id = ?", roleID
    );
}

findEachEmployee() {
    return this.connection.promise().query(
        "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee"
    );
}

// findEachEmployee() {
//     const dbResponse = this.connection.promise().query(
//         "select employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id  from employee;"
//     ).then( res => {
//         return res
//     })
//     return dbResponse;

//     return this.connection.query(
//         "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id"
//     );
// }



createEmployees(employee) {
    return this.connection.promise().query(
        "INSERT INTO employee SET ?", employee
    );
}

removeEmployees(employeeID){
    return this.connection.promise().queryp(
        "DELETE FROM employee WHERE id = ?",
        employeeID
    );
}

}

module.exports = new Database(connection);