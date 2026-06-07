# Roster Dashboard

## About the App
The Roster Dashboard is an application designed to help administrators review and manage employee movement requests. It features an interactive grid to visualize the roster, alongside a comprehensive request management system. Administrators can review request details, track the audit history, and securely approve or reject requests via an action form.

## Architecture & Folder Structure
This application is built with **Next.js**, utilizing the App router for the user interface and the Pages router for the API endpoints.

- **`src/app/`**: Next.js App Router containing the main UI pages and layouts (e.g., `page.tsx`).
- **`src/components/`**: Reusable React components (like Modals and Action Forms).
- **`src/pages/api/`**: Next.js API routes serving as the backend.
- **`src/db/`**: Database schema definitions and seeding logic using Drizzle ORM.
- **`src/utils/`**: Core utility functions, including roster logic and grid calculations.
- **`tests/`**: Unit and integration test suites using Vitest.

## Tech Stack & Libraries
- **Framework**: Next.js 13
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **UI**: React 18
- **Testing**: Vitest, React Testing Library, jsdom

## Database Schema
The app uses a relational database schema:
- **`users`**: System users (`id`, `name`).
- **`employees`**: Employee directory (`id`, `name`, `department`, `role`, `created_at`).
- **`roster_anchors`**: Anchor dates for calculating employee roster shifts (`id`, `employee_id`, `anchor_date`, `created_at`).
- **`movement_requests`**: Employee movement requests (`id`, `employee_id`, `movement_type`, `start_date`, `end_date`, `status`, `current_comment`, `created_at`).
- **`status_history`**: Audit trail for requests (`id`, `request_id`, `status`, `changed_by`, `comment`, `created_at`).

## Available API Endpoints
- **`GET /api/employees`**: Retrieve a list of employees.
- **`GET /api/users`**: Retrieve a list of users.
- **`GET /api/roster-anchor`**: Retrieve roster anchors.
- **`GET /api/movement-request`**: Retrieve movement requests.
- **`POST /api/movement-request/[id]`**: Manage a specific request (e.g., submit an action to approve/reject).

## Business Rules
- **Approval/Rejection Comments**: When an administrator reviews a movement request, providing a comment is **mandatory**. The "Approve" and "Reject" actions are disabled until a valid, non-empty comment is entered.
- **Audit Trail**: Every action (approve/reject) logs a record in the `status_history` table, tracking who made the change, the resulting status, and their comment.
- **State Integration**: Active requests dynamically trigger the review modal, resetting and refreshing global dashboard state upon successful completion.

## How to Set Up the Project
1. Clone the repository and navigate to the project directory.
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Update the `DATABASE_URL` in `.env` to point to your PostgreSQL database.
4. Install dependencies:
   ```bash
   npm install
   ```

## How to Run the App
- **Development Server**: Run the app locally on `localhost:3000`:
  ```bash
  npm run dev
  ```
- **Database Migrations**: Sync the database schema:
  ```bash
  npm run migrate:generate
  npm run migrate
  ```
- **Database Seeding**: Populate the database with initial data:
  ```bash
  npm run db:seed
  ```
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## How to Test the App
The project uses Vitest for testing frontend validation, API logic, and component rendering.
- Run tests:
  ```bash
  npm run test
  ```