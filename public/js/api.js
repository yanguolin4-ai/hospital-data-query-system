/**
 * 前端接口调用封装模块
 * 统一处理 Token、请求头、错误处理、401跳转
 */

// API基础路径
const API_BASE = '';

/**
 * 统一的请求封装函数
 * @param {string} url - 请求路径（如 /api/patients）
 * @param {object} options - fetch请求选项
 * @returns {Promise<object>} 后端返回的JSON数据
 */
async function request(url, options = {}) {
  // 从localStorage获取Token
  const token = localStorage.getItem('token');

  // 构建请求头，自动携带Authorization
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // 如果存在Token，自动添加到请求头
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // 发送fetch请求
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers
    });

    // 解析响应JSON
    const data = await response.json();

    // 处理401未授权：Token无效或过期，跳转到登录页
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('登录已过期，请重新登录');
      window.location.href = '/login.html';
      return null;
    }

    // 返回包含状态码和数据的对象
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    // 网络错误处理
    console.error('请求失败:', error);
    return {
      ok: false,
      status: 0,
      data: { message: '网络错误，请检查网络连接' }
    };
  }
}

/**
 * 封装常用HTTP方法
 */
const api = {
  /**
   * GET请求
   */
  get: (url) => request(url, { method: 'GET' }),

  /**
   * POST请求
   */
  post: (url, body) => request(url, {
    method: 'POST',
    body: JSON.stringify(body)
  }),

  /**
   * PUT请求
   */
  put: (url, body) => request(url, {
    method: 'PUT',
    body: JSON.stringify(body)
  }),

  /**
   * DELETE请求
   */
  delete: (url) => request(url, { method: 'DELETE' })
};
