-- Project 7 (MySQL 8+) — DDL, DML, DCL, TCL, Joins, Set Operations
-- Notes:
-- - MySQL lacks INTERSECT and MINUS; examples include workarounds using EXISTS/NOT EXISTS.
-- - Transaction control requires InnoDB and autocommit OFF (or use START TRANSACTION).

-- =========================
-- Cleanup (drop if exists)
-- =========================
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Customer;

-- =========
-- DDL: CREATE
-- =========
CREATE TABLE Customer (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  email       VARCHAR(120) UNIQUE
) ENGINE=InnoDB;

CREATE TABLE Employee (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  email       VARCHAR(120) UNIQUE,
  manager_id  INT NULL,
  customer_id INT NULL,
  CONSTRAINT fk_employee_manager FOREIGN KEY (manager_id) REFERENCES Employee(employee_id),
  CONSTRAINT fk_employee_customer FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
) ENGINE=InnoDB;

-- =========
-- DML: INSERT
-- =========
INSERT INTO Customer (first_name, last_name, email) VALUES
('Alice','Anderson','alice@example.com'),
('Bob','Brown','bob@example.com'),
('Cara','Clark','cara@example.com');

INSERT INTO Employee (first_name, last_name, email, manager_id, customer_id) VALUES
('Eve','Evans','eve@example.com', NULL, NULL),
('Mark','Miller','mark@example.com', 1, 1),
('Nina','Nash','nina@example.com', 1, 2);

-- =========
-- DML: SELECT / UPDATE / DELETE
-- =========
SELECT * FROM Customer;
SELECT * FROM Employee;

UPDATE Customer SET email = 'alice@newmail.com' WHERE first_name = 'Alice';
DELETE FROM Customer WHERE first_name = 'Cara';

-- =========
-- TCL: SAVEPOINT / ROLLBACK / COMMIT
-- =========
START TRANSACTION;
  SAVEPOINT before_temp;
  INSERT INTO Customer (first_name, last_name, email) VALUES ('Temp','User','temp@example.com');
  ROLLBACK TO SAVEPOINT before_temp;
COMMIT;

-- =========
-- DDL: ALTER / TRUNCATE
-- =========
ALTER TABLE Employee ADD COLUMN department VARCHAR(50);
ALTER TABLE Employee MODIFY COLUMN department VARCHAR(80);
ALTER TABLE Employee DROP COLUMN department;

CREATE TABLE Logs (id INT AUTO_INCREMENT PRIMARY KEY, message VARCHAR(200)) ENGINE=InnoDB;
INSERT INTO Logs (message) VALUES ('one');
TRUNCATE TABLE Logs;
DROP TABLE Logs;

-- =========
-- DCL: GRANT / REVOKE (permissions required)
-- =========
-- Example:
-- GRANT SELECT, INSERT ON your_db.Customer TO 'some_user'@'%';
-- REVOKE INSERT ON your_db.Customer FROM 'some_user'@'%';

-- =========
-- JOINS
-- =========
-- INNER
SELECT e.employee_id, e.first_name AS emp_first, c.customer_id, c.first_name AS cust_first
FROM Employee e
JOIN Customer c ON e.customer_id = c.customer_id;

-- LEFT
SELECT e.employee_id, e.first_name AS emp_first, c.customer_id, c.first_name AS cust_first
FROM Employee e
LEFT JOIN Customer c ON e.customer_id = c.customer_id;

-- RIGHT
SELECT e.employee_id, e.first_name AS emp_first, c.customer_id, c.first_name AS cust_first
FROM Employee e
RIGHT JOIN Customer c ON e.customer_id = c.customer_id;

-- FULL OUTER JOIN emulation (UNION of LEFT and RIGHT, excluding duplicates)
SELECT e.employee_id, e.first_name AS emp_first, c.customer_id, c.first_name AS cust_first
FROM Employee e
LEFT JOIN Customer c ON e.customer_id = c.customer_id
UNION
SELECT e.employee_id, e.first_name AS emp_first, c.customer_id, c.first_name AS cust_first
FROM Employee e
RIGHT JOIN Customer c ON e.customer_id = c.customer_id;

-- =========
-- SET OPERATIONS
-- =========
-- UNION
SELECT first_name FROM Customer
UNION
SELECT first_name FROM Employee;

-- UNION ALL
SELECT first_name FROM Customer
UNION ALL
SELECT first_name FROM Employee;

-- INTERSECT workaround: names present in both (use EXISTS)
SELECT c.first_name
FROM Customer c
WHERE EXISTS (
  SELECT 1 FROM Employee e WHERE e.first_name = c.first_name
);

-- MINUS workaround: in Customer but not in Employee (NOT EXISTS)
SELECT c.first_name
FROM Customer c
WHERE NOT EXISTS (
  SELECT 1 FROM Employee e WHERE e.first_name = c.first_name
);


