-- Project 7 (PostgreSQL) — DDL, DML, DCL, TCL, Joins, Set Operations
-- Uses EXCEPT instead of MINUS.

-- =========================
-- Cleanup (drop if exists)
-- =========================
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Customer;

-- =========
-- DDL: CREATE
-- =========
CREATE TABLE Customer (
  customer_id SERIAL PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  email       VARCHAR(120) UNIQUE
);

CREATE TABLE Employee (
  employee_id SERIAL PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  email       VARCHAR(120) UNIQUE,
  manager_id  INT NULL REFERENCES Employee(employee_id),
  customer_id INT NULL REFERENCES Customer(customer_id)
);

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

COMMIT;

-- =========
-- DML: SELECT / UPDATE / DELETE
-- =========
SELECT * FROM Customer;
SELECT * FROM Employee;

UPDATE Customer SET email = 'alice@newmail.com' WHERE first_name = 'Alice';
DELETE FROM Customer WHERE first_name = 'Cara';

COMMIT;

-- =========
-- TCL: SAVEPOINT / ROLLBACK / COMMIT
-- =========
BEGIN;
  SAVEPOINT before_temp;
  INSERT INTO Customer (first_name, last_name, email) VALUES ('Temp','User','temp@example.com');
  ROLLBACK TO SAVEPOINT before_temp;
COMMIT;

-- =========
-- DDL: ALTER / TRUNCATE
-- =========
ALTER TABLE Employee ADD COLUMN department VARCHAR(50);
ALTER TABLE Employee ALTER COLUMN department TYPE VARCHAR(80);
ALTER TABLE Employee DROP COLUMN department;

CREATE TABLE Logs (id SERIAL PRIMARY KEY, message VARCHAR(200));
INSERT INTO Logs (message) VALUES ('one');
TRUNCATE TABLE Logs;
DROP TABLE Logs;

-- =========
-- DCL: GRANT / REVOKE
-- =========
-- Example (requires privileges):
-- GRANT SELECT, INSERT ON Customer TO some_user;
-- REVOKE INSERT ON Customer FROM some_user;

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

-- FULL OUTER
SELECT e.employee_id, e.first_name AS emp_first, c.customer_id, c.first_name AS cust_first
FROM Employee e
FULL OUTER JOIN Customer c ON e.customer_id = c.customer_id;

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

-- INTERSECT
SELECT first_name FROM Customer
INTERSECT
SELECT first_name FROM Employee;

-- EXCEPT (PostgreSQL) — in Customer but not in Employee
SELECT first_name FROM Customer
EXCEPT
SELECT first_name FROM Employee;


