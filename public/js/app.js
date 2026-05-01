/**
 * 前端业务逻辑代码
 * 处理页面交互、数据加载、图表渲染等
 */

// ============ 全局变量 ============
let currentPage = 1;       // 当前患者列表页码
const pageSize = 10;       // 每页显示条数

// ============ 页面初始化 ============

/**
 * 页面加载完成后执行
 * 检查登录状态，加载初始数据
 */
window.addEventListener('DOMContentLoaded', () => {
  // 检查是否已登录
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // 显示当前用户信息
  const userInfo = JSON.parse(user);
  document.getElementById('userInfo').textContent = `欢迎，${userInfo.realName}`;

  // 初始化默认请求头
  updateDefaultHeaders();

  // 监听请求方法变化，控制请求体显示/隐藏
  document.getElementById('apiMethod').addEventListener('change', toggleBodyGroup);

  // 加载初始数据
  loadPatients();
  loadDoctors();
  loadStats();

  // 标签页切换时重新加载图表（Chart.js需要容器可见才能正确渲染）
  document.querySelectorAll('#mainTabs a').forEach(tab => {
    tab.addEventListener('shown.bs.tab', (e) => {
      if (e.target.getAttribute('href') === '#stats') {
        // 延迟渲染图表，确保容器已可见
        setTimeout(loadStats, 100);
      }
    });
  });
});

// ============ 退出登录 ============

/**
 * 退出登录：清除本地存储的Token并跳转到登录页
 */
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

// ============ 患者查询模块 ============

/**
 * 加载患者列表（分页）
 */
async function loadPatients(page = 1) {
  currentPage = page;
  const tbody = document.getElementById('patientTableBody');

  const result = await api.get(`/api/patients?page=${page}&pageSize=${pageSize}`);

  if (!result || !result.ok) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">加载失败</td></tr>';
    return;
  }

  const { list, total, totalPages } = result.data.data;

  // 渲染表格内容
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">暂无数据</td></tr>';
  } else {
    tbody.innerHTML = list.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.gender}</td>
        <td>${p.age}</td>
        <td>${p.department}</td>
        <td>${p.diagnosis}</td>
        <td><span class="badge ${getStatusBadgeClass(p.status)}">${p.status}</span></td>
        <td><button class="btn btn-sm btn-outline-primary" onclick="showPatientDetail(${p.id})">详情</button></td>
      </tr>
    `).join('');
  }

  // 渲染分页控件
  renderPagination(total, totalPages);
}

/**
 * 根据患者状态返回对应的Bootstrap Badge样式类
 */
function getStatusBadgeClass(status) {
  const map = {
    '住院中': 'bg-primary',
    '已出院': 'bg-success',
    '待手术': 'bg-warning text-dark',
    '重症监护': 'bg-danger',
    '门诊': 'bg-secondary'
  };
  return map[status] || 'bg-secondary';
}

/**
 * 渲染分页控件
 */
function renderPagination(total, totalPages) {
  const container = document.getElementById('patientPagination');
  if (total <= pageSize) {
    container.innerHTML = `<span class="text-muted">共 ${total} 条记录</span>`;
    return;
  }

  let html = `<span class="text-muted">共 ${total} 条记录，第 ${currentPage}/${totalPages} 页</span>`;
  html += '<div>';
  if (currentPage > 1) {
    html += `<button class="btn btn-sm btn-outline-primary me-1" onclick="loadPatients(${currentPage - 1})">上一页</button>`;
  }
  if (currentPage < totalPages) {
    html += `<button class="btn btn-sm btn-outline-primary" onclick="loadPatients(${currentPage + 1})">下一页</button>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

/**
 * 搜索患者（按姓名/科室）
 */
