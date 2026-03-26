import { ref } from 'vue'
import type {
  ActivationCodeItem,
  AlertItem,
  EnrollmentItem,
  ExamSessionItem,
  ExportTaskItem,
  FeedbackItem,
  MetricItem,
  OperationLogItem,
  PracticePolicyItem,
  QuestionBankItem,
  ResourceItem,
  ReviewProgressItem,
  ScoreRecordItem,
  SystemSettingItem,
  UserItem,
} from '../types/admin'

// 使用模块级状态模拟后端数据，方便多页面共享和验收联动。
const metrics = ref<MetricItem[]>([
  {
    id: 'today-plan',
    title: '今日预计考试人数',
    value: 1280,
    unit: '人',
    compareText: '较昨日 +8.4%',
    trend: 'up',
    definition: '当日所有已排考试场次应考人数总和。',
  },
  {
    id: 'online-now',
    title: '当前考试登录人数',
    value: 736,
    unit: '人',
    compareText: '较 10 分钟前 +56',
    trend: 'up',
    definition: '当前进行中场次内，考试账号去重登录数。',
  },
  {
    id: 'review-progress',
    title: '评卷中试卷',
    value: 329,
    unit: '份',
    compareText: '较昨日 -11.2%',
    trend: 'down',
    definition: '已交卷但主观题尚未完成全部评卷的试卷数量。',
  },
  {
    id: 'sync-fail',
    title: '成绩同步失败重试',
    value: 6,
    unit: '次',
    compareText: '较昨日 +2',
    trend: 'up',
    definition: '成绩同步接口失败后触发重试的累计次数。',
  },
])

const users = ref<UserItem[]>([
  { id: 1, name: '张海峰', username: 'admin_zhang', role: 'ADMIN', school: '海淀实验中学', lastLoginAt: '2026-03-26 20:12:18', status: 'ENABLED' },
  { id: 2, name: '李晨', username: 'contest_li', role: 'CONTEST_ADMIN', school: '朝阳一中', lastLoginAt: '2026-03-26 19:58:02', status: 'ENABLED' },
  { id: 3, name: '王芳', username: 'teacher_wang', role: 'TEACHER', school: '海淀实验中学', lastLoginAt: '2026-03-26 18:21:55', status: 'DISABLED' },
  { id: 4, name: '赵敏', username: 'reviewer_zhao', role: 'REVIEWER', school: '东城外国语', lastLoginAt: '2026-03-26 20:01:41', status: 'ENABLED' },
  { id: 5, name: '宋涛', username: 'parent_song', role: 'PARENT', school: '西城二中', lastLoginAt: '2026-03-25 17:39:26', status: 'ENABLED' },
])

const practicePolicies = ref<PracticePolicyItem[]>([
  { id: 1, name: '春季练习包 90 天', price: 199, durationDays: 90, validFrom: '2026-03-01', validTo: '2026-05-30', status: 'ACTIVE' },
  { id: 2, name: '冲刺练习包 30 天', price: 99, durationDays: 30, validFrom: '2026-03-20', validTo: '2026-04-19', status: 'ACTIVE' },
  { id: 3, name: '常规训练年包', price: 599, durationDays: 365, validFrom: '2026-01-01', validTo: '2026-12-31', status: 'INACTIVE' },
])

const activationCodes = ref<ActivationCodeItem[]>([
  { id: 1, code: 'STU-7M2A-4Q8X', targetType: 'STUDENT', scope: 'QUESTION_BANK', validFrom: '2026-03-26 00:00:00', validTo: '2026-04-30 23:59:59', status: 'UNUSED', createdBy: '超管' },
  { id: 2, code: 'TEA-9N6P-1Z5K', targetType: 'TEACHER', scope: 'QUESTION_BANK_AND_TRAINING', validFrom: '2026-03-20 00:00:00', validTo: '2026-05-20 23:59:59', status: 'USED', createdBy: '超管' },
])

const enrollments = ref<EnrollmentItem[]>([
  { id: 1, area: '北京市海淀区', projectName: '信息学挑战赛', groupName: '初中组', studentName: '刘子轩', idCard: '110108201012010021', school: '海淀实验中学', teacherName: '王芳', contact: '13900001111', status: 'VALID' },
  { id: 2, area: '北京市朝阳区', projectName: '信息学挑战赛', groupName: '小学组', studentName: '陈雨晴', idCard: '110105201404123520', school: '朝阳一小', teacherName: '赵明', contact: '13800002222', status: 'PENDING' },
  { id: 3, area: '北京市东城区', projectName: '算法思维赛', groupName: '初中组', studentName: '杨浩', idCard: '11010120110506171X', school: '东城外国语', teacherName: '李梅', contact: '13700003333', status: 'INVALID' },
])

