/**
 * 患者数据相关接口路由
 * 包含：获取患者列表、查询单个患者、搜索患者
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const patients = require('../data/patients');

// 所有患者接口都需要JWT认证
router.use(authMiddleware);

/**
 * GET /api/patients
 * 获取患者列表，支持分页
 * 查询参数：page(页码，默认1)、pageSize(每页条数，默认10)
 */
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 分页切片
  const paginatedPatients = patients.slice(startIndex, endIndex);

  res.json({
    code: 200,
    data: {
      list: paginatedPatients,
      total: patients.length,
      page,
      pageSize,
      totalPages: Math.ceil(patients.length / pageSize)
    }
  });
});

/**
 * GET /api/patients/search
 * 根据姓名或科室搜索患者
 * 查询参数：name(姓名模糊匹配)、department(科室精确匹配)
 * 注意：此路由必须放在 /:id 之前，否则会被 /:id 捕获
 */
router.get('/search', (req, res) => {
  const { name, department } = req.query;
  let result = [...patients];

  // 按姓名模糊搜索（不区分大小写）
  if (name) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // 按科室精确搜索
  if (department) {
    result = result.filter(p => p.department === department);
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
 * GET /api/patients/:id
 * 根据ID查询单个患者详情
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return res.status(404).json({
      code: 404,
      message: '患者不存在'
    });
  }

  res.json({
    code: 200,
    data: patient
  });
});

module.exports = router;
