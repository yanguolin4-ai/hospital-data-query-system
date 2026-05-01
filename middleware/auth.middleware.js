/**
 * JWT 身份验证中间件
 * 作用：校验请求头中的 Authorization Token，验证用户身份
 * 未携带Token或Token无效时返回401错误
 */
const jwt = require('jsonwebtoken');

// JWT密钥，生产环境应使用环境变量
const JWT_SECRET = 'hospital-api-learning-secret-key-2025';

/**
 * 认证中间件函数
 * 从请求头中提取 Bearer Token 并验证
 */
function authMiddleware(req, res, next) {
  // 从请求头获取 Authorization 字段
  const authHeader = req.headers.authorization;

  // 检查是否携带Token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未授权：请先登录获取Token'
    });
  }

  // 提取Token（去掉 "Bearer " 前缀）
  const token = authHeader.split(' ')[1];

  try {
    // 验证Token的有效性，解码得到用户信息
    const decoded = jwt.verify(token, JWT_SECRET);
    // 将解码后的用户信息挂载到 req.user，后续接口可直接使用
    req.user = decoded;
    // 继续执行下一个中间件或路由处理函数
    next();
  } catch (error) {
    // Token过期或无效
    return res.status(401).json({
      code: 401,
      message: '未授权：Token无效或已过期，请重新登录'
    });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
