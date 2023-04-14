-- DROP TABLE IF EXISTS department;
-- DROP TABLE IF EXISTS role;
-- DROP TABLE IF EXISTS employee;

INSERT INTO department (name)
VALUES ("Accounting"),
       ("HR"),
       ("Sales");

INSERT INTO role (title, salary,department_id)
VALUES ("sales agent", 60000, 3),
       ("Manager", 120000,1);
       
INSERT INTO employee (first_name,last_name,role_id,manager_id)
values ("James", "C", 2, NULL);
