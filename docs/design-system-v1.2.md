# 接力教育智慧云平台 - UI 设计规范 (Design System)

本规范专为接力教育智慧云平台（K-12 阶段：小学、初中）制定。设计核心理念为：**“清晰护眼、现代活力、专注聚焦”**。学生端需降低认知负担，教师/管理员端需保障信息处理的高效性。

## 1. UI 框架选型 (UI Framework)

本项目采用 **“Tailwind CSS + Element Plus”** 的混合架构：
* **Tailwind CSS (核心原子样式)**：用于全局排版、色彩控制、间距、响应式布局以及学生端（训练/考试界面）的高度定制化 UI。其原子化特性非常适合构建现代感、卡片式的轻快界面。
* **Element Plus (中后台组件)**：用于教师端工作台、管理员配置后台（如表格、树形控件、日期选择器、复杂表单），保障后台开发效率与交互一致性。

---

## 2. 品牌主题与色彩系统 (Color Palette)

色彩提取自“智慧、生长、科技”理念，降低了传统高饱和颜色的刺眼感，采用更柔和、护眼的莫兰迪/柔和色系，保护中小学生视力。

### 2.1 主品牌色 (Primary Colors)
* **主色调 (Primary Blue)**：`#3B82F6` (Tailwind `blue-500`) —— 代表科技与智慧，用于主按钮、活跃状态、强调文本。
* **辅助色 (Accent Indigo)**：`#6366F1` (Tailwind `indigo-500`) —— 用于渐变背景、VIP激活码标识或特色模块。

### 2.2 语义色 (Semantic Colors)
* **正确/成功 (Success)**：`#10B981` (Tailwind `emerald-500`) —— 用于客观题答对、提交成功提示。
* **错误/警示 (Error)**：`#EF4444` (Tailwind `red-500`) —— 用于答错题、交卷拦截、防作弊警告（颜色需克制，避免给学生造成过度恐慌）。
* **提醒/倒计时 (Warning)**：`#F59E0B` (Tailwind `amber-500`) —— 用于考试即将结束的倒计时高亮、复查待处理状态。

### 2.3 中性色与护眼背景 (Neutrals & Backgrounds)
* **主要文字 (Text Primary)**：`#1E293B` (Tailwind `slate-800`) —— 避免纯黑 (`#000000`) 带来的视觉疲劳。
* **次要文字 (Text Secondary)**：`#64748B` (Tailwind `slate-500`) —— 用于辅助说明、未答题号。
* **应用背景 (App Background)**：`#F8FAFC` (Tailwind `slate-50`) —— 柔和的浅灰蓝色，替代纯白，有效护眼。
* **卡片背景 (Card Background)**：`#FFFFFF` (纯白) —— 用于试卷区、工作台内容区，形成清晰的层级对比。

---

## 3. 字体与排版规范 (Typography)

针对中小学生，基础字号需比常规后台系统大一号，确保长时间阅读试题不疲劳。

* **中文字体家族**：`"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`
* **英文字体家族**：`"Nunito", "Roboto", sans-serif` (数字和英文字母推荐使用更圆润现代的字体，特别是公式和代码块)
* **字号阶梯 (Font Scale)**：
  * **H1 (大标题/考试名称)**：`24px` (Font Weight: 600)
  * **H2 (模块标题/大题题干)**：`20px` (Font Weight: 600)
  * **Base (基础正文/小题题干)**：`16px` (Font Weight: 400，行高 `1.6`，适合学生阅读)
  * **Small (辅助信息/标签)**：`14px` (Font Weight: 400)
* **段落间距**：试题与试题之间的间距至少保持 `24px` (`mb-6`)。

---

## 4. 间距与圆角规则 (Spacing & Shape)

设计语言偏向于“现代化圆润”，减少直角带来的锐利感和严肃感，提升亲和力。

* **基础间距单元**：`4px` (基于 Tailwind 的 `spacing` 规则，如 `p-4` = 16px, `p-6` = 24px)
* **按钮尺寸与圆角**：
  * **基础圆角 (Border Radius)**：`8px` (`rounded-lg`) —— 用于输入框、标准按钮、弹窗。
  * **卡片圆角**：`12px` 或 `16px` (`rounded-xl` / `rounded-2xl`) —— 用于题库卡片、工作台模块、错题本封面，显得更活泼。
  * **按钮高度**：默认按钮高度设为 `40px`，主操作按钮（如“提交试卷”）高度设为 `48px`，便于触控和点击。

---

## 5. 交互与动画规则 (Interaction & Animation)

动效原则：**“克制、流畅、有反馈”**。考试场景下切忌过度花哨的动画分散注意力。

### 5.1 悬浮与点击反馈 (Hover & Active)
* **按钮悬浮 (Button Hover)**：
  * 颜色微调加深（如 `blue-500` 变 `blue-600`）。
  * 阴影浮动：增加微弱的阴影 `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)` (`hover:shadow-md`)。
  * 动画时长：过度时间统一定为 **`200ms`** (`transition-all duration-200 ease-in-out`)。
* **卡片悬浮 (Card Hover)**：
  * 用于“训练题库”入口卡片，悬浮时整体向上位移 `-4px` (`hover:-translate-y-1`)，时长 `300ms`。

### 5.2 弹窗与加载动画 (Modals & Loading)
* **弹窗动画 (Modal)**：
  * 出现时长：**`300ms`**。
  * 运动轨迹：由下至上淡入 `Fade In Up` (透明度 0->1，Y轴位移 20px -> 0)。避免生硬的突然闪现。
* **交卷防抖加载 (Submit Loading)**：
  * 点击“确认交卷”后，按钮立即进入 `Loading` 状态（文字变为“正在加密提交...”，配以旋转 Loading Icon），锁定按钮防止二次点击，此时页面不可关闭。

### 5.3 考试专用视觉规则 (Exam-Specific Rules)
* **防作弊水印**：全局覆盖透明度为 `8%` (`opacity-8`)、倾斜 `-30deg` 的考生姓名+身份证后6位水印，且设置 `pointer-events: none` 确保不遮挡答题点击。
* **倒计时警告**：距离考试结束剩 5 分钟时，顶部倒计时字体颜色平滑过渡为 `红黄色` (`text-amber-500`)，并伴随 `1秒/次` 的轻微呼吸闪烁效果 (`pulse` 动画)，提醒交卷。

---

## 6. 特殊场景组件设计 (Special Components)

* **答题矩阵 (Question Navigator)**：
  * 位于考试界面左侧或折叠侧边栏。
  * **未答状态**：白底灰边框 (`bg-white border-slate-300 text-slate-600`)。
  * **已答状态**：品牌主色填充 (`bg-blue-500 text-white border-transparent`)。
  * **当前聚焦题**：外发光效果 (`ring-2 ring-blue-300 ring-offset-2`)。
* **主观题上传区域 (Upload Area)**：
  * 拖拽上传区域需使用虚线边框 (`border-dashed border-2 border-slate-300`)。
  * 拖入文件时背景变为浅蓝色 (`bg-blue-50`)，给予明确的物理反馈。
