# 接力教育智慧云平台 - 前端项目

## 项目简介

管理员端前端框架，基于 Vue 3 + TypeScript + Vite 构建，使用 Element Plus + Tailwind CSS 实现。

## 技术栈

- **核心框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **类型系统**: TypeScript
- **UI 组件库**: Element Plus
- **CSS 框架**: Tailwind CSS
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **图标库**: Element Plus Icons

## 功能模块

### 赛前准备流程
- ✅ 看板概览 - 数据统计、待办任务、快捷入口
- ✅ 账号管理 - 账号列表、策略配置
- ✅ 激活管理 - 码池管理、激活记录
- ✅ 导入管理 - 名单导入、名单补全
- ✅ 题库管理 - 目录管理、组卷管理、题目管理
- ✅ 场次管理 - 场次配置、考场监控、白名单管理
- ✅ 资源管理 - 资源中心、分类管理

### 赛后处理流程
- ✅ 阅卷管理 - 任务分配、进度监控
- ✅ 复核管理 - 复查申请处理
- ✅ 成绩管理 - 成绩查询、导出、发布
- ✅ 留痕管理 - 操作日志审计

## 项目结构

```
frontend/
├── src/
│   ├── api/           # API 接口封装
│   ├── components/    # 公共组件
│   ├── layouts/       # 布局组件
│   ├── mock/          # 假数据
│   ├── pages/         # 页面组件
│   │   ├── admin/     # 管理员端
│   │   ├── login/     # 登录页
│   │   └── 404/       # 404页面
│   ├── router/        # 路由配置
│   ├── stores/        # Pinia 状态
│   ├── types/         # TypeScript 类型
│   ├── utils/         # 工具函数
│   ├── App.vue        # 根组件
│   ├── main.ts        # 入口文件
│   └── style.css      # 全局样式
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

## 开发指南

### 安装依赖

```bash
cd frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认访问地址: http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建产物位于 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 路由说明

| 路径 | 页面 | 说明 |
|-----|------|-----|
| `/login` | 登录页 | 管理员登录入口 |
| `/admin/dashboard` | 看板概览 | 首页数据统计 |
| `/admin/accounts` | 账号列表 | 管理学生/教师账号 |
| `/admin/accounts/strategy` | 策略配置 | 账号有效期策略 |
| `/admin/activation` | 码池管理 | 激活码生成/管理 |
| `/admin/activation/records` | 激活记录 | 激活码使用记录 |
| `/admin/import` | 名单导入 | 批量导入学生/教师 |
| `/admin/import/completion` | 名单补全 | 补全导入信息 |
| `/admin/question-bank` | 目录管理 | 题库分类管理 |
| `/admin/question-bank/paper` | 组卷管理 | 创建/管理试卷 |
| `/admin/question-bank/questions` | 题目管理 | 题目CRUD |
| `/admin/sessions` | 场次配置 | 考试场次管理 |
| `/admin/sessions/monitor` | 考场监控 | 实时监控 |
| `/admin/sessions/whitelist` | 白名单 | 考生准入管理 |
| `/admin/resources` | 资源管理 | 学习资源管理 |
| `/admin/review` | 阅卷任务 | 任务分配/进度 |
| `/admin/review/recheck` | 复核管理 | 复查申请处理 |
| `/admin/scores` | 成绩查询 | 成绩查看 |
| `/admin/scores/export` | 成绩导出 | 导出成绩报表 |
| `/admin/scores/publish` | 成绩发布 | 设置公布时间 |
| `/admin/audit` | 日志审计 | 操作日志查看 |

## UI 规范

遵循 `docs/design-system-v1.2.md` 规范：

- 主色调: `#3B82F6` (blue-500)
- 背景色: `#F8FAFC` (slate-50)
- 圆角: 卡片 12px, 按钮 8px
- 字体: "PingFang SC", "Microsoft YaHei"

## 开发规范

1. 组件使用中文注释
2. 页面组件放在 `pages/<role>/<module>/index.vue`
3. 公共组件放在 `components/<domain>/<name>.vue`
4. 类型定义放在 `types/<domain>.ts`
5. 假数据放在 `mock/<domain>.ts`

## 许可证

私有项目，版权所有