const questionBanks = ref<QuestionBankItem[]>([
  { id: 1, name: '2026 春季模拟卷 A', stage: 'MIDDLE', suiteNo: 1, questionCount: 42, subjectiveCount: 8, status: 'PUBLISHED', updatedAt: '2026-03-25 18:00:00' },
  { id: 2, name: '2026 小学提升卷 B', stage: 'PRIMARY', suiteNo: 2, questionCount: 35, subjectiveCount: 6, status: 'DRAFT', updatedAt: '2026-03-24 20:30:00' },
  { id: 3, name: '竞赛训练卷 C', stage: 'MIDDLE', suiteNo: 3, questionCount: 50, subjectiveCount: 10, status: 'PUBLISHED', updatedAt: '2026-03-23 16:10:00' },
])

const examSessions = ref<ExamSessionItem[]>([
  { id: 1, examName: '初三数学阶段测评（A 卷）', school: '海淀实验中学', onlineCount: 182, submitCount: 96, totalCount: 220, riskLevel: 'LOW', scorePublish: false, extraMinutes: 0, status: 'RUNNING' },
  { id: 2, examName: '高一英语词汇竞赛', school: '东城外国语', onlineCount: 134, submitCount: 48, totalCount: 160, riskLevel: 'MEDIUM', scorePublish: false, extraMinutes: 10, status: 'RUNNING' },
  { id: 3, examName: '八年级物理单元练习', school: '朝阳一中', onlineCount: 0, submitCount: 210, totalCount: 210, riskLevel: 'LOW', scorePublish: true, extraMinutes: 0, status: 'FINISHED' },
])

const resources = ref<ResourceItem[]>([
  { id: 1, categoryPath: '竞赛资源 2026 / 初中组 / 第 1 套 / 试题', fileName: '初中组-第1套-试题讲解.pptx', fileType: 'PPT', stage: 'MIDDLE', updatedAt: '2026-03-26 16:22:00' },
  { id: 2, categoryPath: '竞赛资源 2026 / 小学组 / 第 3 套 / 视频', fileName: '小学组-视频讲解.mp4', fileType: 'VIDEO', stage: 'PRIMARY', updatedAt: '2026-03-25 21:43:00' },
  { id: 3, categoryPath: '竞赛资源 2026 / 初中组 / 第 2 套 / 代码包', fileName: '算法样例代码.zip', fileType: 'ZIP', stage: 'MIDDLE', updatedAt: '2026-03-25 14:04:00' },
])

const reviewProgress = ref<ReviewProgressItem[]>([
  { id: 1, sessionName: '初三数学阶段测评（A 卷）', pendingCount: 52, reviewingCount: 80, finishedCount: 88, syncStatus: 'PENDING' },
  { id: 2, sessionName: '高一英语词汇竞赛', pendingCount: 73, reviewingCount: 43, finishedCount: 44, syncStatus: 'FAILED' },
  { id: 3, sessionName: '八年级物理单元练习', pendingCount: 0, reviewingCount: 0, finishedCount: 210, syncStatus: 'SYNCED' },
])

const scoreRecords = ref<ScoreRecordItem[]>([
  { id: 1, studentName: '刘子轩', idCard: '110108201012010021', stage: 'MIDDLE', sessionName: '初三数学阶段测评（A 卷）', objectiveScore: 62, subjectiveScore: 24, totalScore: 86, submitTime: '2026-03-26 19:12:18' },
  { id: 2, studentName: '陈雨晴', idCard: '110105201404123520', stage: 'PRIMARY', sessionName: '小学组提升测评', objectiveScore: 58, subjectiveScore: 31, totalScore: 89, submitTime: '2026-03-26 18:54:10' },
  { id: 3, studentName: '杨浩', idCard: '11010120110506171X', stage: 'MIDDLE', sessionName: '高一英语词汇竞赛', objectiveScore: 71, subjectiveScore: 20, totalScore: 91, submitTime: '2026-03-26 19:05:06' },
])

