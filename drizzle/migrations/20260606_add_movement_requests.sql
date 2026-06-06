CREATE TABLE IF NOT EXISTS movement_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  movement_type TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'Pending',
  current_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
