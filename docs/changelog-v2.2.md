# Changelog

## 文档信息

- 版本：v2.2
- 更新时间：2026-03-27 17:00:00
- 作用：记录当前项目已完成事项、已知问题/风险、下一步计划，以及新对话可复用的 memory。
- 最新版本：`changelog-v2.2.md`

## 1) 目前已完成

- 完成需求说明书初版：`exam-platform-requirements-spec.md`。
- 基于多轮确认，完成需求说明书升级：
  - `exam-platform-requirements-spec-v1.1.md` ~ `exam-platform-requirements-spec-v1.5.md`
  - **新增** `exam-platform-requirements-spec-v1.6.md`（补充系统核心状态流转章节）
- 完成 UI/前端设计规范：`design-system.md`（适配小学/初中考试培训系统）。
- 完成偏好沉淀：`user.md`（路径、技术栈、文档版本化规则、执行规则）。
- 完成新版架构文档升级：`architecture-v1.12.md`（补充平台架构图）。
- **新增** 系统核心状态流转（v1.6需求文档核心更新）：
  - 考试场次状态流转（Exam Session）：DRAFT → PENDING → OPEN → FINISHED/CLOSED
  - 试卷/答题卷状态流转（Exam Paper）：CREATED → ANSWERING → SUBMITTED
  - 评卷任务状态流转（Review Task）：PENDING → ASSIGNED → REVIEWING → COMPLETED
  - 复查申请状态流转（Recheck Application）：含回避原则与48小时时效
  - 成绩状态流转（Score）：CALCULATED → PENDING → SCHEDULED → PUBLISHED → FINALIZED
  - 激活码状态流转（Activation Code）：移除FROZEN，支持重新激活为NOT_EFFECTIVE或ACTIVE
  - 账号状态流转（User Account）：LOCKED可由管理员解锁或重置密码（支持复制密码）
  - 练习卷状态流转（Practice Paper）：EXPIRED可重新激活为PUBLISHED
  - 题目状态流转（Question）：DEPRECATED可重新激活为PUBLISHED或创建新版
- **关键业务规则确认（补充）**：
  - 重新激活状态显示：NOT_EFFECTIVE（前端显示"未生效"）、ACTIVE（前端显示"生效中"）
  - 管理员可手工处理LOCKED账号：解锁或重置密码，重置后支持复制密码
  - 练习卷过期后指导老师可重新激活
  - 题目废弃后管理员可重新激活或创建新版

## 2) 已知问题 / 风险 / Bug 记录

- Markdown 格式层面（非业务）存在规范性告警（如标题前后空行、表格格式等），不影响当前需求逻辑，但后续若接入 CI 需统一格式。
- Windows 中文路径在个别脚本读取时可能触发编码/路径兼容问题（已通过读取方式规避）。
- 需求迭代频繁，若不严格遵守"版本叠加更新"容易出现口径漂移。

## 3) 下一步建议

- 依据 `architecture-v1.12.md` 和 `exam-platform-requirements-spec-v1.6.md` 开始前端页面骨架搭建。
- 优先实现管理员端的账号管理、题库管理、场次管理核心流程。
- 同步准备后端数据库初始化脚本（基于 architecture 中的 DDL）。
- 状态流转相关的状态字段需在数据库设计时预留扩展性。

## 4) New Chat Memory（可直接喂给新对话）

可复制以下内容作为新对话上下文：

1. 项目根目录：`C:\Apps\TraeOwnProject\examSystem`。
2. 文档与代码目录：`docs/`、`frontend/`、`backend/`。
3. 当前需求基线：`docs/exam-platform-requirements-spec-v1.6.md`（含完整业务流程+状态流转）。
4. UI 规范基线：`docs/design-system-v1.2.md`。
5. 技术栈基线：`docs/tech-stack.md`。
6. 架构基线：`docs/architecture.md`（v1.12，包含平台架构图）。
7. 前端开发必须遵循最新 `design-system` 文档。
8. 编程开发必须严格遵循 `tech-stack.md`。
9. 关键业务规则：
   - 账号分训练/考试两类，均关联学段（小学/初中）
   - 考试账号不关联指导老师，训练账号关联
   - 管理员组考试卷，指导老师组练习卷（仅自己所带学生可见）
   - 历年真题卷由考试卷转换，同学段训练账号可见
   - 主观题作答方式按卷配置（上传附件/富文本二选一）
   - 评卷分配在考试全部结束后统一进行（随机+工作量均衡）
   - 成绩公布时间精确到hh:mm，到期自动公布
   - 复查申请在公布后48小时内，每场限1次，回避原则
10. **核心状态流转**：
    - 考试场次：DRAFT→PENDING→OPEN→FINISHED/CLOSED
    - 成绩：CALCULATED→PENDING→SCHEDULED→PUBLISHED→FINALIZED
    - 激活码：重新激活可选择NOT_EFFECTIVE（未生效）或ACTIVE（生效中）
    - 账号：LOCKED可由管理员解锁或重置密码
    - 练习卷/题目：EXPIRED/DEPRECATED可重新激活

## 5) 版本更新规则（强制）

- 本文件后续更新采用叠加版本，不覆盖历史版本：
  - `changelog.md`（当前基线 v1.0）
  - `changelog-v1.1.md` ~ `changelog-v1.9.md`
  - `changelog-v2.0.md`（架构文档v1.12更新）
  - `changelog-v2.1.md`（需求文档v1.5，业务流程）
  - `changelog-v2.2.md`（本次更新版本，需求文档v1.6，状态流转）
- 每次新对话开始时，先读取 `docs` 下最新版本的 changelog 再继续工作。
