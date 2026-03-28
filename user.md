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
- 前端开发必须遵循 `docs/design-system-v1.3.md`（最新版本）
- 编程开发必须严格遵循 `docs/tech-stack.md`
- 若 UI 设计规范或技术栈发生变化，必须先更新对应版本文档，再开始开发实现

## 9. UI 开发工作规范（永久记忆）

**核心原则：设计系统（Design System）是单一数据源（Single Source of Truth）**

所有前端开发必须遵循 `docs/design-system-v*.md` 文档规范。

### 9.1 标准开发流程（无冲突时）
```
需求 → 查阅 design-system → 按规范开发 → 自检查 → 提交
```

### 9.2 UI 调整需求与文档冲突时（强制流程）

当用户提出的 UI 调整需求与现有 design-system 文档冲突时，**必须**执行以下流程：

```
用户提出 UI 调整需求
        ↓
发现与 design-system 冲突
        ↓
【必须】先实现调整样式
        ↓
【必须】向用户展示实际样式效果
        ↓
【必须】等待用户明确确认
        ↓
用户确认后
        ↓
├─→ 更新 design-system 文档（按第8节规则版本叠加）
├─→ 更新 frontend/public/ui-spec.html
└─→ 全局调整所有使用该组件的地方
        ↓
提交代码
```

### 9.3 具体操作要求

#### 步骤1：发现冲突即停止
当 UI 调整与 `design-system` 文档不一致时，**立即停止开发**，不擅自修改任何全局组件。

#### 步骤2：展示实际样式（必须）
向用户展示调整后的实际效果，方式包括：
- 在现有页面临时应用调整，截图/录屏展示
- 创建独立 HTML 演示文件
- 部署开发环境预览链接

展示内容必须包括：
- 调整前后对比
- 组件在不同状态下的表现（normal/hover/disabled等）
- 与其他组件的组合效果

#### 步骤3：获取用户确认（必须）
使用以下格式获取用户明确确认：
```
[UI 调整确认]
组件：xxx
调整内容：xxx
原因：与用户提出的 xxx 需求相关

请确认：
[ ] 同意调整，同步更新设计系统文档
[ ] 维持现有设计，不调整
[ ] 需要进一步修改（请说明）
```

#### 步骤4：用户确认后的同步更新

**4.1 更新 design-system 文档**
- 按第8节规则复制并叠加版本号（如 `v1.2 → v1.3`）
- 在新版本上修改组件规格
- 更新使用示例和变更说明

**4.2 更新 ui-spec.html**
同步修改 `frontend/public/ui-spec.html` 中对应组件的：
- 样式定义
- 示例代码
- 交互演示

**4.3 全局组件调整**
使用以下命令查找所有使用该组件的位置：
```bash
# 查找组件使用
grep -r "ComponentName" frontend/src/pages/ --include="*.vue"
grep -r "class=\"xxx\"" frontend/src/pages/ --include="*.vue"

# 批量替换（谨慎）
sed -i 's/old-class/new-class/g' frontend/src/pages/admin/*/index.vue
```

创建修改清单，确保所有页面统一调整：
| 页面路径 | 组件 | 修改内容 | 状态 |
|---------|------|---------|------|
| admin/accounts/index.vue | ElButton | 圆角 8px→12px | ✅ |
| admin/sessions/index.vue | ElButton | 圆角 8px→12px | ✅ |

### 9.4 文档关联关系（必须同步）

```
docs/design-system-v*.md (规范源头)
    ↓
frontend/public/ui-spec.html (交互式展示)
    ↓
frontend/src/style.css (全局样式覆盖)
    ↓
frontend/src/pages/**/*.vue (页面实现)
```

**变更时必须同步更新整个链路！**

### 9.5 检查清单（每次 UI 调整后必须确认）

- [ ] design-system 文档已更新（版本叠加）
- [ ] ui-spec.html 已同步更新
- [ ] 全局所有使用该组件的页面已调整
- [ ] 变更记录在 changelog 中
- [ ] 用户已确认最终效果

### 9.6 违规处理

如果发现以下情况，**立即回滚**并重新按流程执行：
1. ⚠️ 未展示实际样式就修改全局组件
2. ⚠️ 用户未确认就更新设计系统文档
3. ⚠️ 只更新了部分页面，遗漏其他使用位置
4. ⚠️ design-system 与 ui-spec.html 不一致

### 9.7 提交信息格式

UI 调整后的提交信息必须包含：
```
ui: 调整 Button 组件圆角规格

- 按用户确认调整按钮圆角从 8px 改为 12px
- 更新 design-system-v1.3.md
- 更新 frontend/public/ui-spec.html
- 全局调整 12 个页面中的按钮样式

Refs: 用户确认 #xxx
```

---

**最后更新**：2026-03-28  
**版本**：v1.1（UI开发规范新增）
