# Implementation Plan: Status History Audit Trail

## Objective
Implement a `status_history` table to serve as a read-only audit log for movement requests. This log will track status changes automatically. The project uses Next.js, Drizzle ORM, and PostgreSQL.

## Requirements & Constraints
- **No Standalone API**: Do NOT create a standalone CRUD API for the `status_history` table. It is a strictly read-only audit log.
- **Automatic Writes**: Writing to `status_history` must only happen automatically inside the existing `POST` or `PUT` endpoints in the `movement_requests` table when a request is approved, rejected, or created.
- **Nested Reads**: Reading the history should be handled by nesting the history relation inside the main `movement_requests` fetch endpoints (GET All and GET By ID).

## Folder & File Structure Strategy
Inside the `src` folder, adhere to the following file structure:
- `src/routes/`: Contains routing handlers for Next.js. Format: `[entity]-route.ts` (e.g., `employee-route.ts`).
- `src/services/`: Contains app business logic and database queries. Format: `[entity]-service.ts` (e.g., `employee-service.ts`).

---

## Step 1: Database Schema Update

1. **Locate Schema File**: Open the Drizzle schema file (usually `src/db/schema.ts`).
2. **Create `status_history` Table**: Add the new table definition with the following columns:
   - `id`: Auto-incrementing integer, Primary Key (`serial('id').primaryKey()`).
   - `request_id`: Integer, Foreign Key linking to `movement_requests.id`. Ensure On Delete Cascade is configured (`integer('request_id').references(() => movement_requests.id, { onDelete: 'cascade' })`).
   - `status`: Text string (`text('status')`).
   - `changed_by`: Text string, defaults to 'Admin' (`text('changed_by').default('Admin')`).
   - `comment`: Text string, required (`text('comment').notNull()`).
   - `created_at`: Timestamp, defaults to current time (`timestamp('created_at').defaultNow()`).
3. **Define Drizzle Relations**:
   - Add a relation for `movement_requests` indicating it has many `status_history` entries.
   - Add a relation for `status_history` indicating it belongs to one `movement_request`.
4. **Generate & Apply Migrations**:
   - Run `npm run migrate:generate` to generate SQL migrations.
   - Run `npm run migrate` to apply the changes to the PostgreSQL database.

---

## Step 2: Update Business Logic (Services)

1. **Locate Service File**: Open `src/services/movement-request-service.ts`.
2. **Update Write Operations (`POST` / `PUT`)**:
   - When creating a movement request or updating its status, you must automatically insert a record into the `status_history` table at the same time.
   - Use a **Database Transaction** (`db.transaction()`) to ensure the `movement_requests` insert/update and the `status_history` insert happen together atomically.
   - Make sure to pass the `comment` and `status` from the route down to the service to populate the history table properly.
3. **Update Read Operations (`GET`)**:
   - Update `getAllMovementRequests` and `getMovementRequestById` to include the `status_history` relation.
   - If using Drizzle Relational Queries, add `{ with: { status_history: true } }` to your query so the history is automatically nested inside each returned movement request object.

---

## Step 3: Update Route Handlers

1. **Locate Route File**: Open `src/routes/movement-request-route.ts`.
2. **Update Body Parsing**:
   - Ensure the request body parser properly extracts the `comment` field during `POST` and `PUT` requests, so it can be passed over to the service layer.
   - Ensure the GET handlers are prepared to return the response which will now contain the newly nested `status_history` data.

---

## Step 4: Testing & Verification

1. **Start the Server**: Ensure your database is running and up to date, then run `npm run dev` to start your Next.js application.
2. **Test POST (Create)**: Send a `POST` request to create a movement request. Include a `comment` in your payload. Verify that the database successfully creates the request *and* an initial `status_history` record automatically.
3. **Test PUT (Update)**: Send a `PUT` request to update the status (e.g., to 'Approved') and provide a `comment`. Verify the response is successful and a new row is added to the `status_history` table.
4. **Test GET All**: Send a `GET` request to fetch all movement requests. Ensure that the JSON response includes a `status_history` array properly nested inside each returned movement request object.
5. **Test GET By ID**: Send a `GET` request for a specific movement request ID. Verify that the nested `status_history` array contains the full audit trail with their respective statuses, comments, changed_by, and timestamps.
