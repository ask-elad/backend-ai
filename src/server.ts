import 'dotenv/config';
import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import openapiDocument from './openapi.json';
import { PostgresTaskRepository } from './repositories/postgres-task.repository';
import { TaskService } from './services/task.service';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

const taskService = new TaskService(new PostgresTaskRepository());

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks'],
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get('/tasks', async (req: Request, res: Response) => {
  res.json(await taskService.getAll());
});

app.get('/tasks/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = await taskService.getById(id);

  if (!task) {
    res.status(404).json({ error: `Task ${id} not found` });
    return;
  }

  res.json(task);
});

app.post('/tasks', async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'title is required and must be a non-empty string' });
    return;
  }

  const newTask = await taskService.create(title.trim());
  res.status(201).json(newTask);
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, done } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    res.status(400).json({ error: 'title must be a non-empty string' });
    return;
  }

  if (done !== undefined && typeof done !== 'boolean') {
    res.status(400).json({ error: 'done must be a boolean' });
    return;
  }

  if (title === undefined && done === undefined) {
    res.status(400).json({ error: 'request body must include title and/or done' });
    return;
  }

  const updated = await taskService.update(id, {
    title: title !== undefined ? title.trim() : undefined,
    done,
  });

  if (!updated) {
    res.status(404).json({ error: `Task ${id} not found` });
    return;
  }

  res.json(updated);
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = await taskService.delete(id);

  if (!deleted) {
    res.status(404).json({ error: `Task ${id} not found` });
    return;
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task API running at http://localhost:${PORT}`);
});