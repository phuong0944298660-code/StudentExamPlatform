# 考试培训平台架构规范（对齐需求 V1.2）

## 1. 文档信息

- 架构版本：`v1.1`
- 对齐需求基线：`docs/exam-platform-requirements-spec-v1.2.md`
- 技术约束：前端 `Vue 3 + TypeScript`，后端 `Java 17 + Spring Boot`，数据库 `MySQL 8.x`，部署 `Docker`
- 更新日期：`2026-03-26`

本版本重点对齐以下需求变更：
- 首页看板规则（含豆腐块 `!` 口径提示、平台管理员单卡指标）
- 学生/家长结果页可见条件（`评分完成` 且 `成绩发布开关=开`）
- 三评卷教师评分聚合（平均值/中位数）
- 练习账号价格与生效周期、激活码时效与留痕、审计日志追溯

## 2. 目录结构规范（Tree）

```text
examSystem/
├─ frontend/                                      # Vue 前端工程
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ admin/                                # 平台管理员页面
│  │  │  │  ├─ dashboard/                         # 看板（单卡总览 + 口径提示）
│  │  │  │  ├─ account/                           # 账号管理、价格与周期
│  │  │  │  ├─ activation/                        # 激活码管理
│  │  │  │  ├─ enrollment/                        # 报名导入与补全
│  │  │  │  ├─ question-bank/                     # 题库与组卷
│  │  │  │  ├─ session/                           # 场次与时间管理
│  │  │  │  ├─ review-score/                      # 评卷与成绩同步
│  │  │  │  └─ audit/                             # 审计日志与追溯
│  │  │  ├─ contest-admin/                        # 赛事管理员页面
│  │  │  ├─ reviewer/                             # 评卷老师页面
│  │  │  ├─ teacher/                              # 教师页面
│  │  │  └─ student/                              # 学生/家长统一结果页
│  │  ├─ components/
│  │  │  ├─ common/                               # 通用组件
│  │  │  ├─ dashboard/                            # 看板组件（MetricCard, DefinitionTip）
│  │  │  ├─ exam/                                 # 答题卡、倒计时、自动保存状态
│  │  │  ├─ upload/                               # 主观题上传与预览
│  │  │  └─ review/                               # 评分相关组件
│  │  ├─ api/                                     # API 封装（按模块）
│  │  ├─ stores/                                  # Pinia 状态管理
│  │  ├─ router/                                  # 权限路由 + 动态菜单
│  │  ├─ types/                                   # 类型定义
│  │  └─ utils/
│  └─ public/
├─ backend/                                       # Java 后端工程
│  ├─ src/main/java/com/exam/
│  │  ├─ common/                                  # 返回体、异常、工具、常量
│  │  ├─ config/                                  # 安全、跨域、序列化、持久化配置
│  │  ├─ auth/                                    # JWT、RBAC、登录会话
│  │  ├─ modules/
│  │  │  ├─ account/                              # 账号、价格策略、周期策略
│  │  │  ├─ activation/                           # 激活码与激活记录
│  │  │  ├─ enrollment/                           # 报名导入与补全
│  │  │  ├─ questionbank/                         # 题库管理
│  │  │  ├─ exam/                                 # 场次、试卷、作答、自动保存
│  │  │  ├─ review/                               # 评卷、聚合、成绩同步
│  │  │  ├─ resource/                             # 资源中心
│  │  │  ├─ dashboard/                            # 首页看板聚合与口径
│  │  │  └─ audit/                                # 审计日志
│  │  └─ Application.java
│  └─ src/main/resources/
│     ├─ db/migration/                            # SQL 迁移脚本
│     ├─ mapper/
│     └─ application.yml
└─ docs/
   ├─ architecture.md                             # 当前最新架构文档
   ├─ architecture-v1.0.md                        # 历史版本
   ├─ architecture-v1.1.md                        # 本次迭代版本
   └─ exam-platform-requirements-spec-v1.2.md     # 需求基线
```

目录执行约束：
- 页面必须放 `frontend/src/pages/<role-or-domain>/`，禁止把页面组件直接放到 `components`。
- 首页豆腐块组件统一放 `frontend/src/components/dashboard/`，并内置 `!` 口径提示能力。
- 学生与家长首页统一走 `frontend/src/pages/student/`，仅通过权限控制可见数据范围。
- 后端所有写接口必须在 `modules` 对应领域内实现幂等与审计日志落库。
- 数据库结构变更只能通过 `db/migration` 迁移脚本执行。

