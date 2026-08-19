import Database from 'better-sqlite3';
const db: Database.Database = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

const row = db.prepare('SELECT COUNT(*) AS count FROM tasks').get() as { count: number };

if (row.count === 0) {
  const seed = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  seed.run('Learn Express', 0);
  seed.run('Build Task API', 0);
  seed.run('Write tests', 1);
}

export default db;