async function searchPatients() {
  const name = document.getElementById('patientSearch').value.trim();
  const department = document.getElementById('patientDeptFilter').value;
  const tbody = document.getElementById('patientTableBody');

  let url = '/api/patients/search?';
  if (name) url += `name=${encodeURIComponent(name)}&`;
  if (department) url += `department=${encodeURIComponent(department)}`;

  const result = await api.get(url);

  if (!result || !result.ok) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">搜索失败</td></tr>';
    return;
  }

  const { list } = result.data.data;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">未找到匹配的患者</td></tr>';
  } else {
    tbody.innerHTML = list.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.gender}</td>
        <td>${p.age}</td>
        <td>${p.department}</td>
        <td>${p.diagnosis}</td>
        <td><span class="badge ${getStatusBadgeClass(p.status)}">${p.status}</span></td>
        <td><button class="btn btn-sm btn-outline-primary" onclick="showPatientDetail(${p.id})">详情</button></td>
      </tr>
    `).join('');
  }

  // 隐藏分页（搜索结果不分页）
  document.getElementById('patientPagination').innerHTML = `<span class="text-muted">搜索到 ${list.length} 条记录</span>`;
}

/**
 * 显示患者详情
 */
async function showPatientDetail(id) {
  const result = await api.get(`/api/patients/${id}`);
  if (!result || !result.ok) return;

  const p = result.data.data;
  const card = document.getElementById('patientDetailCard');
  const body = document.getElementById('patientDetailBody');

  body.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <table class="table table-borderless">
          <tr><th width="100">姓名</th><td>${p.name}</td></tr>
          <tr><th>性别</th><td>${p.gender}</td></tr>
          <tr><th>年龄</th><td>${p.age} 岁</td></tr>
          <tr><th>电话</th><td>${p.phone}</td></tr>
          <tr><th>身份证号</th><td>${p.idCard}</td></tr>
        </table>
      </div>
      <div class="col-md-6">
        <table class="table table-borderless">
          <tr><th width="100">科室</th><td>${p.department}</td></tr>
          <tr><th>主治医生</th><td>${p.doctor}</td></tr>
          <tr><th>诊断</th><td>${p.diagnosis}</td></tr>
          <tr><th>状态</th><td><span class="badge ${getStatusBadgeClass(p.status)}">${p.status}</span></td></tr>
          <tr><th>床位</th><td>${p.bedNumber}</td></tr>
          <tr><th>入院日期</th><td>${p.admissionDate}</td></tr>
          ${p.dischargeDate ? `<tr><th>出院日期</th><td>${p.dischargeDate}</td></tr>` : ''}
        </table>
      </div>
    </div>
    <div class="mt-2">
      <strong>备注：</strong> <span class="text-muted">${p.notes}</span>
    </div>
  `;

  card.classList.remove('d-none');
}

/**
 * 隐藏患者详情卡片
 */
function hidePatientDetail() {
  document.getElementById('patientDetailCard').classList.add('d-none');
}

// ============ 医生查询模块 ============

/**
 * 加载医生列表，支持按科室筛选
 */
