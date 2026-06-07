# Roster Dashboard Grid UI Implementation

## Objective
Build a visual grid (calendar/timeline layout) to display daily rotation status for employees based on selected month, department, and active overrides.

## Step 1: Component Input (Props)
The grid component should accept the following props:
- `employeesList`: Array of employee objects from the API.
- `currentViewDate`: The selected month/year (e.g., June 2026).
- `approvedRequests`: Array of 'Approved' requests to handle block-swaps.

## Step 2: Grid Structure (UI Layout)
Build a scrollable matrix layout using a horizontal table or CSS Grid:
- **Rows (Y-Axis):** One row per employee in the selected department.
- **Columns (X-Axis):** Each calendar day of the `currentViewDate` month (Day 1 to 30/31).

## Step 3: Day-by-Day Cell Calculation
For each cell (Employee × Specific Date), use existing utils to compute its state sequentially:

1. **Calculate Base Roster**:
   - `Day in Cycle = (Cell Date - Employee Anchor Date) % 35`
   - Days 0–27: Base State = `Working`
   - Days 28–34: Base State = `Day Off`

2. **Apply Block-Swap Overrides**:
   - Check if the cell date falls within an approved early leave range for the employee.
   - If Base = `Working` AND within approved request -> Render as `Day Off` (visual change).
   - If Base = `Day Off` (and they took it early) -> Render as `Working` (the payback).

## Step 4: Visual Styling Guidelines
Ensure the dashboard is readable at a glance:
- 💼 **Working Day Cells**: Neutral background (white or light gray) with a subtle border.
- 🏖️ **Standard Day Off Cells**: Soft accent background (soft blue or light green).
- 🔄 **Swapped Day Off Cells**: High-visibility indicator (e.g., a small swap icon or dotted border) so admins instantly recognize early moved days.

## Step 5: Testing
- Create unit tests for each new feature (component rendering, logic calculations).
- Include both **positive** and **negative** test cases.
- Run the test suite and ensure everything passes before submitting.