## 3. 数据库结构（Schema）

### 3.1 关系总览

- `user` 与 `role` 多对多，通过 `user_role` 关联。
- `practice_account_policy` 与 `practice_account_status` 一对多。
- `activation_code` 与 `activation_record` 一对多。
- `exam_session` 与 `exam_paper` 一对多。
- `exam_paper` 与 `exam_answer` 一对多；`exam_answer` 与 `answer_upload` 一对多。
- `score_policy` 定义聚合策略；`review_score` 记录多评卷明细；`exam_score` 存最终汇总分。
- 所有关键操作写入 `operation_log`，满足审计追溯要求。

### 3.2 MySQL DDL（核心）

```sql
CREATE TABLE `role` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_code VARCHAR(40) NOT NULL UNIQUE,
  role_name VARCHAR(80) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  real_name VARCHAR(80) NOT NULL,
  id_card_no VARCHAR(32),
  mobile VARCHAR(20),
  account_type ENUM('PRACTICE', 'EXAM', 'STAFF') NOT NULL DEFAULT 'STAFF',
  grade_stage ENUM('PRIMARY', 'MIDDLE') DEFAULT NULL,
  status ENUM('ENABLED', 'DISABLED', 'LOCKED') NOT NULL DEFAULT 'ENABLED',
  last_login_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_role` (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES `user`(id),
  CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) REFERENCES `role`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `practice_account_policy` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  policy_name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_days INT NOT NULL,
  valid_from DATETIME,
  valid_to DATETIME,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_by BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_policy_created_by FOREIGN KEY (created_by) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `practice_account_status` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  policy_id BIGINT NOT NULL,
  effective_from DATETIME NOT NULL,
  effective_to DATETIME NOT NULL,
  status ENUM('NOT_EFFECTIVE', 'EFFECTIVE', 'EXPIRED') NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_practice_user_policy (user_id, policy_id),
  CONSTRAINT fk_practice_status_user FOREIGN KEY (user_id) REFERENCES `user`(id),
  CONSTRAINT fk_practice_status_policy FOREIGN KEY (policy_id) REFERENCES `practice_account_policy`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `activation_code` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(64) NOT NULL UNIQUE,
  stage ENUM('PRIMARY', 'MIDDLE') NOT NULL,
  target_role ENUM('TEACHER', 'STUDENT') NOT NULL,
  resource_scope ENUM('QUESTION_BANK', 'QUESTION_BANK_AND_RESOURCE') NOT NULL,
  valid_from DATETIME NOT NULL,
  valid_to DATETIME NOT NULL,
  status ENUM('NOT_EFFECTIVE', 'ACTIVE', 'EXPIRED', 'FROZEN', 'USED') NOT NULL DEFAULT 'NOT_EFFECTIVE',
  created_by BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activation_code_creator FOREIGN KEY (created_by) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `activation_record` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  activation_code_id BIGINT NOT NULL,
  activated_user_id BIGINT NOT NULL,
  device_id VARCHAR(120),
  source_channel VARCHAR(60),
  activated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activation_record_code FOREIGN KEY (activation_code_id) REFERENCES `activation_code`(id),
  CONSTRAINT fk_activation_record_user FOREIGN KEY (activated_user_id) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `enrollment` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  area VARCHAR(80) NOT NULL,
  project_code VARCHAR(60) NOT NULL,
  project_name VARCHAR(120) NOT NULL,
  group_name VARCHAR(80) NOT NULL,
  student_name VARCHAR(80) NOT NULL,
  student_id_card VARCHAR(32) NOT NULL,
  school_name VARCHAR(160) NOT NULL,
  teacher_name VARCHAR(80),
  teacher_org VARCHAR(160),
  contact_mobile VARCHAR(20),
  import_batch_no VARCHAR(64) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_enrollment_student (project_code, student_id_card)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `question_bank` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  bank_name VARCHAR(160) NOT NULL,
  stage ENUM('PRIMARY', 'MIDDLE') NOT NULL,
  suite_no INT NOT NULL,
  status ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  created_by BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_question_bank_creator FOREIGN KEY (created_by) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `question` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  bank_id BIGINT NOT NULL,
  question_type ENUM('SINGLE', 'MULTI', 'JUDGE', 'SUBJECTIVE') NOT NULL,
  content TEXT NOT NULL,
  score DECIMAL(6,2) NOT NULL,
  difficulty TINYINT NOT NULL DEFAULT 3,
  tags VARCHAR(255),
  scoring_rule JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_question_bank FOREIGN KEY (bank_id) REFERENCES `question_bank`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `exam_session` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_name VARCHAR(160) NOT NULL,
  stage ENUM('PRIMARY', 'MIDDLE') NOT NULL,
  bank_id BIGINT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  duration_minutes INT NOT NULL,
  global_extra_minutes INT NOT NULL DEFAULT 0,
  open_status ENUM('READY', 'OPEN', 'CLOSED', 'FINISHED') NOT NULL DEFAULT 'READY',
  score_publish_switch TINYINT NOT NULL DEFAULT 0,
  created_by BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exam_session_bank FOREIGN KEY (bank_id) REFERENCES `question_bank`(id),
  CONSTRAINT fk_exam_session_creator FOREIGN KEY (created_by) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `exam_paper` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  student_user_id BIGINT NOT NULL,
  submit_time DATETIME,
  objective_total_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  subjective_total_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  total_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  review_status ENUM('NOT_REVIEWED', 'REVIEWING', 'REVIEWED') NOT NULL DEFAULT 'NOT_REVIEWED',
  status ENUM('IN_PROGRESS', 'SUBMITTED', 'LOCKED') NOT NULL DEFAULT 'IN_PROGRESS',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_session_student (session_id, student_user_id),
  CONSTRAINT fk_exam_paper_session FOREIGN KEY (session_id) REFERENCES `exam_session`(id),
  CONSTRAINT fk_exam_paper_student FOREIGN KEY (student_user_id) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `exam_answer` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  paper_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  answer_text TEXT,
  answer_json JSON,
  autosaved_at DATETIME,
  final_saved_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_paper_question (paper_id, question_id),
  CONSTRAINT fk_exam_answer_paper FOREIGN KEY (paper_id) REFERENCES `exam_paper`(id),
  CONSTRAINT fk_exam_answer_question FOREIGN KEY (question_id) REFERENCES `question`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `answer_upload` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  answer_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(40) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  upload_status ENUM('UPLOADED', 'REPLACED') NOT NULL DEFAULT 'UPLOADED',
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_answer_upload_answer FOREIGN KEY (answer_id) REFERENCES `exam_answer`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `score_policy` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  stage ENUM('PRIMARY', 'MIDDLE') NOT NULL,
  reviewer_count INT NOT NULL DEFAULT 3,
  aggregate_algo ENUM('AVG', 'MEDIAN') NOT NULL DEFAULT 'AVG',
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_by BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_score_policy_creator FOREIGN KEY (created_by) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `review_score` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  paper_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  reviewer_id BIGINT NOT NULL,
  score DECIMAL(6,2) NOT NULL,
  comment_text VARCHAR(1000),
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_paper_question_reviewer (paper_id, question_id, reviewer_id),
  CONSTRAINT fk_review_score_paper FOREIGN KEY (paper_id) REFERENCES `exam_paper`(id),
  CONSTRAINT fk_review_score_question FOREIGN KEY (question_id) REFERENCES `question`(id),
  CONSTRAINT fk_review_score_reviewer FOREIGN KEY (reviewer_id) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `exam_score` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  paper_id BIGINT NOT NULL UNIQUE,
  score_policy_id BIGINT NOT NULL,
  objective_total DECIMAL(8,2) NOT NULL DEFAULT 0,
  subjective_total DECIMAL(8,2) NOT NULL DEFAULT 0,
  total_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  rank_no INT,
  score_sync_status ENUM('PENDING', 'SYNCED', 'FAILED') NOT NULL DEFAULT 'PENDING',
  score_synced_at DATETIME,
  calculated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exam_score_paper FOREIGN KEY (paper_id) REFERENCES `exam_paper`(id),
  CONSTRAINT fk_exam_score_policy FOREIGN KEY (score_policy_id) REFERENCES `score_policy`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `resource_file` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  stage ENUM('PRIMARY', 'MIDDLE') NOT NULL,
  category_level1 VARCHAR(120) NOT NULL,
  category_level2 VARCHAR(120) NOT NULL,
  category_level3 VARCHAR(120) NOT NULL,
  category_level4 VARCHAR(120) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(40) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  preview_only TINYINT NOT NULL DEFAULT 1,
  created_by BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_resource_creator FOREIGN KEY (created_by) REFERENCES `user`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `operation_log` (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  trace_id VARCHAR(64) NOT NULL,
  operator_user_id BIGINT NOT NULL,
  module_name VARCHAR(80) NOT NULL,
  action_name VARCHAR(120) NOT NULL,
  target_type VARCHAR(80),
  target_id VARCHAR(80),
  action_reason VARCHAR(500),
  action_result ENUM('SUCCESS', 'FAILED') NOT NULL DEFAULT 'SUCCESS',
  ip VARCHAR(64),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_operation_log_user FOREIGN KEY (operator_user_id) REFERENCES `user`(id),
  KEY idx_operation_created_at (created_at),
  KEY idx_operation_trace_id (trace_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 4. API 约定

### 4.1 请求头规范

- `Content-Type: application/json`，上传接口使用 `multipart/form-data`
- `Authorization: Bearer <access_token>`
- `X-Trace-Id: <uuid>`（必传）
- `X-Role-Code: <ADMIN|CONTEST_ADMIN|REVIEWER|TEACHER|STUDENT|PARENT>`（网关注入或前端透传）
- `X-Idempotency-Key: <uuid>`（自动保存、交卷、评分提交接口必传）

### 4.2 统一返回格式

```json
{
  "code": 200,
  "data": {},
  "msg": "ok",
  "traceId": "3a2f5ce1-7ee5-48fa-b8c3-19cccfba05c2",
  "timestamp": "2026-03-26T21:20:00+08:00"
}
```

错误格式保持同结构，`code != 200` 时 `msg` 提供可读原因。

### 4.3 鉴权与权限

- 认证：`JWT AccessToken + RefreshToken`
- 鉴权：`Spring Security + RBAC`，按角色和资源做双层校验
- 数据权限：
  - 学生仅可访问本人数据
  - 家长仅可访问绑定学生数据
  - 评卷老师仅可访问分配任务
- 审计：所有场次开关、延时、分数修订、成绩发布开关变更必须落 `operation_log`

### 4.4 关键接口契约（与 V1.2 对齐）

- `GET /api/v1/dashboard/admin/overview`
  - 返回单卡：`todayPlannedExamCount`、`currentExamLoginCount`
  - 所有看板卡片字段包含 `definition` 用于 `!` 口径说明
- `POST /api/v1/exam-sessions/{sessionId}/switch`
  - 用于场次开/关操作，要求记录 `operator`、`reason`
- `POST /api/v1/exam-papers/{paperId}/autosave`
  - 幂等接口，满足自动保存 `P95 < 800ms`
- `POST /api/v1/exam-papers/{paperId}/submit`
  - 提交成功后记录精确到秒的 `submitTime`
- `POST /api/v1/review-scores`
  - 同一试卷满 3 名评卷教师后触发成绩聚合与同步
- `GET /api/v1/student/results/{paperId}`
  - 仅当 `review_status=REVIEWED` 且 `score_publish_switch=1` 才返回结果
  - 否则返回“考试结果尚未公布”

## 5. 与需求 V1.2 的强约束对齐清单

- 平台管理员首页必须使用单个豆腐块展示“今日预计考试人数 / 当前考试登录人数”。
- 所有首页豆腐块必须支持 `!` 图标悬停/点击查看口径。
- 学生与家长首页结果逻辑统一，成绩可见条件固定为“评分完成 + 发布开关开启”。
- 评卷策略默认 3 名评卷教师，聚合算法支持平均值或中位数。
- 排名规则遵循“总分优先，同分按提交时间升序”。
- 练习账号与考试账号、练习模块与考试模块必须严格隔离。
- 主观题附件上传支持图片/文档/压缩包，支持预览与重传，状态实时保存。

