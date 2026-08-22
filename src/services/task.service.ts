import { Task } from '../types/task';
import { TaskRepository } from '../repositories/task-repository.interface';

export class TaskService {
  constructor(private repository: TaskRepository) {}

  async getAll(): Promise<Task[]> {
    return this.repository.findAll();
  }

  async getById(id: number): Promise<Task | undefined> {
    return this.repository.findById(id);
  }

  async create(title: string): Promise<Task> {
    return this.repository.create(title);
  }

  async update(id: number, changes: { title?: string; done?: boolean }): Promise<Task | undefined> {
    return this.repository.update(id, changes);
  }

  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}