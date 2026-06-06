CREATE TABLE IF NOT EXISTS status_history (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL REFERENCES movement_requests(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by TEXT DEFAULT 'Admin',
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status_history_request_id ON status_history(request_id);
