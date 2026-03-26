export type Trend = 'up' | 'down'

export interface MetricItem {
  id: string
  title: string
  value: number
  unit?: string
  compareText: string
  trend: Trend
  definition: string
}

export type UserStatus = 'ENABLED' | 'DISABLED'

export interface UserItem {
  id: number
  name: string
  username: string
  role: 'ADMIN' | 'CONTEST_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'REVIEWER'
  school: string
  lastLoginAt: string
  status: UserStatus
}

export type CodeStatus = 'UNUSED' | 'USED' | 'EXPIRED'

export interface ActivationCodeItem {
  id: number
  code: string
  targetType: 'STUDENT' | 'TEACHER'
  scope: 'QUESTION_BANK' | 'QUESTION_BANK_AND_TRAINING'
  validFrom: string
  validTo: string
  status: CodeStatus
  createdBy: string
}

export interface ExamSessionItem {
  id: number
  examName: string
  school: string
  onlineCount: number
  submitCount: number
  totalCount: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  scorePublish: boolean
  extraMinutes: number
  status: 'READY' | 'RUNNING' | 'FINISHED'
}

export interface SystemSettingItem {
  key: string
  title: string
  description: string
  value: boolean | string | number
  type: 'switch' | 'select' | 'number'
  options?: Array<{ label: string; value: string }>
}

export interface AlertItem {
  id: number
  level: 'INFO' | 'WARN' | 'DANGER'
  title: string
  content: string
  createdAt: string
}

export interface OperationLogItem {
  id: number
  action: string
  detail: string
  operator: string
  createdAt: string
}

export interface PracticePolicyItem {
  id: number
  name: string
  price: number
  durationDays: number
  validFrom: string
  validTo: string
  status: 'ACTIVE' | 'INACTIVE'
}

export interface EnrollmentItem {
  id: number
  area: string
  projectName: string
  groupName: string
  studentName: string
  idCard: string
  school: string
  teacherName: string
  contact: string
  status: 'VALID' | 'INVALID' | 'PENDING'
}

export interface QuestionBankItem {
  id: number
  name: string
  stage: 'PRIMARY' | 'MIDDLE'
  suiteNo: number
  questionCount: number
  subjectiveCount: number
  status: 'DRAFT' | 'PUBLISHED'
  updatedAt: string
}

export interface ResourceItem {
  id: number
  categoryPath: string
  fileName: string
  fileType: 'PPT' | 'DOC' | 'VIDEO' | 'ZIP'
  stage: 'PRIMARY' | 'MIDDLE'
  updatedAt: string
}

export interface ReviewProgressItem {
  id: number
  sessionName: string
  pendingCount: number
  reviewingCount: number
  finishedCount: number
  syncStatus: 'SYNCED' | 'FAILED' | 'PENDING'
}

export interface ScoreRecordItem {
  id: number
  studentName: string
  idCard: string
  stage: 'PRIMARY' | 'MIDDLE'
  sessionName: string
  objectiveScore: number
  subjectiveScore: number
  totalScore: number
  submitTime: string
}

export interface ExportTaskItem {
  id: number
  fileName: string
  status: 'PROCESSING' | 'SUCCESS' | 'FAILED'
  createdAt: string
}

export interface FeedbackItem {
  id: number
  title: string
  content: string
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE'
  createdAt: string
}
