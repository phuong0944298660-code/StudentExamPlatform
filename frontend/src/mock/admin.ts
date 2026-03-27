// 管理员端假数据

import type { 
  DashboardStats, 
  AccountItem, 
  ActivationCode, 
  ImportRecord,
  QuestionBank,
  ExamSession,
  ExamPaper
} from '../types'

// 看板统计数据
export const mockDashboardStats: DashboardStats = {
  totalAccounts: 3256,
  todayLogin: 892,
  activeSessions: 3,
  pendingReviews: 156
}

// 账号列表
export const mockAccounts: AccountItem[] = [
  { id: 1, username: 'stu001', realName: '张三', accountType: 'PRACTICE', stage: 'PRIMARY', status: 'ENABLED', createdAt: '2026-03-20 10:00:00', lastLoginAt: '2026-03-27 09:30:00' },
  { id: 2, username: 'stu002', realName: '李四', accountType: 'PRACTICE', stage: 'MIDDLE', status: 'ENABLED', createdAt: '2026-03-20 10:00:00', lastLoginAt: '2026-03-26 15:20:00' },
  { id: 3, username: '450102201201011234', realName: '王五', accountType: 'EXAM', stage: 'PRIMARY', status: 'ENABLED', createdAt: '2026-03-21 09:00:00' },
  { id: 4, username: 'stu004', realName: '赵六', accountType: 'PRACTICE', stage: 'PRIMARY', status: 'LOCKED', createdAt: '2026-03-20 10:00:00' },
  { id: 5, username: 'tch001', realName: '陈老师', accountType: 'STAFF', stage: 'PRIMARY', status: 'ENABLED', createdAt: '2026-03-18 14:00:00', lastLoginAt: '2026-03-27 08:00:00' },
  { id: 6, username: 'tch002', realName: '刘老师', accountType: 'STAFF', stage: 'MIDDLE', status: 'ENABLED', createdAt: '2026-03-18 14:00:00', lastLoginAt: '2026-03-27 08:30:00' },
  { id: 7, username: '450102201101021456', realName: '孙七', accountType: 'EXAM', stage: 'MIDDLE', status: 'DISABLED', createdAt: '2026-03-21 09:00:00' },
  { id: 8, username: 'stu008', realName: '周八', accountType: 'PRACTICE', stage: 'MIDDLE', status: 'ENABLED', createdAt: '2026-03-20 10:00:00', lastLoginAt: '2026-03-25 16:45:00' },
]

// 激活码列表
export const mockActivationCodes: ActivationCode[] = [
  { id: 1, code: 'ACT-2026-001-XYZA', stage: 'PRIMARY', targetRole: 'STUDENT', validFrom: '2026-03-01 00:00:00', validTo: '2026-06-01 23:59:59', status: 'ACTIVE' },
  { id: 2, code: 'ACT-2026-002-XYZB', stage: 'MIDDLE', targetRole: 'STUDENT', validFrom: '2026-03-01 00:00:00', validTo: '2026-06-01 23:59:59', status: 'ACTIVE' },
  { id: 3, code: 'ACT-2026-003-XYZC', stage: 'PRIMARY', targetRole: 'TEACHER', validFrom: '2026-03-01 00:00:00', validTo: '2026-09-01 23:59:59', status: 'USED', usedBy: '陈老师', usedAt: '2026-03-18 14:30:00' },
  { id: 4, code: 'ACT-2026-004-XYZD', stage: 'MIDDLE', targetRole: 'TEACHER', validFrom: '2026-03-01 00:00:00', validTo: '2026-09-01 23:59:59', status: 'USED', usedBy: '刘老师', usedAt: '2026-03-18 14:35:00' },
  { id: 5, code: 'ACT-2026-005-XYZE', stage: 'PRIMARY', targetRole: 'STUDENT', validFrom: '2026-04-01 00:00:00', validTo: '2026-07-01 23:59:59', status: 'NOT_EFFECTIVE' },
  { id: 6, code: 'ACT-2026-006-XYZF', stage: 'MIDDLE', targetRole: 'STUDENT', validFrom: '2026-02-01 00:00:00', validTo: '2026-03-01 23:59:59', status: 'EXPIRED' },
]

// 导入记录
export const mockImportRecords: ImportRecord[] = [
  { id: 1, batchNo: 'IMP-20260327-001', fileName: '小学组参赛名单.xlsx', importType: 'STUDENT', totalCount: 500, successCount: 498, failCount: 2, status: 'COMPLETED', createdAt: '2026-03-27 09:00:00' },
  { id: 2, batchNo: 'IMP-20260327-002', fileName: '初中组参赛名单.xlsx', importType: 'STUDENT', totalCount: 450, successCount: 450, failCount: 0, status: 'COMPLETED', createdAt: '2026-03-27 09:30:00' },
  { id: 3, batchNo: 'IMP-20260326-001', fileName: '指导教师名单.xlsx', importType: 'TEACHER', totalCount: 50, successCount: 48, failCount: 2, status: 'COMPLETED', createdAt: '2026-03-26 14:00:00' },
  { id: 4, batchNo: 'IMP-20260325-001', fileName: '补充名单.xlsx', importType: 'STUDENT', totalCount: 30, successCount: 0, failCount: 0, status: 'PROCESSING', createdAt: '2026-03-25 10:00:00' },
]

