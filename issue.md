# Request Detail Modal & Action Form Implementation

## Objective
Build a pop-up Modal (or Slide-over Drawer) component in `src/app` that displays detailed information about a selected request, renders its historical audit trail, and includes a validated action form for approval or rejection.

## Step 1: Trigger & Visibility Condition
- Monitor the global `activeRequestId` state.
- If `activeRequestId` is `null`, the modal must be hidden.
- If a request ID is active, display the modal and pass the request data (or fetch it via a read endpoint if not already available in the main list state).

## Step 2: UI Layout Sections
Arrange the modal into three clear, vertical sections:
1. **Header & Meta Information:** Show the Employee Name, Role, Department, Movement Type, and requested Date Range.
2. **Audit History Trail (Read-Only):** Render a simple timeline at the bottom using the nested `status_history` array (displaying who made changes and previous comments, if any).
3. **The Action Form:**
   - A large text field (`textarea`) for the admin to input their review comments.
   - Two buttons placed side-by-side: **Approve** and **Reject**.

## Step 3: Frontend Validation Logic
Enforce the "mandatory comment" business rule before hitting the backend:
- Track the text area input using a local state: `const [comment, setComment] = useState('');`
- **Button Validation:** The "Approve" and "Reject" buttons **must remain disabled** if the comment is empty or contains only whitespace (`comment.trim().length === 0`).

## Step 4: Submission & State Reset
- Clicking either button triggers a `POST` request to `/api/requests/[id]/action` with the body payload: `{ action: 'Approved' | 'Rejected', comment: comment }`.
- **On Success (200 OK):**
  1. Refresh/re-fetch the global dashboard request list.
  2. Reset the local comment state to an empty string.
  3. Close the modal by setting `activeRequestId` back to `null`.

## Step 5: Testing
- Create unit tests for each new feature (component rendering, validation logic, API submission).
- Include both **positive** and **negative** test cases (e.g., positive: buttons enabled when comment present, API call succeeds; negative: buttons disabled when comment is empty).
- Run the test suite and ensure everything passes before submitting.
