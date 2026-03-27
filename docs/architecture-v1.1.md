# 考试平台架构规范

## 1. 目录结构规范

```text
examSystem/
├─ frontend/                             # Vue 前端工程
│  ├─ src/
│  │  ├─ pages/                          # 页面级组件（路由页面）
│  │  │  ├─ auth/                        # 登录、找回密码
│  │  │  ├─ exam/                        # 考试、练习、考试结果
│  │  │  ├─ question-bank/               # 题库管理页面
│  │  │  ├─ review/                      # 评卷页面
│  │  │  ├─ admin/                       # 管理后台页面
│  │  │  └─ ai/                          # AI 功能独立页面（如 AI 组卷、AI 讲解）
│  │  ├─ components/                     # 通用组件
│  │  │  ├─ common/                      # 基础组件（表格、弹窗、筛选）
│  │  │  ├─ business/                    # 业务组件（答题卡、题目渲染器）
│  │  │  └─ ai/                          # AI 组件（提示词面板、AI 回复卡片）
│  │  ├─ api/                            # 接口调用封装（按模块分文件）
│  │  ├─ stores/                         # 状态管理
│  │  ├─ router/                         # 路由定义
│  │  ├─ utils/                          # 工具函数
│  │  └─ types/                          # TypeScript 类型定义
│  └─ public/
├─ backend/                              # Java 后端工程
│  ├─ src/main/java/com/exam/
│  │  ├─ common/                         # 通用返回、异常、工具、常量
│  │  ├─ config/                         # 安全、跨域、Swagger、数据库配置
│  │  ├─ auth/                           # 鉴权模块（JWT、登录、权限）
│  │  ├─ modules/
│  │  │  ├─ user/                        # 用户与角色
│  │  │  ├─ questionbank/                # 题库与题目
│  │  │  ├─ exam/                        # 考试与提交
│  │  │  ├─ review/                      # 评卷与成绩聚合
│  │  │  ├─ activation/                  # 激活码
│  │  │  └─ ai/                          # AI 服务（组卷、解析、问答）
│  │  └─ Application.java
│  └─ src/main/resources/
│     ├─ mapper/                         # MyBatis Mapper（如采用 MyBatis）
│     ├─ db/migration/                   # SQL 迁移脚本
│     └─ application.yml
└─ docs/
   ├─ architecture.md                    # 本文档
   ├─ changelog.md
   └─ *.md
```

目录使用规则：
- 新页面一律放在 `frontend/src/pages/<domain>/`，禁止把页面直接放在 `components`。
- 新通用组件放在 `frontend/src/components/common/`，业务组件放在 `frontend/src/components/business/`。
- AI 相关前端组件统一放在 `frontend/src/components/ai/`，AI 页面统一放在 `frontend/src/pages/ai/`。
- 后端按模块拆分到 `backend/src/main/java/com/exam/modules/<domain>/`，每个模块内包含 `controller/service/repository/model/dto`。
- 数据库迁移 SQL 统一放在 `backend/src/main/resources/db/migration/`，禁止手工改线上表结构。

## 2. 数据库结构（Schema）

核心关系说明：
- `users` 与 `roles` 是多对多，通过 `user_roles` 关联。
- `question_banks` 与 `questions` 是一对多，`questions` 与 `question_options` 是一对多。
- `exams` 与 `exam_candidates` 是一对多，`exams` 与 `exam_submissions` 是一对多。
- `exam_submissions` 与 `exam_answers` 是一对多，`exam_answers` 与 `answer_attachments` 是一对多。
- `review_tasks` 记录主观题评卷明细，可按平均值或中位数聚合生成最终分。

