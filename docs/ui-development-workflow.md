# UI 开发工作规范

> 本文档记录前端 UI 开发的标准工作流程，确保设计系统的一致性和可维护性。

## 核心原则

**设计系统（Design System）是单一数据源（Single Source of Truth）**

所有前端开发必须遵循 `docs/design-system-v*.md` 文档规范。

---

## 工作流程

### 场景一：按文档规范开发（标准流程）

```
需求 → 查阅 design-system → 按规范开发 → 自检查 → 提交
```

### 场景二：UI 调整需求与文档冲突（特殊流程）

当用户提出的 UI 调整需求与现有 design-system 文档冲突时，必须执行以下流程：

```
用户提出 UI 调整需求
        ↓
发现与 design-system 冲突
        ↓
[必须] 先实现调整样式
        ↓
[必须] 向用户展示实际样式效果
        ↓
[必须] 等待用户确认
        ↓
用户确认后
        ↓
├─→ 更新 design-system 文档（版本叠加）
├─→ 更新 frontend/public/ui-spec.html
└─→ 全局调整所有使用该组件的地方
        ↓
提交代码
```

---

## 具体操作步骤

### 1. 发现冲突

当用户提出的 UI 调整与 `design-system` 文档不一致时，立即停止开发，进入确认流程。

### 2. 展示实际样式

使用以下方式向用户展示调整后的实际效果：

- **方式一**：在现有页面中临时应用调整，截图或录屏展示
- **方式二**：创建独立的 HTML 演示文件（如 `temp/ui-demo-xxx.html`）
- **方式三**：在开发环境中部署预览链接

展示内容必须包括：
- 调整前后的对比
- 该组件在不同状态下的表现（如按钮的 normal/hover/disabled）
- 与其他组件的组合效果

### 3. 用户确认

必须使用以下格式获取用户明确确认：

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

### 4. 文档更新（用户确认后）

#### 4.1 更新 design-system 文档

按照 `user.md` 中的版本治理规则：

```bash
# 1. 复制并叠加版本号
cp docs/design-system-v1.2.md docs/design-system-v1.3.md

# 2. 在新版本上修改
# 3. 更新版本引用
```

更新内容包括：
- 组件规格（尺寸、颜色、间距）
- 使用示例
- 变更说明

#### 4.2 更新 ui-spec.html

同步修改 `frontend/public/ui-spec.html`：

```html
<!-- 更新对应组件的样式 -->
<!-- 更新示例代码 -->
<!-- 更新交互演示 -->
```

#### 4.3 全局组件调整

使用以下命令查找所有使用该组件的地方：

```bash
# 查找组件使用位置
grep -r "ComponentName" frontend/src/pages/
grep -r "class=\"xxx\"" frontend/src/pages/
```

统一定义组件的修改清单：

| 页面路径 | 组件 | 修改内容 | 状态 |
|---------|------|---------|------|
| admin/accounts/index.vue | ElButton | 圆角从 8px 改为 12px | ⏳ |
| admin/sessions/index.vue | ElButton | 圆角从 8px 改为 12px | ⏳ |

### 5. 代码提交

提交信息格式：

```
ui: 调整 Button 组件圆角规格

- 按用户确认调整按钮圆角从 8px 改为 12px
- 更新 design-system-v1.3.md
- 更新 frontend/public/ui-spec.html
- 全局调整 12 个页面中的按钮样式

BREAKING CHANGE: 按钮圆角规格变更
```

---

## 文档关联关系

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

---

## 检查清单

每次 UI 调整完成后，必须确认：

- [ ] design-system 文档已更新（版本叠加）
- [ ] ui-spec.html 已同步更新
- [ ] 全局所有使用该组件的页面已调整
- [ ] 变更记录在 changelog 中
- [ ] 用户已确认最终效果

---

## 违规处理

如果发现以下情况，立即回滚并重新按流程执行：

1. ⚠️ 未展示实际样式就修改全局组件
2. ⚠️ 用户未确认就更新设计系统文档
3. ⚠️ 只更新了部分页面，遗漏其他使用位置
4. ⚠️ design-system 与 ui-spec.html 不一致

---

## 附：快速参考

### 常用查找命令

```bash
# 查找特定组件使用
grep -r "el-button" frontend/src/pages/ --include="*.vue"

# 查找特定样式使用
grep -r "rounded-lg" frontend/src/pages/ --include="*.vue"

# 查找特定颜色使用
grep -r "#3B82F6" frontend/src/ --include="*.vue" --include="*.css"
```

### 常用替换命令

```bash
# 批量替换（谨慎使用）
sed -i 's/rounded-lg/rounded-xl/g' frontend/src/pages/admin/*/index.vue
```

---

**最后更新**：2026-03-28  
**版本**：v1.0
