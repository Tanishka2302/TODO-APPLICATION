const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// CREATE todo
router.post('/', async (req, res) => {
  try {
    const { title, date } = req.body;

    console.log('POST /api/todos', req.body);

    if (!title || !date) {
      return res.status(400).json({
        message: 'Title and date are required',
      });
    }

    const todo = new Todo({
      title: title.trim(),
      date,
      completed: false,
    });

    await todo.save();

    res.status(201).json(todo);
  } catch (error) {
    console.error('ADD TODO ERROR:', error.message);
    res.status(500).json({
      message: 'Failed to add todo',
      error: error.message,
    });
  }
});


// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE todo (toggle complete)
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
