import express, { Request, Response } from 'express';

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

app.listen(PORT, () => {
  console.log(`Task API running at http://localhost:${PORT}`);
});