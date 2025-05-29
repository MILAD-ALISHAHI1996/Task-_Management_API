// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const protect = require('../middlewares/protect');

// ایجاد تسک جدید***
router.post('/', protect, taskController.createTask);

// دریافت همه تسک‌ها برای کاربر***
router.get('/', protect, taskController.getTasks);

// ویرایش تسک***
router.put('/:id', protect, taskController.updateTask);

// حذف تسک***
router.delete('/:id', protect, taskController.deleteTask);

// تغییر وضعیت complete/incomplete***
router.patch('/:id/toggle', protect, taskController.toggleComplete);

module.exports = router;
