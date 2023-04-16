DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employee;

INSERT INTO department (department_name)
VALUES ("Accounting"),
       ("Legal"),
       ("Sales"),
       ("Marketing"),
       ("IT");

INSERT INTO roles (title, salary,department_id)
VALUES ("Sales Agent", 60000, 3),
       ("Sales Manager", 120000,3),
       ("IT Support", 85000,5),
       ("Lawyer", 175000,2),
       ("Sales Lead", 100000, 3),
       ("Accountant", 145000, 1),
       ("Marketing Manager", 135000, 4);
       
INSERT INTO employee (first_name,last_name,role_id,manager_id)
values 
("Candler", "Starke", 3, 5),
("Malcolm", "Schwall",1, 3),
("Caroline", "Boyd", 7,4),
("Jack","Broda",4,2),
("Paige","Chamerlik",5,3),
("Preston", "Kight",6,1),
("Kelton", "Pruett", 2, 3);
