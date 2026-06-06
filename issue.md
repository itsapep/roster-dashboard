# Implementation Plan: Dashboard APIs & Performance Optimization

## Objective
Enhance existing services to support new dashboard features (Employee Directory, Manager Approval Dashboard, Calendar Shifts) and optimize existing database queries to avoid performance bottlenecks.

## Requirements & Constraints
- Implement functions in the `services` layer and expose them via the `routes` layer.
- Follow the existing folder structure (`src/services/` and `src/routes/`).
- Fix the N+1 query issue in movement requests without changing the existing response format.
- Test all newly created APIs thoroughly using a REST client (e.g., Postman or Insomnia).

---

## Step 1: Enhance Employee Service

1. **Locate Service File**: Open `src/services/employee-service.ts`.
2. **Add Fetch Function**:
   - Create and export an async function `getAllEmployees()`.
   - Use Drizzle ORM to select all records from the `employees` table.
3. **Route Integration**:
   - Create `src/routes/employee-route.ts` (if it does not exist).
   - Implement a `GET` handler to return the employee list and test it.

---

## Step 2: Optimize & Enhance Movement Request Service

1. **Locate Service File**: Open `src/services/movement-request-service.ts`.
2. **Fix N+1 Query in `getAllMovementRequests`**:
   - Remove the `status_history` database query from inside the `Promise.all` loop.
   - Instead, fetch all `movement_requests`, extract their IDs into an array, and perform a single `inArray` query on `status_history`.
   - Group the fetched histories by `request_id` in memory, then map over the requests array to attach the nested `status_history`.
3. **Add `getMovementRequestsByEmployeeId`**:
   - Create an async function that takes an `employeeId` parameter.
   - Query `movement_requests` filtering by `employee_id`.
   - Retrieve their `status_history` efficiently (as done above) and nest it in the response.
4. **Add `getPendingMovementRequests`**:
   - Create an async function to fetch requests where `status` is `'Pending'`.
   - Retrieve their `status_history` efficiently and nest it in the response.
5. **Route Integration**:
   - Open `src/routes/movement-request-route.ts`.
   - Add new handlers (or update the existing `GET` handler to parse query parameters) to expose these new read views.

---

## Step 3: Enhance Roster Anchor Service

1. **Locate Service File**: Open `src/services/roster-anchor-service.ts`.
2. **Add Read Functions**:
   - Create and export `getAllRosterAnchors()` to retrieve all anchors for the calendar display.
   - Create and export `getRosterAnchorByEmployeeId(employeeId: number)`.
3. **Route Integration**:
   - Create `src/routes/roster-anchor-route.ts`.
   - Implement corresponding `GET` handlers for the new retrieval functions.

---

## Step 4: Testing & Verification

1. **Employee List API**: Verify the response contains a JSON array of all employees.
2. **Movement Request APIs**:
   - Fetch all requests to verify the N+1 issue is fixed without breaking the payload shape (verify `status_history` remains nested).
   - Fetch by `employee_id` and ensure no other employees' requests leak.
   - Fetch pending requests and ensure all returned items have a `Pending` status.
3. **Roster Anchor APIs**: Verify calendar anchor retrieval correctly returns employee assignments and dates.
