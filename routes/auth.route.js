/**
 * 身份验证相关接口路由
 * 包含：登录接口、获取当前用户信息接口
 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth.middleware');
const users = require('../data/users');

/**
 * POST /api/auth/login
 * 登录接口：验证用户名和密码，返回JWT Token
 * 请求体：{ username: string, password: string }
 */
router.post('/login', [
  // 参数校验：用户名和密码不能为空
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], (req, res) => {
  // 检查参数校验结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      message: '参数校验失败',
      errors: errors.array()
    });
  }

  const { username, password } = req.body;

  // 在模拟用户数据中查找用户
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({
      code: 401,
      message: '用户名或密码错误'
    });
  }

  // 使用bcryptjs验证密码是否匹配
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      code: 401,
      message: '用户名或密码错误'
    });
  }

  // 生成JWT Token，有效期24小时
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // 返回成功响应（不返回密码字段）
  const { password: _, ...userInfo } = user;
  res.json({
    code: 200,
    message: '登录成功',
    data: {
      token,
      user: userInfo
    }
  });
});

/**
 * GET /api/auth/me
 * 获取当前登录用户信息
 * 需要携带有效的JWT Token
 */
router.get('/me', authMiddleware, (req, res) => {
  // 从Token中解码的用户信息查找完整用户数据
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({
      code: 404,
      message: '用户不存在'
    });
  }

  // 返回用户信息（排除密码字段）
  const { password: _, ...userInfo } = user;
  res.json({
    code: 200,
    data: userInfo
  });
});

module.exports = router;