// 题库列表
export const mockQuestionBanks: QuestionBank[] = [
  { id: 1, bankName: '小学组初赛题库', stage: 'PRIMARY', suiteNo: 1, status: 'PUBLISHED', questionCount: 200, createdAt: '2026-03-15 10:00:00' },
  { id: 2, bankName: '小学组决赛题库', stage: 'PRIMARY', suiteNo: 2, status: 'PUBLISHED', questionCount: 150, createdAt: '2026-03-15 11:00:00' },
  { id: 3, bankName: '初中组初赛题库', stage: 'MIDDLE', suiteNo: 1, status: 'PUBLISHED', questionCount: 250, createdAt: '2026-03-16 09:00:00' },
  { id: 4, bankName: '初中组决赛题库', stage: 'MIDDLE', suiteNo: 2, status: 'DRAFT', questionCount: 180, createdAt: '2026-03-16 10:00:00' },
  { id: 5, bankName: '小学组练习题库', stage: 'PRIMARY', suiteNo: 3, status: 'PUBLISHED', questionCount: 500, createdAt: '2026-03-10 08:00:00' },
]

// 考试场次
export const mockExamSessions: ExamSession[] = [
  { id: 1, sessionName: '2026年小学组初赛', stage: 'PRIMARY', startTime: '2026-04-01 09:00:00', endTime: '2026-04-01 10:30:00', durationMinutes: 90, status: 'PENDING', candidateCount: 500, submittedCount: 0 },
  { id: 2, sessionName: '2026年初中组初赛', stage: 'MIDDLE', startTime: '2026-04-01 14:00:00', endTime: '2026-04-01 15:30:00', durationMinutes: 90, status: 'PENDING', candidateCount: 450, submittedCount: 0 },
  { id: 3, sessionName: '2026年小学组模拟赛', stage: 'PRIMARY', startTime: '2026-03-25 09:00:00', endTime: '2026-03-25 10:00:00', durationMinutes: 60, status: 'FINISHED', candidateCount: 300, submittedCount: 298 },
  { id: 4, sessionName: '2026年初中组模拟赛', stage: 'MIDDLE', startTime: '2026-03-25 14:00:00', endTime: '2026-03-25 15:00:00', durationMinutes: 60, status: 'OPEN', candidateCount: 280, submittedCount: 150 },
]

// 试卷/组卷
export const mockExamPapers: ExamPaper[] = [
  { id: 1, paperName: '小学组初赛A卷', stage: 'PRIMARY', questionCount: 50, totalScore: 100, subjectiveMode: 'UPLOAD', status: 'PUBLISHED', createdAt: '2026-03-20 10:00:00' },
  { id: 2, paperName: '初中组初赛A卷', stage: 'MIDDLE', questionCount: 60, totalScore: 120, subjectiveMode: 'RICHTEXT', status: 'PUBLISHED', createdAt: '2026-03-20 11:00:00' },
  { id: 3, paperName: '小学组模拟卷', stage: 'PRIMARY', questionCount: 40, totalScore: 100, subjectiveMode: 'UPLOAD', status: 'PUBLISHED', createdAt: '2026-03-18 09:00:00' },
  { id: 4, paperName: '初中组模拟卷', stage: 'MIDDLE', questionCount: 50, totalScore: 100, subjectiveMode: 'RICHTEXT', status: 'DRAFT', createdAt: '2026-03-19 10:00:00' },
]

// 最近活动
export const mockRecentActivities = [
  { id: 1, content: '创建了新的考试场次：2026年小学组初赛', time: '10分钟前', type: 'session' },
  { id: 2, content: '导入了500条学生名单', time: '30分钟前', type: 'import' },
  { id: 3, content: '发布了小学组初赛A卷', time: '1小时前', type: 'paper' },
  { id: 4, content: '生成了100个激活码', time: '2小时前', type: 'activation' },
  { id: 5, content: '陈老师完成了阅卷任务', time: '3小时前', type: 'review' },
]

// 待办任务
export const mockTodoList = [
  { id: 1, title: '审核初中组决赛试卷', priority: 'high', deadline: '2026-03-28', status: 'pending' },
  { id: 2, title: '配置成绩公布时间', priority: 'high', deadline: '2026-03-29', status: 'pending' },
  { id: 3, title: '处理2个复查申请', priority: 'medium', deadline: '2026-03-30', status: 'pending' },
  { id: 4, title: '导出模拟赛成绩', priority: 'low', deadline: '2026-04-01', status: 'pending' },
]
