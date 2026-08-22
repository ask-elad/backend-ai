import { Task } from '../types/task';
import { TaskRepository } from '../repositories/task-repository.interface';

export class TaskService {
  constructor(private repository: TaskRepository) {}

  getAll(): Task[] {
    return this.repository.findAll();
  }

  getById(id: number): Task | undefined {
    return this.repository.findById(id);
  }

  create(title: string): Task {
    return this.repository.create(title);
  }

  update(id: number, changes: { title?: string; done?: boolean }): Task | undefined {
    return this.repository.update(id, changes);
  }

  delete(id: number): boolean {
    return this.repository.delete(id);
  }
}