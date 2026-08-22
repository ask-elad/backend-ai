import { Task } from '../types/task';

export interface TaskRepository {
  findAll(): Task[];
  findById(id: number): Task | undefined;
  create(title: string): Task;
  update(id: number, changes: { title?: string; done?: boolean }): Task | undefined;
  delete(id: number): boolean;
}