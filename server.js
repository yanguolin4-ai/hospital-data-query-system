/**
 * 医院数据资料登录查询系统 - 后端服务入口
 * 使用 Express 框架搭建轻量级 RESTful API 服务
 */
const express = require('express');
const cors = require('cors');          // 跨域中间件，允许前端跨域请求后端API
const morgan = require('morgan');      // 请求日志中间件，记录每次HTTP请求信息
const path = require('path');

// 创建Express应用实例
const app = express();
const PORT = 3000;

// ============ 中间件配置 ============

// 解析JSON请求体，使req.body能够接收JSON格式数据
app.use(express.json());

// 解析URL编码的请求体（表单提交）
app.use(express.urlencoded({ extended: true }));

// 配置CORS跨域，允许所有来源访问（开发环境使用）
app.use(cors());

// 配置请求日志格式，使用'dev'预设格式记录请求方法、状态码等
app.use(morgan('dev'));

// 托管前端静态资源文件，访问根路径时自动返回public目录下的文件
app.use(express.static(path.join(__dirname, 'public')));

// ============ 路由挂载 ============

// 身份验证相关接口（登录、获取用户信息）
app.use('/api/auth', require('./routes/auth.route'));

// 患者数据相关接口（列表、详情、搜索）
app.use('/api/patients', require('./routes/patients.route'));

// 医生数据相关接口（列表、详情）
app.use('/api/doctors', require('./routes/doctors.route'));

// 数据统计相关接口（科室统计、整体概览）
app.use('/api/stats', require('./routes/stats.route'));

// ============ 全局错误处理 ============

// 处理404 - 未找到的路由
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在'
  });
});

// 全局异常捕获中间件
app.use((err, req, res, next) => {
  console.error('服务器错误：', err);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  });
});

// ============ 启动服务 ============
app.listen(PORT, () => {
  console.log(`\n🏥 医院数据资料登录查询系统`);
  console.log(`✅ 服务已启动: http://localhost:${PORT}`);
  console.log(`📋 登录页面: http://localhost:${PORT}/login.html`);
  console.log(`📋 主页面: http://localhost:${PORT}/index.html`);
  console.log(`\n测试账号: admin / 123456\n`);
});