const exportTasks = ref<ExportTaskItem[]>([
  { id: 1, fileName: '成绩导出_初中组_20260326.xlsx', status: 'SUCCESS', createdAt: '2026-03-26 20:33:40' },
  { id: 2, fileName: '成绩导出_小学组_20260325.xlsx', status: 'SUCCESS', createdAt: '2026-03-25 18:22:10' },
])

const systemSettings = ref<SystemSettingItem[]>([
  {
    key: 'scorePublishStrategy',
    title: '成绩发布策略',
    description: '控制考试成绩统一发布时间。',
    value: 'MANUAL',
    type: 'select',
    options: [
      { label: '人工发布', value: 'MANUAL' },
      { label: '评卷完成自动发布', value: 'AUTO' },
    ],
  },
  { key: 'uploadLimitMb', title: '附件上传大小上限', description: '主观题附件上传单文件大小限制（MB）。', value: 20, type: 'number' },
  { key: 'riskDetectionEnabled', title: '风险行为检测', description: '识别异常登录与高频切屏。', value: true, type: 'switch' },
  { key: 'allowRetakeForPractice', title: '练习题库多次提交', description: '允许同一练习多次提交。', value: true, type: 'switch' },
])

const alerts = ref<AlertItem[]>([
  { id: 1, level: 'DANGER', title: '高风险网络抖动', content: '高一英语词汇竞赛出现 12 次提交重试，请关注考场网络。', createdAt: '2026-03-26 20:35:01' },
  { id: 2, level: 'WARN', title: '评卷任务堆积', content: '海淀实验中学主观题待评卷超 200 份，建议增加评卷老师。', createdAt: '2026-03-26 20:24:18' },
  { id: 3, level: 'INFO', title: '系统通知', content: '今晚 23:30 开始例行巡检，不影响进行中的考试。', createdAt: '2026-03-26 19:50:47' },
])

const feedbacks = ref<FeedbackItem[]>([
  { id: 1, title: '批量导入错误定位优化', content: '建议在导入错误提示中增加字段名和示例值。', status: 'OPEN', createdAt: '2026-03-26 17:20:10' },
  { id: 2, title: '主观题上传进度可视化', content: '上传大文件时希望显示进度条。', status: 'IN_PROGRESS', createdAt: '2026-03-25 15:11:58' },
  { id: 3, title: '评卷界面快捷键', content: '建议增加评分快捷键提高效率。', status: 'DONE', createdAt: '2026-03-24 21:09:07' },
])

const reviewRule = ref({ reviewerCount: 3, aggregateAlgo: 'AVG' as 'AVG' | 'MEDIAN' })

const operationLogs = ref<OperationLogItem[]>([
  { id: 1, action: '发布开关变更', detail: '将“八年级物理单元练习”成绩发布设置为开启。', operator: '超管', createdAt: '2026-03-26 19:56:12' },
  { id: 2, action: '激活码生成', detail: '新增教师激活码 30 个，有效期 60 天。', operator: '超管', createdAt: '2026-03-26 18:43:09' },
])

let logSeed = 100
let codeSeed = 300
let policySeed = 1000
let enrollmentSeed = 2000
let bankSeed = 3000
let exportSeed = 4000
let feedbackSeed = 5000

