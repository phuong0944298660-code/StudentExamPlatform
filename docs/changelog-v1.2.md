# Changelog

## 文档信息

- 版本：v1.2
- 更新时间：2026-03-26 23:56:16
- 作用：记录当前项目已完成事项、已知问题/风险、下一步计划，以及新对话可复用的 memory。
- 对齐依据：`exam-platform-requirements-spec-v1.3.md`、`design-system-v1.1.md`、`tech-stack.md`、`architecture-v1.3.md`

## 1) 目前已完成

- 完成新版架构文档升级：`architecture-v1.3.md`。
- 新版架构对齐最新需求、UI 规范和技术栈，补齐了目录放置、菜单命名、API 约定与数据库结构。
- 前端开发仍需遵循 `design-system-v1.1.md`。
- 编程开发仍需严格遵循 `tech-stack.md`。

## 2) 已知问题 / 风险 / Bug 记录

- 文档版本继续按“复制新文件再更新”的方式迭代，若直接覆盖历史文件，容易丢失约束来源。
- 目录树已限制为两级，实际代码落地时必须按放置规则再细分到 `pages`、`components`、`modules` 等目录。

## 3) 下一步建议

- 先依据 `architecture-v1.3.md` 统一前端页面、组件、路由和后端模块的落位。
- 若后续需求继续变更，先更新需求文档，再同步更新架构文档与变更记录。
- 前端先按管理员角色的页面骨架和假数据进行联调体验。

## 4) New Chat Memory（可直接喂给新对话）

可复制以下内容作为新对话上下文：

1. 项目根目录：`C:\Apps\TraeOwnProject\examSystem`。
2. 文档与代码目录：`docs/`、`frontend/`、`backend/`。
3. 当前需求基线：`docs/exam-platform-requirements-spec-v1.3.md`。
4. UI 规范基线：`docs/design-system-v1.1.md`。
5. 技术栈基线：`docs/tech-stack.md`。
6. 架构基线：`docs/architecture-v1.3.md`。
7. 前端开发必须遵循最新 `design-system` 文档。
8. 编程开发必须严格遵循 `tech-stack.md`。
9. 架构文档约束目录结构、API 约定与数据库结构，后续变更必须先版本化再更新。

## 5) 版本更新规则（强制）

- 本文件后续更新采用叠加版本，不覆盖历史版本：
  - `changelog.md`（当前基线 v1.0）
  - `changelog-v1.1.md`（上一版）
  - `changelog-v1.2.md`（本次更新版本）
- 每次新对话开始时，先读取 `docs` 下最新版本的 changelog 再继续工作。
