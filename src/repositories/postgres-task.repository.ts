import pool from '../db/postgres';
import { Task } from '../types/task';
import { TaskRepository } from './task-repository.interface';

interface TaskRow {
  id: number;
  title: string;
  done: boolean;
}

function serializeTask(row: TaskRow): Task {
  return { id: row.id, title: row.title, done: row.done };
}

export class PostgresTaskRepository implements TaskRepository {
  async findAll(): Promise<Task[]> {
    const result = await pool.query<TaskRow>('SELECT * FROM tasks ORDER BY id');
    return result.rows.map(serializeTask);
  }

  async findById(id: number): Promise<Task | undefined> {
    const result = await pool.query<TaskRow>('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] ? serializeTask(result.rows[0]) : undefined;
  }

  async create(title: string): Promise<Task> {
    const result = await pool.query<TaskRow>(
      'INSERT INTO tasks (title, done) VALUES ($1, false) RETURNING *',
      [title]
    );
    return serializeTask(result.rows[0]!);
  }

  async update(id: number, changes: { title?: string; done?: boolean }): Promise<Task | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const newTitle = changes.title !== undefined ? changes.title : existing.title;
    const newDone = changes.done !== undefined ? changes.done : existing.done;

    const result = await pool.query<TaskRow>(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
      [newTitle, newDone, id]
    );
    return serializeTask(result.rows[0]!);
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}