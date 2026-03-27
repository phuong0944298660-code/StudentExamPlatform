# Changelog

## 文档信息

- 版本：v2.0
- 更新时间：2026-03-27 16:00:00
- 作用：记录当前项目已完成事项、已知问题/风险、下一步计划，以及新对话可复用的 memory。
- 最新版本：`changelog-v2.0.md`

## 1) 目前已完成

- 完成需求说明书初版：`exam-platform-requirements-spec.md`。
- 基于你的多轮确认，完成需求说明书升级：
  - `exam-platform-requirements-spec-v1.1.md`
  - `exam-platform-requirements-spec-v1.2.md`
  - `exam-platform-requirements-spec-v1.3.md`
  - `exam-platform-requirements-spec-v1.4.md`
- 完成 UI/前端设计规范：`design-system.md`（适配小学/初中考试培训系统）。
- 完成偏好沉淀：`user.md`（路径、技术栈、文档版本化规则、执行规则）。
- 完成需求说明书升级：`exam-platform-requirements-spec-v1.4.md`
- 完成新版架构文档升级：`architecture-v1.11.md`
- **新增**：完成架构文档 v1.12 升级，补充平台整体架构图：
  - 新增四层架构图（客户端层 / API网关层 / 应用服务层 / 数据存储层）
  - 新增高并发削峰架构设计（RabbitMQ 消息队列）
  - 新增关键业务数据流转图
  - 新增高并发场景部署架构图
- 已统一主观题统分规则为仅支持平均分。
- 已在架构 DDL 中补充 `score_publish_time`，用于成绩公布时间落库。
- 已统一文件存储口径为部署在 Docker 内的 `MinIO`。
- 已补齐教师端快捷组卷入口、评卷老师复查提醒、评分表扫描件留存等架构落点。
- 已统一 `Tailwind CSS` 为前端默认采用方案，并补齐 `阅卷管理` 总菜单表中的 `凭证留存`。
- 已统一 `changelog` 中架构基线路径为 `docs/architecture.md`。
- 已明确消息队列最终选型为 `RabbitMQ`，并同步到技术栈与架构文档。

## 2) 已知问题 / 风险 / Bug 记录

- Markdown 格式层面（非业务）存在规范性告警（如标题前后空行、表格格式等），不影响当前需求逻辑，但后续若接入 CI 需统一格式。
- Windows 中文路径在个别脚本读取时可能触发编码/路径兼容问题（已通过读取方式规避）。
- 需求迭代频繁，若不严格遵守"版本叠加更新"容易出现口径漂移。

## 3) 下一步建议

- 先依据 `architecture.md` 统一前端页面、组件、路由和后端模块的落位。
- 前端先按管理员角色的页面骨架和假数据进行联调体验。
- 若后续需求继续变更，先更新需求文档，再同步更新架构文档与变更记录。

## 4) New Chat Memory（可直接喂给新对话）

可复制以下内容作为新对话上下文：

1. 项目根目录：`C:\Apps\TraeOwnProject\examSystem`。
2. 文档与代码目录：`docs/`、`frontend/`、`backend/`。
3. 当前需求基线：`docs/exam-platform-requirements-spec-v1.4.md`。
4. UI 规范基线：`docs/design-system-v1.2.md`。
5. 技术栈基线：`docs/tech-stack.md`。
6. 架构基线：`docs/architecture.md`（已更新为 v1.12，包含平台架构图）。
7. 前端开发必须遵循最新 `design-system` 文档。
8. 编程开发必须严格遵循 `tech-stack.md`。
9. 架构文档约束目录结构、API 约定与数据库结构，后续变更必须先版本化再更新。
10. 平台架构四层设计：客户端层(Vue3) → API网关层(Nginx) → 应用服务层(Spring Boot) → 数据存储层(MySQL+Redis+MinIO)。
11. 高并发场景使用 RabbitMQ 进行削峰处理（交卷队列 / 算分队列 / 通知队列）。

## 5) 版本更新规则（强制）

- 本文件后续更新采用叠加版本，不覆盖历史版本：
  - `changelog.md`（当前基线 v1.0）
  - `changelog-v1.1.md`
  - `changelog-v1.2.md`
  - `changelog-v1.3.md`
  - `changelog-v1.4.md`
  - `changelog-v1.5.md`
  - `changelog-v1.6.md`
  - `changelog-v1.7.md`
  - `changelog-v1.8.md`
  - `changelog-v1.9.md`
  - `changelog-v2.0.md`（本次更新版本）
- 每次新对话开始时，先读取 `docs` 下最新版本的 changelog 再继续工作。
