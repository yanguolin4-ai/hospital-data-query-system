/**
 * 医生数据相关接口路由
 * 包含：获取医生列表、查询单个医生
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const doctors = require('../data/doctors');

// 所有医生接口都需要JWT认证
router.use(authMiddleware);

/**
 * GET /api/doctors
 * 获取医生列表，支持按科室筛选
 * 查询参数：department(科室名称)
 */
router.get('/', (req, res) => {
  const { department } = req.query;
  let result = [...doctors];

  // 如果指定了科室，按科室筛选
  if (department) {
    result = result.filter(d => d.department === department);
  }

  res.json({
    code: 200,
    data: {
      list: result,
      total: result.length
    }
  });
});

/**
 * GET /api/doctors/:id
 * 根据ID查询单个医生详情
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const doctor = doctors.find(d => d.id === id);

  if (!doctor) {
    return res.status(404).json({
      code: 404,
      message: '医生不存在'
    });
  }

  res.json({
    code: 200,
    data: doctor
  });
});

module.exports = router;
