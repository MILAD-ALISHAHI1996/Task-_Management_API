const prisma = require('../config/db');

exports.createTask = async (req, res) => {
  const { title, description, dueDate, categoryId } = req.body;

  if (!title)
    return res.status(400).json({ message: 'Title is required' });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user.id,
      categoryId,
    },
  });

  res.status(200).json({ success: true, data: task });
};

exports.getTasks = async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.id },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: tasks });
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, categoryId, status } = req.body;

  const task = await prisma.task.update({
    where: { id: parseInt(id) },
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      categoryId,
      status,
    },
  });

  res.json({ success: true, data: task });
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  await prisma.task.delete({
    where: { id: parseInt(id) },
  });

  res.json({ success: true, message: 'Task deleted' });
};

exports.toggleComplete = async (req, res) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
  });

  const updated = await prisma.task.update({
    where: { id: parseInt(id) },
    data: { status: task.status === 'complete' ? 'incomplete' : 'complete' },
  });

  res.json({ success: true, data: updated });
};
