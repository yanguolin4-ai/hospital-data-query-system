/**
 * 数据统计相关接口路由
 * 包含：科室统计、医院整体概览
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const patients = require('../data/patients');
const doctors = require('../data/doctors');
const departments = require('../data/departments');

// 所有统计接口都需要JWT认证
router.use(authMiddleware);

/**
 * GET /api/stats/department
 * 获取各科室的患者数量、医生数量统计
 * 返回每个科室的详细统计数据
 */
router.get('/department', (req, res) => {
  // 遍历每个科室，统计该科室的患者数和医生数
  const stats = departments.map(dept => {
    // 统计该科室的患者数量
    const deptPatients = patients.filter(p => p.department === dept.name);
    // 统计该科室的医生数量
    const deptDoctors = doctors.filter(d => d.department === dept.name);
    // 统计在院患者数（排除已出院和门诊）
    const inHospitalPatients = deptPatients.filter(
      p => p.status !== '已出院' && p.status !== '门诊'
    );

    return {
      department: dept.name,
      description: dept.description,
      totalPatients: deptPatients.length,
      inHospitalPatients: inHospitalPatients.length,
      totalDoctors: deptDoctors.length,
      // 生成图表数据字段
      patientsCount: deptPatients.length,
      doctorsCount: deptDoctors.length
    };
  });

  res.json({
    code: 200,
    data: stats
  });
});

/**
 * GET /api/stats/overview
 * 获取医院整体数据概览
 * 包含：总患者数、总医生数、各状态患者分布等
 */
router.get('/overview', (req, res) => {
  // 统计患者状态分布
  const statusMap = {};
  patients.forEach(p => {
    statusMap[p.status] = (statusMap[p.status] || 0) + 1;
  });

  // 统计性别分布
  const genderMap = {};
  patients.forEach(p => {
    genderMap[p.gender] = (genderMap[p.gender] || 0) + 1;
  });

  // 统计年龄分布
  const ageGroups = {
    '0-10岁': 0,
    '11-30岁': 0,
    '31-50岁': 0,
    '51-70岁': 0,
    '70岁以上': 0
  };
  patients.forEach(p => {
    if (p.age <= 10) ageGroups['0-10岁']++;
    else if (p.age <= 30) ageGroups['11-30岁']++;
    else if (p.age <= 50) ageGroups['31-50岁']++;
    else if (p.age <= 70) ageGroups['51-70岁']++;
    else ageGroups['70岁以上']++;
  });

  res.json({
    code: 200,
    data: {
      // 整体数据
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      totalDepartments: departments.length,
      // 在院患者数
      inHospital: patients.filter(p =>
        p.status !== '已出院' && p.status !== '门诊'
      ).length,
      // 患者状态分布
      statusDistribution: statusMap,
      // 性别分布
      genderDistribution: genderMap,
      // 年龄分布
      ageDistribution: ageGroups,
      // 科室列表
      departments: departments.map(d => d.name)
    }
  });
});

module.exports = router;
