import db from '../db/db';
import { Task } from '../types/task';
import { TaskRepository } from './task-repository.interface';

interface TaskRow {
  id: number;
  title: string;
  done: number;
}

function serializeTask(row: TaskRow): Task {
  return { id: row.id, title: row.title, done: !!row.done };
}

export class SqliteTaskRepository implements TaskRepository {
  async findAll(): Promise<Task[]> {
    const rows = db.prepare('SELECT * FROM tasks').all() as TaskRow[];
    return rows.map(serializeTask);
  }

  async findById(id: number): Promise<Task | undefined> {
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow | undefined;
    return row ? serializeTask(row) : undefined;
  }

  async create(title: string): Promise<Task> {
    const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, 0)');
    const result = insert.run(title);
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as TaskRow;
    return serializeTask(row);
  }

  async update(id: number, changes: { title?: string; done?: boolean }): Promise<Task | undefined> {
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow | undefined;
    if (!existing) return undefined;

    const newTitle = changes.title !== undefined ? changes.title : existing.title;
    const newDone = changes.done !== undefined ? (changes.done ? 1 : 0) : existing.done;

    db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(newTitle, newDone, id);
    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow;
    return serializeTask(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return result.changes > 0;
  }
}