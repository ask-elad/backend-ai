CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO tasks (title, done)
SELECT * FROM (VALUES
  ('Learn Express', false),
  ('Build Task API', false),
  ('Write tests', true)
) AS seed(title, done)
WHERE NOT EXISTS (SELECT 1 FROM tasks);