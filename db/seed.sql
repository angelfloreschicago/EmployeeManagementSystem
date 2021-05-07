USE employeeDB;

INSERT INTO department (name)
VALUES ('Design'), ('Engineering');

INSERT INTO role (title, salary, departmentId)
VALUES ('Creative Director', 100000, 1), ('Senior Designer', 90000, 1), ('Principal Designer', 80000, 1), ('Junior Designer', 60000, 2), ('Project Manager', 100000, 2), ('Project Engineer', 90000, 2), ('Engineer', 60000, 2);

INSERT INTO employee (firstName, lastName, roleId)
VALUES ('Angel', 'Flores', 1), ('Jose', 'Guerrero', 5);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES ('Walter', 'White', 4, 1), ('Ray', 'William', 3, 1), ('Tom', 'Woods', 6, 2);