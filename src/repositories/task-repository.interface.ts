import { Task } from '../types/task';

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: number): Promise<Task | undefined>;
  create(title: string): Promise<Task>;
  update(id: number, changes: { title?: string; done?: boolean }): Promise<Task | undefined>;
  delete(id: number): Promise<boolean>;
}