const formatNow = () => {
  const now = new Date()
  const pad = (value: number) => `${value}`.padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const addLog = (action: string, detail: string) => {
  operationLogs.value.unshift({
    id: logSeed++,
    action,
    detail,
    operator: '超管',
    createdAt: formatNow(),
  })
}

const randomCode = (prefix: string) => {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const createBlock = () =>
    Array.from({ length: 4 })
      .map(() => charset[Math.floor(Math.random() * charset.length)])
      .join('')
  return `${prefix}-${createBlock()}-${createBlock()}`
}

export const useSuperAdminMockData = () => {
  const refreshMetrics = () => {
    const drift = Math.floor(Math.random() * 31) - 10
    metrics.value = metrics.value.map((item) => {
      if (item.id === 'online-now') {
        return { ...item, value: Math.max(0, item.value + drift), compareText: `较 10 分钟前 ${drift >= 0 ? '+' : ''}${drift}` }
      }
      return item
    })
    addLog('刷新看板', '手动刷新超管看板指标。')
  }

  const toggleUserStatus = (id: number) => {
    users.value = users.value.map((item) => {
      if (item.id !== id) return item
      const nextStatus = item.status === 'ENABLED' ? 'DISABLED' : 'ENABLED'
      addLog('用户状态变更', `将用户 ${item.name} 设置为 ${nextStatus === 'ENABLED' ? '启用' : '禁用'}。`)
      return { ...item, status: nextStatus }
    })
  }

  const resetUserPassword = (id: number) => {
    const user = users.value.find((item) => item.id === id)
    if (!user) return
    addLog('用户密码重置', `已为用户 ${user.name} 重置密码（模拟操作）。`)
  }

  const addPracticePolicy = (payload: { name: string; price: number; durationDays: number }) => {
    const item: PracticePolicyItem = {
      id: policySeed++,
      name: payload.name,
      price: payload.price,
      durationDays: payload.durationDays,
      validFrom: formatNow().slice(0, 10),
      validTo: formatNow().slice(0, 10),
      status: 'ACTIVE',
    }
    practicePolicies.value.unshift(item)
    addLog('练习账号策略新增', `新增策略 ${item.name}，时长 ${item.durationDays} 天。`)
  }

  const togglePracticePolicyStatus = (id: number) => {
    practicePolicies.value = practicePolicies.value.map((item) => {
      if (item.id !== id) return item
      const next = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      addLog('练习账号策略状态变更', `${item.name} 状态变更为 ${next}。`)
      return { ...item, status: next }
    })
  }

  const generateActivationCode = (payload: { targetType: 'STUDENT' | 'TEACHER'; days: number }) => {
    const prefix = payload.targetType === 'STUDENT' ? 'STU' : 'TEA'
    const now = new Date()
    const end = new Date(now.getTime() + payload.days * 24 * 60 * 60 * 1000)
    const toTime = (time: Date) => {
      const pad = (value: number) => `${value}`.padStart(2, '0')
      return `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())} ${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
    }

    const item: ActivationCodeItem = {
      id: codeSeed++,
      code: randomCode(prefix),
      targetType: payload.targetType,
      scope: payload.targetType === 'STUDENT' ? 'QUESTION_BANK' : 'QUESTION_BANK_AND_TRAINING',
      validFrom: toTime(now),
      validTo: toTime(end),
      status: 'UNUSED',
      createdBy: '超管',
    }

    activationCodes.value.unshift(item)
    addLog('激活码生成', `新增 ${payload.targetType === 'STUDENT' ? '学生' : '教师'}激活码：${item.code}。`)
  }

  const simulateEnrollmentImport = () => {
    const demo: EnrollmentItem = {
      id: enrollmentSeed++,
      area: '北京市西城区',
      projectName: '算法思维赛',
      groupName: Math.random() > 0.5 ? '小学组' : '初中组',
      studentName: `测试学生${Math.floor(Math.random() * 90 + 10)}`,
      idCard: `11010220120${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      school: '西城实验学校',
      teacherName: '刘老师',
      contact: '13600004444',
      status: 'PENDING',
    }
    enrollments.value.unshift(demo)
    addLog('报名名单导入', `新增导入记录 ${demo.studentName}。`)
  }

  const addQuestionBank = (payload: { name: string; stage: 'PRIMARY' | 'MIDDLE' }) => {
    const suiteNo = questionBanks.value.length + 1
    questionBanks.value.unshift({
      id: bankSeed++,
      name: payload.name,
      stage: payload.stage,
      suiteNo,
      questionCount: 0,
      subjectiveCount: 0,
      status: 'DRAFT',
      updatedAt: formatNow(),
    })
    addLog('题库新增', `新增题库 ${payload.name}。`)
  }

  const toggleQuestionBankStatus = (id: number) => {
    questionBanks.value = questionBanks.value.map((item) => {
      if (item.id !== id) return item
      const next = item.status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT'
      addLog('题库状态更新', `${item.name} 状态设置为 ${next}。`)
      return { ...item, status: next, updatedAt: formatNow() }
    })
  }

  const toggleSessionStatus = (examId: number) => {
    examSessions.value = examSessions.value.map((item) => {
      if (item.id !== examId) return item
      const next = item.status === 'READY' ? 'RUNNING' : item.status === 'RUNNING' ? 'FINISHED' : 'READY'
      addLog('场次状态变更', `${item.examName} 状态变更为 ${next}。`)
      return { ...item, status: next }
    })
  }

  const toggleScorePublish = (examId: number) => {
    examSessions.value = examSessions.value.map((item) => {
      if (item.id !== examId) return item
      const next = !item.scorePublish
      addLog('成绩发布开关', `${item.examName} 成绩发布设置为 ${next ? '开启' : '关闭'}。`)
      return { ...item, scorePublish: next }
    })
  }

  const extendExamDuration = (examId: number, minutes: number) => {
    examSessions.value = examSessions.value.map((item) => {
      if (item.id !== examId) return item
      addLog('考试时长延长', `${item.examName} 延长 ${minutes} 分钟。`)
      return { ...item, extraMinutes: item.extraMinutes + minutes }
    })
  }

  const previewResource = (resourceId: number) => {
    const resource = resources.value.find((item) => item.id === resourceId)
    if (!resource) return
    addLog('资源预览', `预览资源 ${resource.fileName}。`)
  }

  const resolveAlert = (alertId: number) => {
    const target = alerts.value.find((item) => item.id === alertId)
    alerts.value = alerts.value.filter((item) => item.id !== alertId)
    if (target) {
      addLog('告警处理', `已处理告警：${target.title}。`)
    }
  }

  const setReviewRule = (payload: { reviewerCount: number; aggregateAlgo: 'AVG' | 'MEDIAN' }) => {
    reviewRule.value = { ...payload }
    addLog('评分规则更新', `评分人数 ${payload.reviewerCount}，算法 ${payload.aggregateAlgo}。`)
  }

  const triggerScoreSync = (progressId: number) => {
    reviewProgress.value = reviewProgress.value.map((item) => {
      if (item.id !== progressId) return item
      addLog('成绩同步重试', `${item.sessionName} 执行成绩同步重试。`)
      return { ...item, syncStatus: 'SYNCED' }
    })
  }

  const createExportTask = (stage: 'PRIMARY' | 'MIDDLE') => {
    const fileName = `成绩导出_${stage === 'PRIMARY' ? '小学组' : '初中组'}_${formatNow().replace(/[-:\s]/g, '')}.xlsx`
    exportTasks.value.unshift({
      id: exportSeed++,
      fileName,
      status: 'SUCCESS',
      createdAt: formatNow(),
    })
    addLog('成绩导出', `发起导出任务 ${fileName}。`)
  }

  const updateSetting = (key: string, value: boolean | number | string) => {
    systemSettings.value = systemSettings.value.map((item) => {
      if (item.key !== key) return item
      return { ...item, value }
    })
  }

  const saveSettings = () => {
    addLog('系统配置保存', '超管保存了系统配置（模拟）。')
  }

  const submitFeedback = (payload: { title: string; content: string }) => {
    feedbacks.value.unshift({
      id: feedbackSeed++,
      title: payload.title,
      content: payload.content,
      status: 'OPEN',
      createdAt: formatNow(),
    })
    addLog('优化反馈提交', `提交反馈：${payload.title}。`)
  }

  const advanceFeedbackStatus = (id: number) => {
    feedbacks.value = feedbacks.value.map((item) => {
      if (item.id !== id) return item
      const next = item.status === 'OPEN' ? 'IN_PROGRESS' : item.status === 'IN_PROGRESS' ? 'DONE' : 'DONE'
      addLog('反馈状态更新', `${item.title} 更新为 ${next}。`)
      return { ...item, status: next }
    })
  }

  return {
    metrics,
    users,
    practicePolicies,
    activationCodes,
    enrollments,
    questionBanks,
    examSessions,
    resources,
    reviewRule,
    reviewProgress,
    scoreRecords,
    exportTasks,
    systemSettings,
    alerts,
    feedbacks,
    operationLogs,
    refreshMetrics,
    toggleUserStatus,
    resetUserPassword,
    addPracticePolicy,
    togglePracticePolicyStatus,
    generateActivationCode,
    simulateEnrollmentImport,
    addQuestionBank,
    toggleQuestionBankStatus,
    toggleSessionStatus,
    toggleScorePublish,
    extendExamDuration,
    previewResource,
    resolveAlert,
    setReviewRule,
    triggerScoreSync,
    createExportTask,
    updateSetting,
    saveSettings,
    submitFeedback,
    advanceFeedbackStatus,
  }
}
