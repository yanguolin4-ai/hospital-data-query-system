/**
 * 模拟科室数据
 * 包含医院主要科室信息
 */
const departments = [
  {
    id: 1,
    name: '内科',
    description: '负责心血管、呼吸、消化、内分泌等系统疾病的诊治',
    location: '住院楼3层',
    phone: '010-88880001',
    headDoctor: '张伟'
  },
  {
    id: 2,
    name: '外科',
    description: '负责普外科、骨科、泌尿外科等手术治疗',
    location: '住院楼2层',
    phone: '010-88880002',
    headDoctor: '王明'
  },
  {
    id: 3,
    name: '儿科',
    description: '负责新生儿及儿童各类疾病的诊治',
    location: '住院楼4层',
    phone: '010-88880003',
    headDoctor: '刘芳'
  },
  {
    id: 4,
    name: '妇科',
    description: '负责妇科疾病、产科、生殖健康等诊疗',
    location: '住院楼5层',
    phone: '010-88880004',
    headDoctor: '赵敏'
  },
  {
    id: 5,
    name: '急诊科',
    description: '负责急危重症的24小时紧急救治',
    location: '急诊楼1层',
    phone: '010-88880005',
    headDoctor: '陈刚'
  }
];

module.exports = departments;