async function loadDoctors() {
  const department = document.getElementById('doctorDeptFilter').value;
  let url = '/api/doctors';
  if (department) url += `?department=${encodeURIComponent(department)}`;

  const result = await api.get(url);
  const container = document.getElementById('doctorList');

  if (!result || !result.ok) {
    container.innerHTML = '<div class="col-12 text-center text-danger">加载失败</div>';
    return;
  }

  const { list } = result.data.data;

  if (list.length === 0) {
    container.innerHTML = '<div class="col-12 text-center text-muted">暂无医生数据</div>';
    return;
  }

  container.innerHTML = list.map(d => `
    <div class="col-md-6 col-lg-4 mb-3">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${d.name} <small class="text-muted">(${d.title})</small></h5>
          <p class="card-text mb-1"><strong>科室：</strong>${d.department}</p>
          <p class="card-text mb-1"><strong>专长：</strong><small>${d.specialty}</small></p>
          <button class="btn btn-sm btn-outline-primary mt-2" onclick="showDoctorDetail(${d.id})">查看详情</button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * 显示医生详情模态框
 */
async function showDoctorDetail(id) {
  const result = await api.get(`/api/doctors/${id}`);
  if (!result || !result.ok) return;

  const d = result.data.data;
  document.getElementById('doctorModalTitle').textContent = `${d.name} - ${d.title}`;

  // 排班信息
  const dayNames = { monday: '周一', tuesday: '周二', wednesday: '周三', thursday: '周四', friday: '周五', saturday: '周六', sunday: '周日' };
  const scheduleHtml = Object.entries(d.schedule).map(([day, time]) => {
    const colorClass = time === '全天' ? 'text-success' : time === '上午' ? 'text-primary' : 'text-muted';
    return `<span class="me-3 ${colorClass}"><strong>${dayNames[day]}：</strong>${time}</span>`;
  }).join('');

  document.getElementById('doctorModalBody').innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <table class="table">
          <tr><th width="80">姓名</th><td>${d.name}</td></tr>
          <tr><th>性别</th><td>${d.gender}</td></tr>
          <tr><th>年龄</th><td>${d.age} 岁</td></tr>
          <tr><th>电话</th><td>${d.phone}</td></tr>
          <tr><th>科室</th><td>${d.department}</td></tr>
          <tr><th>职称</th><td>${d.title}</td></tr>
          <tr><th>专长</th><td>${d.specialty}</td></tr>
        </table>
      </div>
      <div class="col-md-6">
        <h6>排班信息</h6>
        <div class="mb-3">${scheduleHtml}</div>
        <h6>个人简介</h6>
        <p class="text-muted">${d.introduction}</p>
      </div>
    </div>
  `;

  // 显示模态框
  const modal = new bootstrap.Modal(document.getElementById('doctorModal'));
  modal.show();
}

// ============ 数据统计模块 ============

// 图表实例引用，用于销毁重建
let deptBarChartInstance = null;
let statusPieChartInstance = null;
let ageChartInstance = null;
let genderChartInstance = null;

/**
 * 加载统计数据并渲染图表
 */
async function loadStats() {
  // 并行请求概览数据和科室统计
  const [overviewResult, deptResult] = await Promise.all([
    api.get('/api/stats/overview'),
    api.get('/api/stats/department')
  ]);

  if (overviewResult && overviewResult.ok) {
    const overview = overviewResult.data.data;
    // 更新概览数字
    document.getElementById('statTotalPatients').textContent = overview.totalPatients;
    document.getElementById('statInHospital').textContent = overview.inHospital;
    document.getElementById('statTotalDoctors').textContent = overview.totalDoctors;
    document.getElementById('statTotalDepts').textContent = overview.totalDepartments;

    // 渲染饼图：患者状态分布
    renderPieChart('statusPieChart', 'statusPieChartInstance',
      Object.keys(overview.statusDistribution),
      Object.values(overview.statusDistribution),
      ['住院中', '已出院', '待手术', '重症监护', '门诊']
    );

    // 渲染柱状图：年龄分布
    renderBarChart('ageChart', 'ageChartInstance',
      Object.keys(overview.ageDistribution),
      Object.values(overview.ageDistribution),
      ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
    );

    // 渲染饼图：性别比例
    renderPieChart('genderChart', 'genderChartInstance',
      Object.keys(overview.genderDistribution),
      Object.values(overview.genderDistribution),
      ['#4facfe', '#f5576c']
    );
  }

  if (deptResult && deptResult.ok) {
    const deptData = deptResult.data.data;
    // 渲染柱状图：科室对比
    renderDeptBarChart(deptData);
  }
}

/**
 * 渲染科室对比柱状图
 */
function renderDeptBarChart(deptData) {
  const ctx = document.getElementById('deptBarChart');
  if (!ctx) return;

  // 销毁旧实例，避免重复渲染
  if (deptBarChartInstance) deptBarChartInstance.destroy();

  deptBarChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: deptData.map(d => d.department),
      datasets: [
        {
          label: '患者数量',
          data: deptData.map(d => d.patientsCount),
          backgroundColor: 'rgba(102, 126, 234, 0.7)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 1
        },
        {
          label: '医生数量',
          data: deptData.map(d => d.doctorsCount),
          backgroundColor: 'rgba(240, 147, 251, 0.7)',
          borderColor: 'rgba(240, 147, 251, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

/**
 * 通用饼图渲染函数
 */
function renderPieChart(canvasId, instanceName, labels, data, colors) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  // 销毁旧实例
  if (window[instanceName]) window[instanceName].destroy();

  window[instanceName] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors || [
          '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

/**
 * 通用柱状图渲染函数
 */
function renderBarChart(canvasId, instanceName, labels, data, colors) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (window[instanceName]) window[instanceName].destroy();

  window[instanceName] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '人数',
        data,
        backgroundColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

// ============ 接口测试模块 ============

/**
 * 初始化默认请求头（自动填充Token）
 */
function updateDefaultHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  document.getElementById('apiHeaders').value = JSON.stringify(headers, null, 2);
}

/**
 * 快捷填充接口信息
 * @param {string} method - HTTP方法
 * @param {string} url - 接口路径
 * @param {string} body - 请求体（可选）
 */
function fillApiTest(method, url, body = '') {
  document.getElementById('apiMethod').value = method;
  document.getElementById('apiUrl').value = url;
  if (body) {
    document.getElementById('apiBody').value = body;
  }
  toggleBodyGroup();
  // 清空上次响应
  document.getElementById('apiResponse').textContent = '// 点击"发送请求"查看响应结果';
  document.getElementById('apiStatusCode').textContent = '状态码: -';
  document.getElementById('apiTime').textContent = '耗时: -';
}

/**
 * 根据请求方法控制请求体区域的显示/隐藏
 */
function toggleBodyGroup() {
  const method = document.getElementById('apiMethod').value;
  const bodyGroup = document.getElementById('apiBodyGroup');
  bodyGroup.style.display = (method === 'POST' || method === 'PUT') ? 'block' : 'none';
}

/**
 * 发送接口测试请求
 * 记录请求耗时，格式化显示响应JSON
 */
async function sendApiRequest() {
  const method = document.getElementById('apiMethod').value;
  const url = document.getElementById('apiUrl').value.trim();
  const headersText = document.getElementById('apiHeaders').value.trim();
  const bodyText = document.getElementById('apiBody').value.trim();
  const sendBtn = document.getElementById('apiSendBtn');

  // 参数校验
  if (!url) {
    alert('请输入接口路径');
    return;
  }

  // 解析请求头
  let headers;
  try {
    headers = JSON.parse(headersText || '{}');
  } catch (e) {
    alert('请求头格式错误，请输入有效的JSON');
    return;
  }

  // 构建请求选项
  const fetchOptions = { method, headers };

  // 如果是POST或PUT，添加请求体
  if (method === 'POST' || method === 'PUT') {
    if (bodyText) {
      // 校验JSON格式
      try {
        JSON.parse(bodyText);
        fetchOptions.body = bodyText;
      } catch (e) {
        alert('请求体JSON格式错误');
        return;
      }
    }
  }

  // 按钮显示加载状态
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<span class="loading-spinner"></span>';

  const startTime = Date.now();

  try {
    const response = await fetch(url, fetchOptions);
    const elapsed = Date.now() - startTime;
    const data = await response.json();

    // 更新状态码和耗时
    document.getElementById('apiStatusCode').textContent = `状态码: ${response.status}`;
    document.getElementById('apiTime').textContent = `耗时: ${elapsed}ms`;

    // 状态码着色
    const statusCodeEl = document.getElementById('apiStatusCode');
    statusCodeEl.className = response.ok ? 'badge bg-success' : 'badge bg-danger';

    // 格式化显示响应JSON
    document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    document.getElementById('apiStatusCode').textContent = '状态码: Error';
    document.getElementById('apiTime').textContent = `耗时: ${Date.now() - startTime}ms`;
    document.getElementById('apiStatusCode').className = 'badge bg-danger';
    document.getElementById('apiResponse').textContent = `请求失败: ${error.message}`;
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = '发送请求';
  }
}
