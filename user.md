# User Preferences

## 1. 项目路径与文件组织
- 项目根目录固定为 `C:\Apps\TraeOwnProject\examSystem`
- 后续所有文件都保存在该根目录下
- 前端代码放在 `frontend/`
- 后端代码放在 `backend/`
- 需求文档、设计文档、说明文档放在 `docs/`

## 2. 文档偏好
- 优先输出详细、可落地的需求设计说明
- 文档建议使用 `Markdown`
- 需求说明应按角色拆分功能模块
- 需要明确功能边界、权限边界和业务规则
- 涉及 `Word/Excel/PPT/MD` 文件修改时，必须保留源文件
- 先复制一份并叠加版本号（如 `v1.0 -> v1.1 -> v1.2`），仅在新版文件上修改
- 后续对应场景工作默认基于最新版本文件进行
- 在 `C:\Apps\TraeOwnProject\examSystem\docs` 维护 `changelog` 文档：
- 记录已完成事项、已知问题/bug、下一步计划
- 每次更新 changelog 必须新建版本文件并叠加版本号，不覆盖历史版本

## 3. 工作原则
- 新增内容优先复用已有约定，不重复发明结构
- 如果与当前文档冲突，以本文件和用户最新确认内容为准
- 需要新增文件时，优先先确认放置在根目录或 `docs/`、`frontend/`、`backend/` 对应位置
- 每次问答开始前必须先读取 `C:\Apps\TraeOwnProject\examSystem\user.md` 并按其中约束执行
- 每次新对话开始前，需先读取 `docs` 下最新版本 `changelog` 再继续执行任务

## 4. 代码注释要求
- 开发时代码注释必须使用中文
- 注释保持简洁，只需说明这部分代码的用途和基本逻辑

## 5. Git 分支与提交流程
- 远程仓库地址为 `https://github.com/phuong0944298660-code/StudentExamPlatform.git`
- 本地分支与远程分支映射如下：`Develop` 对应 `origin/Develop`，`UAT` 对应 `origin/UAT`，`main` 对应 `origin/main`
- 仓库本地分支固定为 `Develop`（开发分支）、`UAT`（测试分支）、`main`（总分支/生产分支）
- 日常代码变更后，必须自动提交到 `Develop` 分支，并在提交信息中备注变更内容
- 用户验证通过后，由助手先生成本次变更备注；用户确认并人工明确要求后，才可提交到 `UAT` 分支
- `UAT` 分支测试通过后，由助手先生成本次变更备注；用户确认并人工明确要求后，才可提交到 `main` 分支
- 禁止在未收到用户人工明确要求的情况下自动提交到 `UAT` 或 `main` 分支

## 6. 架构文档治理规则
- `docs/architecture.md` 用于约束项目目录结构规范、数据库结构（Schema）和 API 约定
- 后续若目录结构规范、数据库结构、API 约定发生变化，必须先复制一份架构文档并迭代版本号（如 `architecture-v1.0.md -> architecture-v1.1.md`），仅在新版本上更新内容
- 后续开发实现必须默认依据最新版本架构文档执行；如与历史文档冲突，以最新版本架构文档为准

## 7. 需求文档治理规则
- `docs/exam-platform-requirements-spec*.md` 为需求基线文档
- 每次需求变更时，必须先复制并更新需求文档，按版本号迭代（如 `exam-platform-requirements-spec-v1.2.md -> exam-platform-requirements-spec-v1.3.md`），禁止直接覆盖历史版本
- 后续任何开发任务（前端、后端、数据库、服务、接口联调）都必须以最新版 `exam-platform-requirements-spec` 文档为准执行
- 若开发内容与旧版文档冲突，以最新版需求文档为唯一准入依据
- 如果涉及系统架构变更，则同步更新 `architecture.md` 文档，禁止直接覆盖历史版本
- 当前需求基线文件更新为 `docs/exam-platform-requirements-spec-v1.4.md`

## 8. UI 与技术栈执行规则
- 前端开发必须遵循 `docs/design-system-v1.2.md`
- 编程开发必须严格遵循 `docs/tech-stack.md`
- 若 UI 设计规范或技术栈发生变化，必须先更新对应版本文档，再开始开发实现
