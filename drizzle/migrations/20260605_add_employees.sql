-- Migration: add employees table
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