```sql
CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(64) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  real_name VARCHAR(64) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(128),
  status TINYINT NOT NULL DEFAULT 1 COMMENT '1=启用,0=禁用',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE activation_codes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(64) NOT NULL UNIQUE,
  target_type ENUM('STUDENT', 'TEACHER') NOT NULL,
  resource_scope VARCHAR(64) NOT NULL COMMENT 'QUESTION_BANK/QUESTION_BANK_AND_TRAINING',
  valid_from DATETIME NOT NULL,
  valid_to DATETIME NOT NULL,
  status ENUM('UNUSED', 'USED', 'EXPIRED') NOT NULL DEFAULT 'UNUSED',
  created_by BIGINT NOT NULL,
  used_by BIGINT,
  used_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activation_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT fk_activation_used_by FOREIGN KEY (used_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE question_banks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128) NOT NULL,
  subject VARCHAR(64) NOT NULL,
  grade VARCHAR(32),
  is_practice TINYINT NOT NULL DEFAULT 0 COMMENT '0=考试题库,1=练习题库',
  creator_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_question_banks_creator FOREIGN KEY (creator_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  bank_id BIGINT NOT NULL,
  type ENUM('SINGLE', 'MULTI', 'JUDGE', 'SHORT_ANSWER') NOT NULL,
  content TEXT NOT NULL,
  score DECIMAL(6,2) NOT NULL,
  difficulty TINYINT NOT NULL DEFAULT 3 COMMENT '1-5',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '1=启用,0=停用',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_questions_bank FOREIGN KEY (bank_id) REFERENCES question_banks(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE question_options (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question_id BIGINT NOT NULL,
  option_key CHAR(1) NOT NULL,
  option_text VARCHAR(500) NOT NULL,
  is_correct TINYINT NOT NULL DEFAULT 0,
  CONSTRAINT fk_question_options_question FOREIGN KEY (question_id) REFERENCES questions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE exams (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128) NOT NULL,
  bank_id BIGINT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  duration_minutes INT NOT NULL,
  allow_attachment TINYINT NOT NULL DEFAULT 1,
  status ENUM('DRAFT', 'PUBLISHED', 'FINISHED') NOT NULL DEFAULT 'DRAFT',
  created_by BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exams_bank FOREIGN KEY (bank_id) REFERENCES question_banks(id),
  CONSTRAINT fk_exams_creator FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE exam_candidates (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  exam_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  extra_minutes INT NOT NULL DEFAULT 0 COMMENT '单考生延时',
  admit_status ENUM('PENDING', 'APPROVED', 'BLOCKED') NOT NULL DEFAULT 'APPROVED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_exam_candidate (exam_id, user_id),
  CONSTRAINT fk_exam_candidates_exam FOREIGN KEY (exam_id) REFERENCES exams(id),
  CONSTRAINT fk_exam_candidates_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE exam_submissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  exam_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  submit_type ENUM('EXAM', 'PRACTICE') NOT NULL DEFAULT 'EXAM',
  started_at DATETIME NOT NULL,
  submitted_at DATETIME,
  total_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  status ENUM('IN_PROGRESS', 'SUBMITTED', 'REVIEWING', 'FINISHED') NOT NULL DEFAULT 'IN_PROGRESS',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exam_submissions_exam FOREIGN KEY (exam_id) REFERENCES exams(id),
  CONSTRAINT fk_exam_submissions_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE exam_answers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  submission_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  answer_text TEXT,
  answer_json JSON,
  objective_score DECIMAL(6,2) DEFAULT 0,
  subjective_score DECIMAL(6,2) DEFAULT 0,
  final_score DECIMAL(6,2) DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_submission_question (submission_id, question_id),
  CONSTRAINT fk_exam_answers_submission FOREIGN KEY (submission_id) REFERENCES exam_submissions(id),
  CONSTRAINT fk_exam_answers_question FOREIGN KEY (question_id) REFERENCES questions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE answer_attachments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  answer_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(64) NOT NULL,
  file_size BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_answer_attachments_answer FOREIGN KEY (answer_id) REFERENCES exam_answers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE review_tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  submission_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  reviewer_id BIGINT NOT NULL,
  score DECIMAL(6,2),
  comment_text VARCHAR(1000),
  status ENUM('PENDING', 'DONE') NOT NULL DEFAULT 'PENDING',
  reviewed_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_tasks_submission FOREIGN KEY (submission_id) REFERENCES exam_submissions(id),
  CONSTRAINT fk_review_tasks_question FOREIGN KEY (question_id) REFERENCES questions(id),
  CONSTRAINT fk_review_tasks_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 3. API 约定

### 3.1 请求头规范

- `Content-Type: application/json`，文件上传接口使用 `multipart/form-data`。
- `Authorization: Bearer <access_token>`，除登录和刷新 Token 外均必传。
- `X-Trace-Id: <uuid>`，用于链路追踪，前后端均需透传。
- `X-Client-Time: <ISO8601>`，可选，用于排查时钟问题。

### 3.2 统一返回格式

```json
{
  "code": 200,
  "data": {},
  "msg": "ok",
  "traceId": "5e2f0f8e-bef5-4f4b-a4a5-c8f3f09856b2",
  "timestamp": "2026-03-26T20:30:00+08:00"
}
```

返回码约定：
- `200`：成功。
- `400`：参数错误。
- `401`：未登录或 Token 无效。
- `403`：无权限访问。
- `404`：资源不存在。
- `409`：状态冲突（如重复提交）。
- `500`：系统内部错误。

### 3.3 鉴权方式

- 使用 JWT 双 Token 机制：`access_token`（短时）+ `refresh_token`（长时）。
- 登录成功后返回 Token，客户端将 `access_token` 放入 `Authorization`。
- 服务端基于角色做 RBAC 权限控制，角色至少包含 `ADMIN`、`CONTEST_ADMIN`、`TEACHER`、`STUDENT`、`PARENT`、`REVIEWER`。
- 涉及考试核心接口（提交、交卷、评分）必须做权限校验 + 状态校验，避免越权与重复提交。

### 3.4 分页与列表接口规范

- 请求参数统一：`pageNo`、`pageSize`、`sortBy`、`sortOrder`。
- 列表返回结构：

```json
{
  "code": 200,
  "data": {
    "list": [],
    "pageNo": 1,
    "pageSize": 20,
    "total": 0
  },
  "msg": "ok"
}
```

