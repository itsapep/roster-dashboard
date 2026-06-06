# Implementation Plan: API Unit Testing

## Objective
Create comprehensive unit tests for all recently created dashboard APIs (Employee, Movement Request, and Roster Anchor) following Next.js testing practices.

## Guidelines for Implementor
- **Target Audience:** This plan is designed for a junior engineer or an AI agent. Follow the steps sequentially.
- **Folder Structure:** Place all test files inside a top-level `tests/` directory.
- **Framework:** Use standard Next.js testing tools (e.g., Jest/Vitest or Node's native test runner if configured).
- **Consistency:** Ensure you **delete the relevant database records** before executing the specific steps of each test scenario to prevent data leakage between tests.
- **Detail Level:** The scenarios below outline *what* to test, not the exact code. You are responsible for writing the setup, execution, and assertion code.

---

## 1. Employee API Tests
**File:** `tests/employee-api.test.ts`

### Scenarios for Employee List API
- **Scenario A: Empty State**
  1. Clear the `employees` table.
  2. Call the API.
  3. Assert that the response is `200 OK` and returns an empty array.
- **Scenario B: Populated State**
  1. Clear the `employees` table.
  2. Insert multiple mock employees into the database.
  3. Call the API.
  4. Assert that the response is `200 OK` and returns the exact number of inserted employees.
  5. Verify the data structure of at least one returned employee matches the expected schema.

### Scenarios for Create Employee API
- **Scenario A: Valid Input (Positive)**
  1. Clear the `employees` table.
  2. Call the Create API with a valid payload (name, department).
  3. Assert that the response is `201 Created`.
  4. Verify the new employee is inserted into the database.
- **Scenario B: Invalid Input (Negative)**
  1. Clear the `employees` table.
  2. Call the Create API with missing required fields (e.g., missing name).
  3. Assert that the response returns an error status (e.g., `500 Internal Server Error`).
  4. Verify that no employee was inserted into the database.

---

## 2. Movement Request API Tests
**File:** `tests/movement-request-api.test.ts`

### Scenarios for Get All Movement Requests
- **Scenario A: Verify nested data**
  1. Clear the `movement_requests` and `status_history` tables.
  2. Insert a mock movement request and multiple associated status histories.
  3. Call the API.
  4. Assert that the response is `200 OK`.
  5. Assert that the `status_history` is properly nested inside the movement request object without the N+1 query issue.

### Scenarios for Get Movement Requests By Employee ID
- **Scenario A: Valid Employee ID**
  1. Clear tables and insert requests for multiple different employees.
  2. Call the API passing a specific employee's ID.
  3. Assert that the response only contains requests belonging to that specific employee.
- **Scenario B: Non-existent Employee ID**
  1. Clear tables and insert requests.
  2. Call the API with an ID that does not exist.
  3. Assert that the response returns an empty array.

### Scenarios for Get Pending Movement Requests
- **Scenario A: Filter by Status**
  1. Clear tables and insert requests with various statuses (e.g., 'Approved', 'Pending', 'Rejected').
  2. Call the pending requests API.
  3. Assert that all returned records have the `Pending` status.

### Scenarios for Create Movement Request API
- **Scenario A: Valid Input (Positive)**
  1. Clear tables.
  2. Call the Create API with a complete and valid payload.
  3. Assert that the response is `201 Created`.
  4. Verify the database contains the new request and an initial `Pending` status in `status_history`.
- **Scenario B: Missing Fields (Negative)**
  1. Clear tables.
  2. Call the Create API with an incomplete payload (e.g., missing `start_date`).
  3. Assert that the response is `400 Bad Request`.
  4. Verify nothing is saved in the database.

### Scenarios for Update Movement Request API
- **Scenario A: Valid Update (Positive)**
  1. Clear tables and insert a mock movement request.
  2. Call the Update API to change its status (e.g., to 'Approved').
  3. Assert that the response is `200 OK`.
  4. Verify the database reflects the new status and a new `status_history` record is added.
- **Scenario B: Missing ID (Negative)**
  1. Clear tables and insert a mock movement request.
  2. Call the Update API without providing an `id`.
  3. Assert that the response is `400 Bad Request`.
  4. Verify the database remains unchanged.

---

## 3. Roster Anchor API Tests
**File:** `tests/roster-anchor-api.test.ts`

### Scenarios for Get All Roster Anchors
- **Scenario A: Empty State**
  1. Clear the `roster_anchors` table.
  2. Call the API.
  3. Assert that the response returns an empty array.
- **Scenario B: Verify data retrieval**
  1. Clear the table and insert diverse roster anchors.
  2. Call the API.
  3. Assert that all anchors are retrieved successfully and the dates/assignments are correctly formatted.

### Scenarios for Get Roster Anchor By Employee ID
- **Scenario A: Correct association**
  1. Clear the table and insert anchors for multiple employees.
  2. Call the API for a specific employee ID.
  3. Assert that the response returns only the anchor assigned to that employee.

### Scenarios for Create Roster Anchor API
- **Scenario A: Valid Input (Positive)**
  1. Clear the `roster_anchors` table.
  2. Call the Create API with a valid `employee_id` and `anchor_date` (e.g., `15102023`).
  3. Assert that the response is `201 Created`.
  4. Verify the anchor is correctly inserted into the database with the properly parsed ISO date format.
- **Scenario B: Missing Fields (Negative)**
  1. Clear the `roster_anchors` table.
  2. Call the Create API with missing `employee_id` or `anchor_date`.
  3. Assert that the response is `400 Bad Request`.
  4. Verify nothing is saved in the database.

### Scenarios for Update Roster Anchor API
- **Scenario A: Valid Update (Positive)**
  1. Clear the table and insert a mock roster anchor.
  2. Call the Update API with a new valid `anchor_date`.
  3. Assert that the response is `200 OK`.
  4. Verify the database reflects the updated date.
- **Scenario B: Invalid Date Format (Negative)**
  1. Clear the table and insert a mock roster anchor.
  2. Call the Update API with an improperly formatted date string (e.g., `2023-10-15` instead of `15102023`).
  3. Assert that the response returns an error status (e.g., `500 Internal Server Error`).
  4. Verify the database remains unchanged.
