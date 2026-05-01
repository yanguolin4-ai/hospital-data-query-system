/**
 * 模拟用户数据
 * 默认测试账号：admin / 123456
 * 密码字段存储的是 bcryptjs 加密后的哈希值
 */
const bcrypt = require('bcryptjs');

// 预先生成密码哈希，避免每次启动重复计算
const defaultPasswordHash = bcrypt.hashSync('123456', 10);

const users = [
  {
    id: 1,
    username: 'admin',
    password: defaultPasswordHash,
    realName: '系统管理员',
    role: 'admin',
    department: '信息科',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    username: 'doctor_zhang',
    password: defaultPasswordHash,
    realName: '张伟',
    role: 'doctor',
    department: '内科',
    createdAt: '2024-03-15'
  },
  {
    id: 3,
    username: 'nurse_li',
    password: defaultPasswordHash,
    realName: '李芳',
    role: 'nurse',
    department: '外科',
    createdAt: '2024-06-20'
  }
];

module.exports = users;
