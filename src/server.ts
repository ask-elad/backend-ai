import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import openapiDocument from './openapi.json';

const app = express();
const PORT = 3000;

app.use(express.json());

interface Task {
  id: number;
  title: string;
  done: boolean;
}

const tasks: Task[] = [
  { id: 1, title: 'Learn Express', done: false },
  { id: 2, title: 'Build Task API', done: false },
  { id: 3, title: 'Write tests', done: true },
];

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

app.get('/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    res.status(404).json({ error: `Task ${id} not found` });
    return;
  }

  res.json(task);
});

app.post('/tasks', (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'title is required and must be a non-empty string' });
    return;
  }

  const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

  const newTask: Task = {
    id: nextId,
    title: title.trim(),
    done: false,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    res.status(404).json({ error: `Task ${id} not found` });
    return;
  }

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

  if (title !== undefined) task.title = title.trim();
  if (done !== undefined) task.done = done;

  res.json(task);
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: `Task ${id} not found` });
    return;
  }

  tasks.splice(index, 1);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task API running at http://localhost:${PORT}`);
});