# Implementation Plan: Database Seeding Script (`seed.ts`)

## Objective
Create a database seeding script (`seed.ts`) using Drizzle ORM to populate the database with realistic mock data. This will help with testing the dashboard UI. The script should clear existing data, create employees across various departments, set up staggered roster anchors, and generate pending movement requests.

## Requirements & Constraints
- **Drizzle ORM**: Use Drizzle ORM for all database operations.
- **Data Distribution**: Employees should belong to Operations, Logistics, and Engineering.
- **Realistic overlapping**: Roster anchors must be staggered by 7 and 14 days so the 28/7 schedules overlap properly.
- **Pending Requests**: Need 5-10 movement requests in the 'Pending' state.

---

## Step 1: Create the Seeding Script File

1. **Locate/Create File**: Inside your project, create or open a `src/db/seed.ts` file.
2. **Setup Imports**: Import the `db` connection instance and your schema definitions (e.g., `employees`, `roster_anchors`, `movement_requests`) from `drizzle-orm`.

---

## Step 2: Clear Existing Data

1. **Write the deletion logic**: At the start of the `main()` function in the script, write commands to delete all existing records in the tables to prevent duplication or foreign key constraint errors.
2. **Order of Deletion**: Ensure you delete from child tables before parent tables to respect foreign key constraints:
   - Clear `movement_requests`.
   - Clear `roster_anchors`.
   - Clear `employees`.

---

## Step 3: Insert Mock Employees

1. **Prepare Employee Data**: Create an array of 15–20 mock employee objects.
2. **Departments & Roles**: Ensure they are distributed across:
   - **Operations**: e.g., Operator, Supervisor, Manager.
   - **Logistics**: e.g., Logistics Coordinator, Driver.
   - **Engineering**: e.g., Maintenance Engineer, Technician.
3. **Insert Data**: Use `db.insert(employees).values(mockEmployees).returning()` to retrieve their IDs for the next steps.

---

## Step 4: Create Staggered Roster Anchors

1. **Define Anchor Dates**: Choose a base date (e.g., `new Date('2023-01-01')`).
2. **Iterate and Stagger**: Loop through the inserted employees. For each employee, create a `roster_anchor` record.
   - To make the 28/7 schedules overlap realistically, stagger the start dates by adding 0, 7, or 14 days to the base date depending on the employee index (e.g., `index % 3`).
3. **Insert Anchors**: Insert these generated anchor objects into the `roster_anchors` table, linking them to the newly generated `employee_id`s.

---

## Step 5: Generate Pending Movement Requests

1. **Select Employees for Requests**: Randomly pick 5–10 employees from the inserted pool, making sure they span the different departments.
2. **Prepare Request Data**: Create `movement_requests` for them. Set their status strictly to `'Pending'`. Add realistic request details (e.g., changing swing, requesting leave, etc.).
3. **Insert Requests**: Insert the array of movement requests into the `movement_requests` table.

---

## Step 6: Execute the Script

1. **Close Connection**: Make sure your script gracefully exits after finishing (e.g., `process.exit(0)`).
2. **Add NPM Script (Optional)**: Add a script to `package.json` to run the seed file (e.g., `"db:seed": "ts-node src/db/seed.ts"` or similar using `tsx` depending on your setup).
3. **Run**: Run the script using `npm run db:seed`.
4. **Verification**: Check your database to verify that the tables have been correctly populated with the staggering and pending requests.
