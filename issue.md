# Implementation Plan: Roster Anchor Feature

## Objective
Implement a `roster_anchors` table and a corresponding API endpoint to add and update roster anchors. This feature uses Next.js, Drizzle ORM, and PostgreSQL.

## Folder & File Structure Strategy
Inside the `src` folder, you must use the following structure:
- `src/routes/`: Contains Next.js routing logic handlers. Format: `[entity]-route.ts` (e.g., `roster-anchor-route.ts`).
- `src/services/`: Contains app business logic. Format: `[entity]-service.ts` (e.g., `roster-anchor-service.ts`).

*Note for implementor: Ensure you properly link the handler in `src/routes/roster-anchor-route.ts` to the Next.js API routing system (e.g., `src/pages/api/roster-anchor.ts`) so the endpoint is accessible.*

---

## Step 1: Database Schema

1. **Locate Schema File**: Open the Drizzle schema file (usually `src/db/schema.ts`).
2. **Define Table**: Add the following `roster_anchors` table:
   - `id`: Auto-incrementing integer, Primary Key (`serial('id').primaryKey()`).
   - `employee_id`: Integer, Foreign Key linking to `employees.id` with cascade on delete (`integer('employee_id').references(() => employees.id, { onDelete: 'cascade' })`).
   - `anchor_date`: Date object (`date('anchor_date')`).
   - `created_at`: Timestamp, defaults to `current_timestamp` (`timestamp('created_at').defaultNow()`).
3. **Generate & Run Migrations**:
   - Run `npm run migrate:generate` to generate SQL migrations.
   - Run `npm run migrate` to execute the migration against the PostgreSQL database.

---

## Step 2: Create the Service (Business Logic)

1. **Create File**: Create `src/services/roster-anchor-service.ts`.
2. **Implement Logic**: 
   - Import the database connection (from `src/db/index.ts`) and the `roster_anchors` schema.
   - **Create function (`createRosterAnchor`)**:
     - Accepts an object containing `employee_id` (number) and `anchor_date` (string in `ddmmyyyy` format).
     - Parses the `anchor_date` string into a valid Date object or ISO string required by the database.
     - Uses Drizzle ORM to `insert` the data into the `roster_anchors` table.
   - **Update function (`updateRosterAnchor`)**:
     - Accepts an object containing `employee_id` and `anchor_date`.
     - Parses the `anchor_date` string similarly to the create function.
     - Uses Drizzle ORM to `update` the `roster_anchors` table where the `employee_id` matches the input.

---

## Step 3: Create the Route Handlers

1. **Create File**: Create `src/routes/roster-anchor-route.ts`.
2. **Implement Handlers**:
   - Import the service functions (`createRosterAnchor` and `updateRosterAnchor`) from `src/services/roster-anchor-service.ts`.
   - **POST Handler**:
     - Extract `employee_id` and `anchor_date` from the `req.body`.
     - **Request Body Expected:**
     ```json
     {
           "employee_id": 1,
           "anchor_date": "15102023"
     }
     ```
     - Call `createRosterAnchor` inside a `try...catch` block.
     - **Success Response** (HTTP 200 or 201): `{ "message": "Success add roster anchor" }`
     - **Error Response** (HTTP 500): `{ "message": "Error add roster anchor" }`
   - **PUT Handler**:
     - Extract `employee_id` and `anchor_date` from the `req.body`.
     - Call `updateRosterAnchor` inside a `try...catch` block.
     - **Success Response** (HTTP 200): `{ "message": "Success update roster anchor" }`
     - **Error Response** (HTTP 500): `{ "message": "Error update roster anchor" }`

---

## Step 4: Expose the API Endpoint

1. **Link to Next.js**: Create the actual endpoint at `/api/roster-anchor`.
2. **Implementation**:
   - Create the file `src/pages/api/roster-anchor.ts`.
   - Import your `postHandler` and `putHandler` from `src/routes/roster-anchor-route.ts`.
   - Check `req.method`:
     - If `'POST'`, call the POST handler.
     - If `'PUT'`, call the PUT handler.
     - Otherwise, set header `Allow` to `['POST', 'PUT']` and return HTTP 405 `Method Not Allowed`.
3. **Test the Endpoints**: Send requests to `http://localhost:3000/api/roster-anchor` using tools like Postman or cURL to verify both the `POST` and `PUT` methods are properly responding.
