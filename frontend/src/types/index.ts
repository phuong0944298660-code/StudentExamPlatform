// 全局类型定义

// 学段类型
export type Stage = 'PRIMARY' | 'MIDDLE'

// 账号类型
export type AccountType = 'PRACTICE' | 'EXAM' | 'STAFF'

// 账号状态
export type AccountStatus = 'ENABLED' | 'DISABLED' | 'LOCKED'

// 激活码状态
export type ActivationCodeStatus = 'NOT_EFFECTIVE' | 'ACTIVE' | 'USED' | 'EXPIRED'

// 考试场次状态
export type SessionStatus = 'DRAFT' | 'PENDING' | 'OPEN' | 'CLOSED' | 'FINISHED'

// 用户接口
export interface User {
  id: number
  username: string
  realName: string
  idCardNo?: string
  mobile?: string
  accountType: AccountType
  stage?: Stage
  status: AccountStatus
  lastLoginAt?: string
  createdAt: string
}

// 账号列表项
export interface AccountItem {
  id: number
  username: string
  realName: string
  accountType: AccountType
  stage: Stage
  status: AccountStatus
  createdAt: string
  lastLoginAt?: string
}

// 激活码
export interface ActivationCode {
  id: number
  code: string
  stage: Stage
  targetRole: 'TEACHER' | 'STUDENT'
  validFrom: string
  validTo: string
  status: ActivationCodeStatus
  usedBy?: string
  usedAt?: string
}

// 导入记录
export interface ImportRecord {
  id: number
  batchNo: string
  fileName: string
  importType: 'STUDENT' | 'TEACHER'
  totalCount: number
  successCount: number
  failCount: number
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
}

// 题库目录
export interface QuestionBank {
  id: number
  bankName: string
  stage: Stage
  suiteNo: number
  status: 'DRAFT' | 'PUBLISHED'
  questionCount: number
  createdAt: string
}

// 考试场次
export interface ExamSession {
  id: number
  sessionName: string
  stage: Stage
  startTime: string
  endTime: string
  durationMinutes: number
  status: SessionStatus
  candidateCount: number
  submittedCount: number
}

// 试卷/组卷
export interface ExamPaper {
  id: number
  paperName: string
  stage: Stage
  questionCount: number
  totalScore: number
  subjectiveMode: 'UPLOAD' | 'RICHTEXT'
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: string
}

// 菜单项
export interface MenuItem {
  title: string
  path: string
  icon?: string
  children?: MenuItem[]
}

// 统计数据
export interface DashboardStats {
  totalAccounts: number
  todayLogin: number
  activeSessions: number
  pendingReviews: number
}
