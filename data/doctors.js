/**
 * 模拟医生数据
 * 包含8位医生的详细信息与排班
 */
const doctors = [
  {
    id: 1,
    name: '张伟',
    gender: '男',
    age: 48,
    department: '内科',
    title: '主任医师',
    specialty: '心血管内科、高血压、冠心病',
    phone: '13800000001',
    schedule: {
      monday: '上午',
      tuesday: '全天',
      wednesday: '上午',
      thursday: '休息',
      friday: '全天',
      saturday: '上午',
      sunday: '休息'
    },
    introduction: '从事内科临床工作25年，擅长心血管系统疾病的诊治，发表论文10余篇。'
  },
  {
    id: 2,
    name: '王明',
    gender: '男',
    age: 42,
    department: '外科',
    title: '副主任医师',
    specialty: '普外科、腹腔镜微创手术',
    phone: '13800000002',
    schedule: {
      monday: '全天',
      tuesday: '上午',
      wednesday: '休息',
      thursday: '全天',
      friday: '上午',
      saturday: '休息',
      sunday: '休息'
    },
    introduction: '擅长腹腔镜下胆囊切除、阑尾切除等微创手术，手术经验丰富。'
  },
  {
    id: 3,
    name: '刘芳',
    gender: '女',
    age: 38,
    department: '儿科',
    title: '副主任医师',
    specialty: '小儿呼吸系统疾病、新生儿疾病',
    phone: '13800000003',
    schedule: {
      monday: '上午',
      tuesday: '全天',
      wednesday: '全天',
      thursday: '上午',
      friday: '休息',
      saturday: '全天',
      sunday: '休息'
    },
    introduction: '儿科专业15年，对儿童呼吸道感染、肺炎等疾病有丰富诊疗经验。'
  },
  {
    id: 4,
    name: '赵敏',
    gender: '女',
    age: 45,
    department: '妇科',
    title: '主任医师',
    specialty: '妇科肿瘤、宫腔镜手术',
    phone: '13800000004',
    schedule: {
      monday: '全天',
      tuesday: '休息',
      wednesday: '全天',
      thursday: '上午',
      friday: '全天',
      saturday: '休息',
      sunday: '上午'
    },
    introduction: '妇科领域知名专家，擅长子宫肌瘤、卵巢囊肿等疾病的微创治疗。'
  },
  {
    id: 5,
    name: '陈刚',
    gender: '男',
    age: 52,
    department: '急诊科',
    title: '主任医师',
    specialty: '急危重症、急性心梗、创伤急救',
    phone: '13800000005',
    schedule: {
      monday: '全天',
      tuesday: '全天',
      wednesday: '全天',
      thursday: '休息',
      friday: '全天',
      saturday: '全天',
      sunday: '休息'
    },
    introduction: '急诊科主任，从事急危重症救治工作20年，挽救无数生命。'
  },
  {
    id: 6,
    name: '杨丽',
    gender: '女',
    age: 35,
    department: '内科',
    title: '主治医师',
    specialty: '消化内科、胃肠镜检查',
    phone: '13800000006',
    schedule: {
      monday: '休息',
      tuesday: '全天',
      wednesday: '上午',
      thursday: '全天',
      friday: '上午',
      saturday: '休息',
      sunday: '全天'
    },
    introduction: '消化内科骨干医师，熟练掌握胃肠镜检查及内镜下治疗技术。'
  },
  {
    id: 7,
    name: '周强',
    gender: '男',
    age: 40,
    department: '外科',
    title: '主治医师',
    specialty: '骨科、关节置换',
    phone: '13800000007',
    schedule: {
      monday: '上午',
      tuesday: '休息',
      wednesday: '全天',
      thursday: '全天',
      friday: '休息',
      saturday: '全天',
      sunday: '上午'
    },
    introduction: '骨科专业医师，擅长髋膝关节置换手术及运动损伤治疗。'
  },
  {
    id: 8,
    name: '孙婷',
    gender: '女',
    age: 32,
    department: '急诊科',
    title: '主治医师',
    specialty: '急诊内科、中毒救治',
    phone: '13800000008',
    schedule: {
      monday: '全天',
      tuesday: '全天',
      wednesday: '休息',
      thursday: '全天',
      friday: '全天',
      saturday: '休息',
      sunday: '全天'
    },
    introduction: '急诊科青年骨干，擅长急性中毒、内科急症的快速诊断与处理。'
  }
];

module.exports = doctors;
