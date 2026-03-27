import type { AdminMenuGroup, AdminSectionView, LinkItem } from '../types/admin'

export const adminMenus: AdminMenuGroup[] = [
  {
    key: 'dashboard',
    label: '总览看板',
    icon: 'DataBoard',
    baseRoute: '/admin/dashboard',
    children: [
      { key: 'overview', label: '看板概览', route: '/admin/dashboard/overview', description: '核心指标与风险总览' },
      { key: 'todo', label: '待办任务', route: '/admin/dashboard/todo', description: '今日待办与优先级' },
    ],
  },
  {
    key: 'accounts',
    label: '账号管理',
    icon: 'User',
    baseRoute: '/admin/accounts',
    children: [
      { key: 'list', label: '账号列表', route: '/admin/accounts/list', description: '训练号与考试号台账' },
      { key: 'policy', label: '策略配置', route: '/admin/accounts/policy', description: '训练套餐与有效期规则' },
    ],
  },
  {
    key: 'activation',
    label: '激活管理',
    icon: 'Ticket',
    baseRoute: '/admin/activation',
    children: [
      { key: 'pool', label: '码池管理', route: '/admin/activation/pool', description: '激活码库存与批次管理' },
      { key: 'history', label: '激活记录', route: '/admin/activation/history', description: '激活留痕与设备追踪' },
    ],
  },
  {
    key: 'import',
    label: '导入管理',
    icon: 'UploadFilled',
    baseRoute: '/admin/import',
    children: [
      { key: 'roster', label: '名单导入', route: '/admin/import/roster', description: '白名单与报名信息导入' },
      { key: 'complete', label: '名单补全', route: '/admin/import/complete', description: '教师映射与异常补齐' },
    ],
  },
  {
    key: 'question-bank',
    label: '题库管理',
    icon: 'Reading',
    baseRoute: '/admin/question-bank',
    children: [
      { key: 'directory', label: '目录管理', route: '/admin/question-bank/directory', description: '目录与知识点维护' },
      { key: 'builder', label: '组卷管理', route: '/admin/question-bank/builder', description: '模板与组卷策略' },
      { key: 'question', label: '题目管理', route: '/admin/question-bank/question', description: '题目录入与评分规则' },
    ],
  },
  {
    key: 'sessions',
    label: '场次管理',
    icon: 'Calendar',
    baseRoute: '/admin/sessions',
    children: [
      { key: 'config', label: '场次配置', route: '/admin/sessions/config', description: '考试时间轴与成绩发布时间' },
      { key: 'monitor', label: '考场监控', route: '/admin/sessions/monitor', description: '在线人数与异常大盘' },
      { key: 'whitelist', label: '白名单管理', route: '/admin/sessions/whitelist', description: '准入名单与补时控制' },
    ],
  },
  {
    key: 'resources',
    label: '资源管理',
    icon: 'FolderOpened',
    baseRoute: '/admin/resources',
    children: [
      { key: 'center', label: '资源中心', route: '/admin/resources/center', description: '资源仓库与预览权限' },
      { key: 'category', label: '资源分类', route: '/admin/resources/category', description: '目录与版权口径' },
    ],
  },
  {
    key: 'review',
    label: '阅卷管理',
    icon: 'Checked',
    baseRoute: '/admin/review',
    children: [
      { key: 'tasks', label: '阅卷任务', route: '/admin/review/tasks', description: '任务分配与进度追踪' },
      { key: 'recheck', label: '复核管理', route: '/admin/review/recheck', description: '复查申请与专家复核' },
      { key: 'retention', label: '凭证留存', route: '/admin/review/retention', description: '纸质评分表扫描件留存' },
    ],
  },
  {
    key: 'scores',
    label: '成绩管理',
    icon: 'TrendCharts',
    baseRoute: '/admin/scores',
    children: [
      { key: 'query', label: '成绩查询', route: '/admin/scores/query', description: '总分与分项成绩查询' },
      { key: 'export', label: '成绩导出', route: '/admin/scores/export', description: '完整版与脱敏版导出' },
      { key: 'publish', label: '成绩发布', route: '/admin/scores/publish', description: '发布时间与发布门禁' },
    ],
  },
  {
    key: 'audit',
    label: '留痕管理',
    icon: 'Document',
    baseRoute: '/admin/audit',
    children: [
      { key: 'log', label: '日志审计', route: '/admin/audit/log', description: '核心操作追踪日志' },
      { key: 'feedback', label: '意见反馈', route: '/admin/audit/feedback', description: '角色反馈与工单闭环' },
    ],
  },
]

const menuMap = new Map(adminMenus.map((item) => [item.key, item]))

const buildRelated = (moduleKey: string, sectionKey: string): LinkItem[] =>
  menuMap
    .get(moduleKey)!
    .children.filter((item) => item.key !== sectionKey)
    .map((item) => ({ label: item.label, route: item.route, description: item.description }))

const createSection = (
  moduleKey: string,
  sectionKey: string,
  config: Omit<AdminSectionView, 'moduleKey' | 'sectionKey' | 'groupLabel' | 'sectionLabel' | 'related'>,
): AdminSectionView => {
  const group = menuMap.get(moduleKey)!
  const child = group.children.find((item) => item.key === sectionKey)!

  return {
    moduleKey,
    sectionKey,
    groupLabel: group.label,
    sectionLabel: child.label,
    related: buildRelated(moduleKey, sectionKey),
    ...config,
  }
}

const sectionMap: Record<string, Record<string, AdminSectionView>> = {
  dashboard: {
    overview: createSection('dashboard', 'overview', {
      title: '管理员总览看板',
      description: '聚合账号、场次、阅卷、成绩发布和资源归档的关键指标，适合演示管理员的全局视角。',
      badge: '核心总览',
      emphasis: '七年级复赛还差 32 份主观题评分完成，完成后即可正式开启 score_publish_time。',
      actions: [
        { label: '进入场次配置', tone: 'primary', route: '/admin/sessions/config' },
        { label: '查看成绩发布', tone: 'warning', route: '/admin/scores/publish' },
        { label: '导出今日简报', message: '演示态已导出今日运营简报。' },
      ],
      metrics: [
        { label: '今日在线考生', value: '1,286', hint: '较昨日同时间 +9.4%', trend: '+109', tone: 'primary' },
        { label: '待批复查', value: '18', hint: '高亮提醒已同步评卷端', trend: '+4', tone: 'warning' },
        { label: '待归档凭证', value: '27', hint: '评分表扫描件待上传', trend: '-3', tone: 'danger' },
        { label: '可发训练号', value: '3,240', hint: '覆盖小学与初中策略', trend: '+260', tone: 'success' },
      ],
      highlights: [
        { title: '成绩发布时间门禁', content: '学生端仅在评卷完成、开关开启且到达发布时间后才可见成绩。', tag: '必检规则', tone: 'danger', route: '/admin/scores/publish' },
        { title: '快捷组卷落点', content: '教师端快捷组卷入口已映射到题库管理 / 组卷管理。', tag: '架构对齐', tone: 'primary', route: '/admin/question-bank/builder' },
        { title: '复查申请高亮', content: '评卷老师端的待处理复查申请已与复核管理形成闭环。', tag: '体验闭环', tone: 'warning', route: '/admin/review/recheck' },
      ],
      progress: [
        { label: '七年级复赛阅卷进度', value: 428, total: 460, note: '剩余 32 份主观题待评分', tone: 'warning' },
        { label: '评分凭证归档进度', value: 93, total: 120, note: '27 份扫描件尚未上传', tone: 'danger' },
      ],
      table: {
        title: '重点场次追踪',
        description: '帮助你一眼看到哪个场次值得优先处理。',
        columns: [
          { key: 'session', label: '场次名称' },
          { key: 'stage', label: '学段' },
          { key: 'review', label: '阅卷进度' },
          { key: 'publish', label: '发布时间' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 待发布: 'warning', 监控中: 'primary', 已完成: 'success' } },
        ],
        rows: [
          { session: '七年级 AI 复赛', stage: '初中', review: '93%', publish: '2026-04-01 09:00', status: '待发布' },
          { session: '小学创新训练营', stage: '小学', review: '100%', publish: '2026-03-29 18:00', status: '监控中' },
          { session: '教师模拟考', stage: '初中', review: '100%', publish: '2026-03-26 20:00', status: '已完成' },
        ],
      },
      timeline: {
        title: '今日时间轴',
        description: '用来演示管理员一天会跟进哪些关键动作。',
        items: [
          { time: '09:00', title: '白名单模板下发', description: '已向 12 所学校发送最新版导入模板。', tone: 'primary' },
          { time: '11:30', title: '评卷催办发送', description: '系统自动提醒 6 名评卷老师补齐主观题评分。', tone: 'warning' },
          { time: '15:00', title: '成绩发布时间复核', description: '等待管理员确认后开放学生成绩入口。', tone: 'danger' },
        ],
      },
    }),
    todo: createSection('dashboard', 'todo', {
      title: '今日待办任务',
      description: '把跨模块的重要事项集中管理，适合演示管理员的日常执行链路。',
      badge: '待办清单',
      emphasis: '优先级最高的两项分别是“成绩发布时间确认”和“复查申请批量流转”。',
      actions: [
        { label: '批量处理复查', tone: 'warning', route: '/admin/review/recheck' },
        { label: '进入发布门禁', tone: 'primary', route: '/admin/scores/publish' },
      ],
      metrics: [
        { label: '高优先待办', value: '6', hint: '均需今日 18:00 前完成', tone: 'danger' },
        { label: '自动任务完成', value: '12', hint: '系统已自动发起催办', tone: 'success' },
        { label: '跨校协同事项', value: '4', hint: '涉及教务与评卷组', tone: 'warning' },
        { label: '已关闭工单', value: '9', hint: '本周累计处理完成', tone: 'primary' },
      ],
      highlights: [
        { title: '成绩发布确认', content: '七年级 AI 复赛已基本满足条件，仅缺最后一轮评分完成。', tag: '立即处理', tone: 'danger', route: '/admin/scores/publish' },
        { title: '白名单补录', content: '54 条学生记录尚未绑定指导老师，影响训练账号发放。', tag: '协同处理', tone: 'primary', route: '/admin/import/complete' },
      ],
      list: {
        title: '任务清单',
        description: '点击卡片可继续跳转到对应二级页面体验。',
        items: [
          { title: '确认七年级复赛发布时间', description: '核验评分完成率、复查清单和发布时间。', meta: '截止 17:30', tone: 'danger', route: '/admin/scores/publish' },
          { title: '批量审批复查申请', description: '统一流转到评卷老师与专家组。', meta: '截止 16:00', tone: 'warning', route: '/admin/review/recheck' },
          { title: '补齐指导老师映射', description: '完善导入名单中的教师绑定。', meta: '截止 18:00', tone: 'primary', route: '/admin/import/complete' },
        ],
      },
      timeline: {
        title: '催办记录',
        description: '帮助体验待办与系统自动化提醒的关系。',
        items: [
          { time: '08:45', title: '已提醒 6 名评卷老师', description: '剩余主观题评分未完成，消息已同步到评卷看板。', tone: 'warning' },
          { time: '10:20', title: '已通知 3 位教务老师', description: '导入批次存在格式异常，需要重新上传。', tone: 'primary' },
        ],
      },
    }),
  },
  import: {
    roster: createSection('import', 'roster', {
      title: '名单导入',
      description: '支持下载标准模板、批量导入报名名单、考试白名单与指导老师信息。',
      badge: '数据导入',
      emphasis: '导入后会自动校验身份证号唯一性、学段合法性与场次归属。',
      actions: [
        { label: '下载导入模板', tone: 'primary', message: '演示态已下载最新版 Excel 模板。' },
        { label: '查看补全任务', route: '/admin/import/complete' },
      ],
      metrics: [
        { label: '今日导入批次', value: '8', hint: '成功 6 批，失败 2 批', tone: 'primary' },
        { label: '成功记录', value: '1,126', hint: '自动建库完成', tone: 'success' },
        { label: '异常记录', value: '54', hint: '需手工补全字段', tone: 'warning' },
        { label: '重复身份证', value: '3', hint: '已阻断重复导入', tone: 'danger' },
      ],
      highlights: [
        { title: '模板口径提醒', content: '请使用最新 v1.4 模板，旧模板已不支持发布时间字段。', tag: '导入规范', tone: 'warning' },
        { title: '自动建库', content: '导入成功后会自动建立学生、教师与场次关联基础数据。', tag: '系统行为', tone: 'primary' },
      ],
      table: {
        title: '导入批次',
        description: '演示最近导入批次。',
        columns: [
          { key: 'batch', label: '批次号' },
          { key: 'type', label: '导入类型' },
          { key: 'count', label: '记录数' },
          { key: 'status', label: '结果', kind: 'tag', tones: { 成功: 'success', 部分异常: 'warning', 失败: 'danger' } },
        ],
        rows: [
          { batch: 'IMP-20260327-01', type: '初中白名单', count: '320', status: '成功' },
          { batch: 'IMP-20260327-02', type: '小学报名名单', count: '268', status: '部分异常' },
          { batch: 'IMP-20260327-04', type: '考试白名单', count: '92', status: '失败' },
        ],
      },
      list: {
        title: '导入校验规则',
        description: '便于讲解管理员导入页的业务边界。',
        items: [
          { title: '身份证号唯一', description: '同一项目编码下不允许重复导入相同身份证号。', meta: '强校验', tone: 'danger' },
          { title: '学段场次匹配', description: '导入场次必须与学段一致，否则整批阻断。', meta: '强校验', tone: 'warning' },
          { title: '指导老师可后补', description: '允许学生名单先导入，再在补全页绑定教师。', meta: '柔性处理', tone: 'primary', route: '/admin/import/complete' },
        ],
      },
    }),
    complete: createSection('import', 'complete', {
      title: '名单补全',
      description: '处理导入后遗留的空字段、教师映射与场次归属异常。',
      badge: '数据补齐',
      emphasis: '当前有 54 条学生记录缺失指导老师，不处理会影响训练账号发放。',
      actions: [
        { label: '批量绑定教师', tone: 'primary', message: '演示态已完成 12 条记录的批量绑定。' },
        { label: '回看导入批次', route: '/admin/import/roster' },
      ],
      metrics: [
        { label: '待补全记录', value: '54', hint: '其中 41 条缺指导老师', tone: 'warning' },
        { label: '已自动修复', value: '16', hint: '来自同校教师映射规则', tone: 'success' },
        { label: '需人工确认', value: '11', hint: '证件号与姓名疑似冲突', tone: 'danger' },
        { label: '已生成账号', value: '1,072', hint: '补全后自动创建', tone: 'primary' },
      ],
      highlights: [
        { title: '教师映射建议', content: '同学校、同项目编码可使用快捷匹配提升补全效率。', tag: '效率提升', tone: 'primary' },
        { title: '风险记录', content: '11 条记录存在证件号与姓名不一致，需要人工核对。', tag: '人工确认', tone: 'danger' },
      ],
      table: {
        title: '待补全明细',
        description: '演示部分待处理数据。',
        columns: [
          { key: 'student', label: '学生' },
          { key: 'school', label: '学校' },
          { key: 'issue', label: '待补字段' },
          { key: 'status', label: '处理状态', kind: 'tag', tones: { 待处理: 'warning', 已修复: 'success', 待核验: 'danger' } },
        ],
        rows: [
          { student: '梁子墨', school: '南宁实验学校', issue: '指导老师为空', status: '待处理' },
          { student: '黄诗琪', school: '柳州创新小学', issue: '项目编码缺失', status: '待核验' },
          { student: '陈宇辰', school: '北海一小', issue: '教师手机号为空', status: '已修复' },
        ],
      },
      timeline: {
        title: '补全处理轨迹',
        description: '便于管理员理解自动修复与人工确认的边界。',
        items: [
          { time: '12:20', title: '自动回填教师手机号', description: '依据历史档案自动修复 6 条记录。', tone: 'success' },
          { time: '11:05', title: '发现身份证号冲突', description: '系统阻断 3 条重复记录并标记人工确认。', tone: 'danger' },
        ],
      },
    }),
  },
  'question-bank': {
    directory: createSection('question-bank', 'directory', {
      title: '目录管理',
      description: '按学段、套卷、知识点维护题库目录，支撑训练与考试统一出题。',
      badge: '目录配置',
      emphasis: '目录命名尽量简洁，不建议频繁调整，避免影响已有组卷模板。',
      actions: [
        { label: '新增目录', tone: 'primary', message: '演示态已创建“Python 进阶”目录。' },
        { label: '进入组卷管理', route: '/admin/question-bank/builder' },
      ],
      metrics: [
        { label: '题库目录数', value: '28', hint: '小学 12，初中 16', tone: 'primary' },
        { label: '已发布套卷', value: '42', hint: '支持训练与考试共用', tone: 'success' },
        { label: '待审核目录', value: '5', hint: '新增目录需复核命名', tone: 'warning' },
        { label: '知识点标签', value: '186', hint: '支持多标签检索', tone: 'info' },
      ],
      highlights: [
        { title: '目录层级规范', content: '建议保持“学段 / 套卷 / 知识点”三级结构。', tag: '结构建议', tone: 'primary' },
        { title: '发布提醒', content: '目录变更后需同步检查已发布套卷引用关系。', tag: '变更提醒', tone: 'warning' },
      ],
      table: {
        title: '目录一览',
        description: '使用简化表格展示目录与知识点覆盖。',
        columns: [
          { key: 'name', label: '目录名称' },
          { key: 'stage', label: '学段' },
          { key: 'papers', label: '套卷数' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 已发布: 'success', 草稿: 'warning' } },
        ],
        rows: [
          { name: 'Python 基础', stage: '小学', papers: '8', status: '已发布' },
          { name: '算法思维', stage: '初中', papers: '10', status: '已发布' },
          { name: 'AI 应用实践', stage: '初中', papers: '4', status: '草稿' },
        ],
      },
      list: {
        title: '目录规则',
        description: '方便你讲解题库目录的治理口径。',
        items: [
          { title: '目录名称保持四字为主', description: '便于左侧菜单和导出报表统一展示。', meta: '命名规范', tone: 'primary' },
          { title: '发布前检查引用', description: '避免下游套卷仍引用已停用目录。', meta: '发布流程', tone: 'warning' },
        ],
      },
    }),
    builder: createSection('question-bank', 'builder', {
      title: '组卷管理',
      description: '通过模板、权重与题型配比快速生成训练卷或正式考试卷。',
      badge: '组卷策略',
      emphasis: '教师端快捷组卷入口会直接跳转到本页对应能力。',
      actions: [
        { label: '新建组卷模板', tone: 'primary', message: '演示态已创建“初中 AI 复赛模板”。' },
        { label: '查看题目管理', route: '/admin/question-bank/question' },
      ],
      metrics: [
        { label: '模板数量', value: '14', hint: '正式考试 6，训练卷 8', tone: 'primary' },
        { label: '平均出卷时长', value: '3 分钟', hint: '模板化后显著降低', tone: 'success' },
        { label: '待复核模板', value: '2', hint: '题型权重需确认', tone: 'warning' },
        { label: '快捷组卷入口', value: '已开启', hint: '教师端可直达', tone: 'info' },
      ],
      highlights: [
        { title: '快捷组卷落点', content: '教师端看板快捷入口已与本页保持一致。', tag: '架构对齐', tone: 'primary' },
        { title: '评分规则提醒', content: '多选题严格执行少选全对得 1 分，多选/错选不得分。', tag: '评分口径', tone: 'warning' },
      ],
      table: {
        title: '组卷模板',
        description: '演示模板覆盖训练与考试两类用途。',
        columns: [
          { key: 'template', label: '模板名称' },
          { key: 'usage', label: '用途' },
          { key: 'questionCount', label: '题量' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 生效中: 'success', 待复核: 'warning' } },
        ],
        rows: [
          { template: '初中 AI 复赛模板', usage: '正式考试', questionCount: '40', status: '生效中' },
          { template: '小学春季训练卷', usage: '训练卷', questionCount: '25', status: '生效中' },
          { template: '算法冲刺套卷', usage: '训练卷', questionCount: '30', status: '待复核' },
        ],
      },
      progress: [
        { label: '主观题占比配置', value: 35, total: 100, note: '符合当前比赛评分方案', tone: 'primary' },
        { label: '客观题配分完成度', value: 100, total: 100, note: '多选规则已写入模板', tone: 'success' },
      ],
    }),
    question: createSection('question-bank', 'question', {
      title: '题目管理',
      description: '管理题目录入、解析、标签与评分规则，为后续组卷与考试提供基础数据。',
      badge: '题目录入',
      emphasis: '客观题与主观题统一维护在此，主观题需补齐附件要求与评分说明。',
      actions: [
        { label: '新增题目', tone: 'primary', message: '演示态已打开题目录入表单。' },
        { label: '进入目录管理', route: '/admin/question-bank/directory' },
      ],
      metrics: [
        { label: '题目总数', value: '1,486', hint: '主观题占比 24%', tone: 'primary' },
        { label: '待完善解析', value: '18', hint: '建议优先补齐图文解析', tone: 'warning' },
        { label: '已打标签', value: '1,430', hint: '知识点检索完善', tone: 'success' },
        { label: '需复核分值', value: '7', hint: '多选题规则待确认', tone: 'danger' },
      ],
      highlights: [
        { title: '主观题说明', content: '建议在题目中明确附件格式、字数限制与评分维度。', tag: '命题建议', tone: 'primary' },
        { title: '评分规则提醒', content: '主观题最终分统一按平均分聚合。', tag: '统分规则', tone: 'warning' },
      ],
      table: {
        title: '题目样例',
        description: '用简化表格演示题型与分值信息。',
        columns: [
          { key: 'question', label: '题目名称' },
          { key: 'type', label: '题型' },
          { key: 'score', label: '分值' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 已发布: 'success', 待复核: 'warning' } },
        ],
        rows: [
          { question: 'Python 变量与输入输出', type: '单选题', score: '2', status: '已发布' },
          { question: 'AI 创作方案设计', type: '主观题', score: '15', status: '待复核' },
          { question: '多选：算法复杂度', type: '多选题', score: '4', status: '已发布' },
        ],
      },
      timeline: {
        title: '最近维护记录',
        description: '帮助你说明题库不是静态数据。',
        items: [
          { time: '03-27 14:10', title: '新增主观题 3 道', description: '补齐 AI 应用实践模块训练题。', tone: 'primary' },
          { time: '03-27 11:45', title: '修复多选题评分规则', description: '改为项目既定计分规则。', tone: 'warning' },
        ],
      },
    }),
  },
  sessions: {
    config: createSection('sessions', 'config', {
      title: '场次配置',
      description: '配置考试开始时间、结束时间、阅卷截止时间与成绩发布时间门禁。',
      badge: '时间轴控制',
      emphasis: '只有在全部主观题评分完成后，管理员才可正式设置并开启发布时间。',
      actions: [
        { label: '新建考试场次', tone: 'primary', message: '演示态已创建“2026 春季体验场”。' },
        { label: '进入成绩发布', route: '/admin/scores/publish' },
      ],
      metrics: [
        { label: '进行中场次', value: '3', hint: '含 1 个正式考试场次', tone: 'primary' },
        { label: '待配置发布', value: '2', hint: '尚未确认发布时间', tone: 'warning' },
        { label: '可延期场次', value: '1', hint: '评卷压力较高可延后', tone: 'danger' },
        { label: '已完成场次', value: '12', hint: '均已写入操作日志', tone: 'success' },
      ],
      highlights: [
        { title: '发布时间门禁', content: '学生页只有在 REVIEWED + 开关开启 + 时间到达时才可见成绩。', tag: '核心规则', tone: 'danger', route: '/admin/scores/publish' },
        { title: '灵活延期', content: '管理员可在考后针对阅卷压力一键延长阅卷截止时间。', tag: '时间轴能力', tone: 'primary' },
      ],
      table: {
        title: '场次清单',
        description: '演示起止时间、阅卷截止与发布时间。',
        columns: [
          { key: 'session', label: '场次名称' },
          { key: 'window', label: '考试时段' },
          { key: 'deadline', label: '阅卷截止' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 进行中: 'primary', 待发布: 'warning', 已完成: 'success' } },
        ],
        rows: [
          { session: '七年级 AI 复赛', window: '03-30 09:00 ~ 11:00', deadline: '03-31 18:00', status: '待发布' },
          { session: '小学创新训练营', window: '03-28 14:00 ~ 15:00', deadline: '03-29 12:00', status: '进行中' },
          { session: '教师模拟考', window: '03-25 19:00 ~ 20:30', deadline: '03-26 10:00', status: '已完成' },
        ],
      },
      details: [
        { label: '发布时间字段', value: 'score_publish_time', tone: 'primary' },
        { label: '单人补时策略', value: '按场次单独配置' },
        { label: '默认阅卷缓冲', value: '考试结束后 +24 小时', tone: 'warning' },
      ],
    }),
    monitor: createSection('sessions', 'monitor', {
      title: '考场监控',
      description: '以大盘形式追踪在线人数、交卷人数、异常掉线与设备告警。',
      badge: '监控大盘',
      emphasis: '当前八年级场次有 3 名考生存在频繁掉线，建议核查机房网络。',
      actions: [
        { label: '进入白名单管理', route: '/admin/sessions/whitelist' },
        { label: '导出监控快照', message: '演示态已导出监控截图。' },
      ],
      metrics: [
        { label: '当前在线', value: '826', hint: '实时监控中', tone: 'success' },
        { label: '已交卷', value: '431', hint: '交卷率 52.1%', tone: 'primary' },
        { label: '异常掉线', value: '7', hint: '含 3 例高频波动', tone: 'danger' },
        { label: '风险终端', value: '12', hint: '涉及重复登录', tone: 'warning' },
      ],
      highlights: [
        { title: '高风险考场', content: '南宁实验学校机房 B 掉线频率明显偏高。', tag: '重点排查', tone: 'danger' },
        { title: '交卷走势', content: '预计 20 分钟后将迎来交卷高峰。', tag: '趋势判断', tone: 'primary' },
      ],
      progress: [
        { label: '小学训练营交卷率', value: 286, total: 320, note: '预计 10 分钟内全部完成', tone: 'success' },
        { label: '异常事件处理率', value: 18, total: 25, note: '尚有 7 条待处理', tone: 'warning' },
      ],
      list: {
        title: '最新告警',
        description: '系统将最重要的现场告警置顶展示。',
        items: [
          { title: '机房 B 掉线告警', description: '3 分钟内连续 3 名考生掉线并重连。', meta: '03-27 14:05', tone: 'danger' },
          { title: '设备重复登录', description: '考试账号出现在两台设备上，系统已阻断。', meta: '03-27 13:52', tone: 'warning' },
          { title: '异步算分扩容', description: 'RabbitMQ 消费者已自动提升并发阈值。', meta: '03-27 13:40', tone: 'primary' },
        ],
      },
      timeline: {
        title: '监控事件流',
        description: '用于回溯考试过程中的关键事件。',
        items: [
          { time: '14:05', title: '掉线告警升级', description: '已触发短信通知至现场监考老师。', tone: 'danger' },
          { time: '13:40', title: '异步算分扩容', description: '系统自动扩容队列消费者。', tone: 'primary' },
        ],
      },
    }),
    whitelist: createSection('sessions', 'whitelist', {
      title: '白名单管理',
      description: '控制哪些考生可进入对应场次，并支持个别考生单人补时。',
      badge: '准入控制',
      emphasis: '白名单、场次与学段必须完全匹配，跨场次登录将被严格阻断。',
      actions: [
        { label: '批量导入白名单', tone: 'primary', route: '/admin/import/roster' },
        { label: '设置单人补时', message: '演示态已为 2 名考生增加 15 分钟补时。' },
      ],
      metrics: [
        { label: '白名单人数', value: '1,580', hint: '覆盖 6 个场次', tone: 'primary' },
        { label: '已批准补时', value: '9', hint: '均已同步到考试端', tone: 'success' },
        { label: '阻断登录', value: '11', hint: '跨场次或名单缺失', tone: 'danger' },
        { label: '待审核申请', value: '3', hint: '机房异常补时申请', tone: 'warning' },
      ],
      highlights: [
        { title: '补时规则', content: '单人补时仅作用于考生本人，不影响全场时间轴。', tag: '时间控制', tone: 'primary' },
        { title: '准入阻断', content: '未到开始时间、跨场次登录或不在名单都会被阻断。', tag: '门禁规则', tone: 'danger' },
      ],
      table: {
        title: '白名单明细',
        description: '演示部分准入与补时信息。',
        columns: [
          { key: 'student', label: '考生' },
          { key: 'session', label: '对应场次' },
          { key: 'extra', label: '补时' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 已准入: 'success', 待审核: 'warning', 已阻断: 'danger' } },
        ],
        rows: [
          { student: '梁子墨', session: '七年级 AI 复赛', extra: '15 分钟', status: '已准入' },
          { student: '苏梓涵', session: '七年级 AI 复赛', extra: '待审批', status: '待审核' },
          { student: '陈宇辰', session: '八年级算法赛', extra: '0 分钟', status: '已阻断' },
        ],
      },
      list: {
        title: '审批建议',
        description: '帮助管理员快速判断补时与准入场景。',
        items: [
          { title: '机房故障类补时', description: '优先依据监控告警与现场反馈确认后批准。', meta: '建议补时 10~20 分钟', tone: 'warning' },
          { title: '跨场次误登录', description: '无需补时，直接阻断并引导到正确场次。', meta: '强阻断', tone: 'danger' },
          { title: '临时设备登录', description: '确认白名单后允许替换设备，并记录日志。', meta: '可人工放行', tone: 'primary' },
        ],
      },
    }),
  },
  resources: {
    center: createSection('resources', 'center', {
      title: '资源中心',
      description: '集中管理讲义、示例代码、课件与训练附件，并控制仅预览不下载。',
      badge: '资源仓库',
      emphasis: '所有资源默认仅支持在线预览，保障版权与赛事材料安全。',
      actions: [
        { label: '上传资源', tone: 'primary', message: '演示态已上传 1 份示例课件。' },
        { label: '查看资源分类', route: '/admin/resources/category' },
      ],
      metrics: [
        { label: '资源总量', value: '368', hint: '文档、视频、代码混合存放', tone: 'primary' },
        { label: '在线预览率', value: '100%', hint: '全部资源禁下载', tone: 'success' },
        { label: '待审核版权', value: '6', hint: '需补充授权信息', tone: 'warning' },
        { label: '本周上传', value: '24', hint: '教师贡献 18 份', tone: 'info' },
      ],
      highlights: [
        { title: 'MinIO 存储', content: '资源统一存放在 Docker 内的 MinIO，便于预览与权限控制。', tag: '技术口径', tone: 'primary' },
        { title: '版权提醒', content: '带第三方素材的课件必须先补齐授权说明再开放。', tag: '审核必读', tone: 'warning' },
      ],
      table: {
        title: '资源列表',
        description: '展示资源名称、分类与预览控制。',
        columns: [
          { key: 'name', label: '资源名称' },
          { key: 'category', label: '分类' },
          { key: 'type', label: '类型' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 已发布: 'success', 待审核: 'warning' } },
        ],
        rows: [
          { name: 'Python 入门讲义', category: '基础课程', type: 'PDF', status: '已发布' },
          { name: 'AI 创意案例视频', category: '案例资源', type: 'MP4', status: '已发布' },
          { name: '算法竞赛讲评课件', category: '教师教研', type: 'PPT', status: '待审核' },
        ],
      },
      list: {
        title: '资源处理建议',
        description: '帮助体验资源中心的业务边界。',
        items: [
          { title: '上传后自动转码', description: '视频资源上传后进入异步处理，完成后开放预览。', meta: '后台异步任务', tone: 'primary' },
          { title: '敏感素材先审核', description: '涉及赛事评分标准的文件需管理员先审后发。', meta: '权限前置', tone: 'warning' },
          { title: '统一在线预览', description: '前端不提供下载按钮，防止内容流失。', meta: '版权保护', tone: 'danger' },
        ],
      },
    }),
    category: createSection('resources', 'category', {
      title: '资源分类',
      description: '维护四级目录分类、标签口径与资源授权说明，保证检索一致。',
      badge: '分类规则',
      emphasis: '分类命名建议保持 4 字为主，避免影响侧栏展示与检索体验。',
      actions: [
        { label: '新增分类', tone: 'primary', message: '演示态已新增“AI 实战案例”分类。' },
        { label: '返回资源中心', route: '/admin/resources/center' },
      ],
      metrics: [
        { label: '一级分类', value: '6', hint: '课程、题库、案例等', tone: 'primary' },
        { label: '四级目录', value: '42', hint: '满足细颗粒度检索', tone: 'success' },
        { label: '待合并分类', value: '3', hint: '命名重复或颗粒度过细', tone: 'warning' },
        { label: '授权说明缺失', value: '6', hint: '分类层面需补文案', tone: 'danger' },
      ],
      highlights: [
        { title: '命名建议', content: '分类名尽量简洁，不超过 5 个字。', tag: '命名规范', tone: 'primary' },
        { title: '授权说明', content: '教师教研类分类建议统一补齐“仅内部使用”说明。', tag: '内容合规', tone: 'warning' },
      ],
      table: {
        title: '分类清单',
        description: '演示部分一级与二级分类情况。',
        columns: [
          { key: 'category', label: '分类名称' },
          { key: 'level', label: '层级' },
          { key: 'count', label: '资源数' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 正常: 'success', 待合并: 'warning', 待补充: 'danger' } },
        ],
        rows: [
          { category: '基础课程', level: '一级', count: '82', status: '正常' },
          { category: '教师教研', level: '一级', count: '38', status: '待补充' },
          { category: '冲刺讲评', level: '二级', count: '12', status: '待合并' },
        ],
      },
      details: [
        { label: '默认预览策略', value: '仅预览' },
        { label: '目录层级', value: '最多四级' },
        { label: '命名长度建议', value: '4 字为主', tone: 'primary' },
      ],
    }),
  },
  review: {
    tasks: createSection('review', 'tasks', {
      title: '阅卷任务',
      description: '管理员可按场次、题型为评卷老师分配任务，并实时查看完成进度。',
      badge: '任务分配',
      emphasis: '当前七年级复赛剩余 32 份主观题待阅，系统已向相关老师发出催办提醒。',
      actions: [
        { label: '重新分配任务', tone: 'primary', message: '演示态已重新均分 12 份试卷。' },
        { label: '查看复核管理', route: '/admin/review/recheck' },
      ],
      metrics: [
        { label: '待阅试卷', value: '32', hint: '集中在两位老师名下', tone: 'warning' },
        { label: '已阅完成', value: '428', hint: '完成率 93%', tone: 'success' },
        { label: '参与老师', value: '12', hint: '平均每人 38 份', tone: 'primary' },
        { label: '超时风险', value: '2', hint: '可能影响成绩发布时间', tone: 'danger' },
      ],
      highlights: [
        { title: '平均分口径', content: '主观题最终成绩统一按平均分计算。', tag: '评分规则', tone: 'primary' },
        { title: '任务均衡建议', content: '建议将剩余任务从高负载老师转派给空闲老师。', tag: '效率优化', tone: 'warning' },
      ],
      table: {
        title: '阅卷任务分配',
        description: '简化展示老师任务量与完成度。',
        columns: [
          { key: 'teacher', label: '评卷老师' },
          { key: 'session', label: '场次' },
          { key: 'assigned', label: '分配量' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 正常: 'success', 需催办: 'warning', 风险: 'danger' } },
        ],
        rows: [
          { teacher: '陈老师', session: '七年级 AI 复赛', assigned: '42', status: '需催办' },
          { teacher: '黄老师', session: '七年级 AI 复赛', assigned: '42', status: '风险' },
          { teacher: '周老师', session: '小学创新训练营', assigned: '36', status: '正常' },
        ],
      },
      progress: [
        { label: '七年级复赛评分完成度', value: 428, total: 460, note: '再完成 32 份即可进入发布时间确认', tone: 'warning' },
        { label: '小学训练营评分完成度', value: 320, total: 320, note: '已满足发布条件', tone: 'success' },
      ],
    }),
    recheck: createSection('review', 'recheck', {
      title: '复核管理',
      description: '受理学生复查申请、批量流转至评卷老师或专家组，并跟踪处理结果。',
      badge: '申诉闭环',
      emphasis: '评卷端看板中的“待处理复查申请”高亮提醒，会直接跳转到与本页对应的申诉处理场景。',
      actions: [
        { label: '批量通过申请', tone: 'primary', message: '演示态已通过 8 份复查申请并流转专家组。' },
        { label: '查看成绩发布', route: '/admin/scores/publish' },
      ],
      metrics: [
        { label: '待处理申请', value: '18', hint: '高优先级 6 份', tone: 'danger' },
        { label: '处理中申请', value: '11', hint: '已流转至老师或专家组', tone: 'warning' },
        { label: '已结案申请', value: '49', hint: '闭环率 100%', tone: 'success' },
        { label: '更正成绩', value: '5', hint: '需同步重算总分', tone: 'primary' },
      ],
      highlights: [
        { title: '高亮提醒对齐', content: '评卷老师首页提醒入口已与本页申诉处理形成闭环。', tag: '架构落地', tone: 'primary' },
        { title: '强制留痕', content: '无论维持原判还是重判，都必须填写复查意见与理由。', tag: '审计要求', tone: 'danger' },
      ],
      table: {
        title: '复查工单',
        description: '管理员可在此批量筛选并分发。',
        columns: [
          { key: 'ticket', label: '工单号' },
          { key: 'student', label: '学生' },
          { key: 'session', label: '场次' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 待处理: 'danger', 已流转: 'warning', 已结案: 'success' } },
        ],
        rows: [
          { ticket: 'RC-20260327-01', student: '梁子墨', session: '七年级 AI 复赛', status: '待处理' },
          { ticket: 'RC-20260327-02', student: '黄诗琪', session: '小学创新训练营', status: '已流转' },
          { ticket: 'RC-20260327-04', student: '陈宇辰', session: '教师模拟考', status: '已结案' },
        ],
      },
      timeline: {
        title: '复查处理轨迹',
        description: '帮助管理员快速理解一份复查工单的生命周期。',
        items: [
          { time: '09:30', title: '学生发起复查', description: '提交理由并附带问题说明。', tone: 'warning' },
          { time: '10:00', title: '管理员初审通过', description: '系统自动流转到评卷老师工作台。', tone: 'primary' },
          { time: '14:20', title: '专家复核完成', description: '形成维持原判或更正成绩的结论。', tone: 'success' },
        ],
      },
    }),
    retention: createSection('review', 'retention', {
      title: '凭证留存',
      description: '上传纸质评分表扫描件、关联试卷并归档留痕。',
      badge: '凭证归档',
      emphasis: '该页面是纸质评分表扫描件留存的明确落点，管理员端与评卷端都可访问。',
      actions: [
        { label: '上传扫描件', tone: 'primary', message: '演示态已上传 3 份评分表扫描件。' },
        { label: '查看复查工单', route: '/admin/review/recheck' },
      ],
      metrics: [
        { label: '待归档扫描件', value: '27', hint: '需在成绩发布时间前补齐', tone: 'danger' },
        { label: '已归档凭证', value: '93', hint: '支持在线预览', tone: 'success' },
        { label: '关联试卷', value: '88', hint: '已绑定具体考生与题目', tone: 'primary' },
        { label: '预览通过率', value: '97%', hint: '剩余 3 份图片需重传', tone: 'warning' },
      ],
      highlights: [
        { title: '留存规则', content: '上传后需同时绑定场次、考生、题目与上传人。', tag: '归档必填', tone: 'primary' },
        { title: '发布时间依赖', content: '复查期若要向学生展示扫描件，应确保凭证已入库。', tag: '发布前检查', tone: 'warning' },
      ],
      table: {
        title: '凭证归档列表',
        description: '演示部分扫描件信息。',
        columns: [
          { key: 'paper', label: '试卷' },
          { key: 'student', label: '学生' },
          { key: 'uploader', label: '上传人' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 已归档: 'success', 待补传: 'warning', 预览失败: 'danger' } },
        ],
        rows: [
          { paper: 'PAPER-230018', student: '梁子墨', uploader: '陈老师', status: '已归档' },
          { paper: 'PAPER-230052', student: '苏梓涵', uploader: '黄老师', status: '待补传' },
          { paper: 'PAPER-230066', student: '陈宇辰', uploader: '李老师', status: '预览失败' },
        ],
      },
      details: [
        { label: '文件存储', value: 'MinIO 对象存储', tone: 'primary' },
        { label: '上传方式', value: '支持大文件分片与断点续传' },
        { label: '预览策略', value: '在线预览，不提供下载', tone: 'warning' },
      ],
    }),
  },
  scores: {
    query: createSection('scores', 'query', {
      title: '成绩查询',
      description: '查看考试总分、客观题与主观题明细，并联动复查与凭证信息。',
      badge: '成绩总览',
      emphasis: '学生端成绩仅在评卷完成、发布开关开启且到达发布时间后才可见。',
      actions: [
        { label: '查看成绩发布', tone: 'primary', route: '/admin/scores/publish' },
        { label: '查看复查工单', route: '/admin/review/recheck' },
      ],
      metrics: [
        { label: '已生成成绩', value: '1,204', hint: '总分均已完成合成', tone: 'success' },
        { label: '待发布成绩', value: '428', hint: '发布时间未到或未确认', tone: 'warning' },
        { label: '复查锁定成绩', value: '18', hint: '需复查完成后再发布', tone: 'danger' },
        { label: '成绩异常', value: '3', hint: '总分与分项不一致待排查', tone: 'primary' },
      ],
      highlights: [
        { title: '平均分统分', content: '所有主观题均按 AVG 计算后再与客观题成绩合成总分。', tag: '统分规则', tone: 'primary' },
        { title: '学生可见范围', content: '到时间后学生可查看总分、主观题得分及评分表扫描件。', tag: '展示范围', tone: 'warning' },
      ],
      table: {
        title: '成绩样例',
        description: '演示部分学生成绩记录。',
        columns: [
          { key: 'student', label: '学生' },
          { key: 'session', label: '场次' },
          { key: 'total', label: '总分' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 已完成: 'success', 待发布: 'warning', 复查中: 'danger' } },
        ],
        rows: [
          { student: '梁子墨', session: '七年级 AI 复赛', total: '96', status: '待发布' },
          { student: '黄诗琪', session: '小学创新训练营', total: '88', status: '已完成' },
          { student: '苏梓涵', session: '七年级 AI 复赛', total: '96', status: '复查中' },
        ],
      },
      list: {
        title: '查询建议',
        description: '帮助管理员快速判断成绩页里的关键入口。',
        items: [
          { title: '先核验发布条件', description: '未到发布时间的场次只建议管理员内部查询。', meta: '防止提前泄露', tone: 'warning', route: '/admin/scores/publish' },
          { title: '复查中成绩锁定', description: '复查工单未结案时不建议对外展示最终结论。', meta: '流程闭环', tone: 'danger', route: '/admin/review/recheck' },
          { title: '联动凭证预览', description: '可从查询页确认评分表扫描件是否已归档。', meta: '凭证联动', tone: 'primary', route: '/admin/review/retention' },
        ],
      },
    }),
    export: createSection('scores', 'export', {
      title: '成绩导出',
      description: '按学段、场次导出完整版与脱敏简化版 Excel 成绩表。',
      badge: '数据导出',
      emphasis: '导出前应确认复查工单已关闭，避免公示成绩与最终成绩不一致。',
      actions: [
        { label: '导出完整版', tone: 'primary', message: '演示态已导出完整版成绩表。' },
        { label: '导出脱敏版', message: '演示态已导出脱敏版成绩表。' },
      ],
      metrics: [
        { label: '可导出场次', value: '9', hint: '已满足成绩发布条件', tone: 'success' },
        { label: '待复查场次', value: '2', hint: '建议暂缓导出', tone: 'warning' },
        { label: '最近导出次数', value: '17', hint: '近 7 日累计', tone: 'primary' },
        { label: '脱敏模板', value: '3', hint: '支持公示与内部流转', tone: 'info' },
      ],
      highlights: [
        { title: '导出口径', content: '完整版保留评分细项，脱敏版仅展示名次和总分。', tag: '导出规则', tone: 'primary' },
        { title: '发布时间关联', content: '导出不等于开放学生查询，学生端仍受发布时间门禁控制。', tag: '门禁提醒', tone: 'warning' },
      ],
      table: {
        title: '导出记录',
        description: '帮助体验导出审计留痕。',
        columns: [
          { key: 'batch', label: '导出批次' },
          { key: 'session', label: '场次' },
          { key: 'template', label: '模板' },
          { key: 'status', label: '结果', kind: 'tag', tones: { 已完成: 'success', 处理中: 'warning' } },
        ],
        rows: [
          { batch: 'EXP-20260327-01', session: '教师模拟考', template: '完整版', status: '已完成' },
          { batch: 'EXP-20260327-02', session: '小学创新训练营', template: '脱敏版', status: '已完成' },
          { batch: 'EXP-20260327-03', session: '七年级 AI 复赛', template: '完整版', status: '处理中' },
        ],
      },
      timeline: {
        title: '导出流程',
        description: '便于你说明成绩导出的审核链路。',
        items: [
          { time: '步骤 1', title: '筛选场次与模板', description: '按学段、场次选择完整版或脱敏版。', tone: 'primary' },
          { time: '步骤 2', title: '核验复查状态', description: '系统发现未结案复查会提示暂缓导出。', tone: 'warning' },
          { time: '步骤 3', title: '写入操作日志', description: '导出动作自动进入日志审计。', tone: 'success' },
        ],
      },
    }),
    publish: createSection('scores', 'publish', {
      title: '成绩发布',
      description: '正式设置成绩公布时间、控制发布开关，并检查是否已满足前置条件。',
      badge: '发布门禁',
      emphasis: '本页是 score_publish_time 的前端落点，只有在全部主观题评分完成后才能正式启用。',
      actions: [
        { label: '设定发布时间', tone: 'primary', message: '演示态已设定七年级复赛发布时间为 2026-04-01 09:00。' },
        { label: '查看成绩查询', route: '/admin/scores/query' },
      ],
      metrics: [
        { label: '待发布场次', value: '2', hint: '一个场次已满足全部条件', tone: 'warning' },
        { label: '已启用开关', value: '7', hint: '学生端按时间自动开放', tone: 'success' },
        { label: '条件未满足', value: '1', hint: '仍有主观题待阅', tone: 'danger' },
        { label: '发布时间变更', value: '3', hint: '近 7 日管理员调整次数', tone: 'primary' },
      ],
      highlights: [
        { title: '前置条件检查', content: '需同时满足阅卷完成、复查处理完毕、开关开启和时间到达。', tag: '必检清单', tone: 'danger' },
        { title: '学生端提示', content: '到达发布时间前，学生页仅展示预计公布时间。', tag: '体验说明', tone: 'primary' },
      ],
      progress: [
        { label: '七年级复赛发布准备度', value: 92, total: 100, note: '仍差 32 份主观题评分完成', tone: 'warning' },
        { label: '小学训练营发布准备度', value: 100, total: 100, note: '可立即开启发布时间', tone: 'success' },
      ],
      table: {
        title: '发布状态',
        description: '管理员可先核验条件，再决定是否启用开关。',
        columns: [
          { key: 'session', label: '场次' },
          { key: 'reviewStatus', label: '阅卷完成' },
          { key: 'publishTime', label: '发布时间' },
          { key: 'status', label: '发布状态', kind: 'tag', tones: { 可发布: 'success', 待准备: 'warning', 已阻断: 'danger' } },
        ],
        rows: [
          { session: '七年级 AI 复赛', reviewStatus: '否', publishTime: '2026-04-01 09:00', status: '待准备' },
          { session: '小学创新训练营', reviewStatus: '是', publishTime: '2026-03-29 18:00', status: '可发布' },
          { session: '八年级算法赛', reviewStatus: '否', publishTime: '未设置', status: '已阻断' },
        ],
      },
      details: [
        { label: '发布时间字段', value: 'score_publish_time', tone: 'primary' },
        { label: '开关字段', value: 'score_publish_switch' },
        { label: '学生可见条件', value: 'REVIEWED + 开关开启 + 时间到达', tone: 'danger' },
        { label: '统分规则', value: 'AVG 平均分', tone: 'warning' },
      ],
    }),
  },
  audit: {
    log: createSection('audit', 'log', {
      title: '日志审计',
      description: '统一沉淀关键操作日志，覆盖场次修改、发布时间设置、导出、导入与凭证归档。',
      badge: '审计追溯',
      emphasis: '所有关键动作均必须写入 operation_log，便于赛后追责与问题复盘。',
      actions: [
        { label: '导出日志', tone: 'primary', message: '演示态已导出 7 日操作日志。' },
        { label: '查看意见反馈', route: '/admin/audit/feedback' },
      ],
      metrics: [
        { label: '今日日志量', value: '1,482', hint: '含自动任务与人工操作', tone: 'primary' },
        { label: '高风险操作', value: '9', hint: '涉及发布时间修改与批量导出', tone: 'warning' },
        { label: '失败请求', value: '12', hint: '均带 traceId 可回溯', tone: 'danger' },
        { label: '已归档日志', value: '100%', hint: '按天滚动归档', tone: 'success' },
      ],
      highlights: [
        { title: '关键日志范围', content: '场次开放、延时、成绩发布、导出、导入、激活码生成等都必须留痕。', tag: '审计范围', tone: 'primary' },
        { title: '链路追踪', content: '每个接口都应带 X-Request-Id，便于前后端串联排查。', tag: '排障手段', tone: 'warning' },
      ],
      table: {
        title: '最新审计日志',
        description: '演示 traceId、模块与结果。',
        columns: [
          { key: 'time', label: '时间' },
          { key: 'module', label: '模块' },
          { key: 'action', label: '动作' },
          { key: 'result', label: '结果', kind: 'tag', tones: { 成功: 'success', 失败: 'danger' } },
        ],
        rows: [
          { time: '03-27 14:12', module: '成绩发布', action: '设置发布时间', result: '成功' },
          { time: '03-27 13:40', module: '考场监控', action: '自动扩容消费者', result: '成功' },
          { time: '03-27 11:35', module: '激活记录', action: '冻结批次阻断', result: '失败' },
        ],
      },
      timeline: {
        title: '重点操作追踪',
        description: '协助管理员快速定位影响较大的动作。',
        items: [
          { time: '14:12', title: '发布时间设定', description: '管理员将七年级复赛发布时间设置为 04-01 09:00。', tone: 'warning' },
          { time: '11:35', title: '冻结批次使用阻断', description: '系统拒绝 1 次激活请求并上报日志。', tone: 'danger' },
        ],
      },
    }),
    feedback: createSection('audit', 'feedback', {
      title: '意见反馈',
      description: '承接教师、评卷老师和学生侧反馈工单，形成处理、回访与结案闭环。',
      badge: '反馈工单',
      emphasis: '建议把影响考试进行与成绩公开的问题优先升级处理，并同步记录回访结果。',
      actions: [
        { label: '新建工单', tone: 'primary', message: '演示态已创建 1 条平台反馈工单。' },
        { label: '查看日志审计', route: '/admin/audit/log' },
      ],
      metrics: [
        { label: '待处理工单', value: '14', hint: '高优先级 5 条', tone: 'danger' },
        { label: '处理中工单', value: '9', hint: '已分派到具体负责人', tone: 'warning' },
        { label: '已结案工单', value: '86', hint: '满意度 96%', tone: 'success' },
        { label: '重复反馈', value: '3', hint: '建议合并处理', tone: 'primary' },
      ],
      highlights: [
        { title: '优先级原则', content: '考试进行中、成绩发布前、复查闭环相关问题应优先处理。', tag: '分级规则', tone: 'warning' },
        { title: '回访要求', content: '结案前建议至少进行一次回访确认，避免问题再次打开。', tag: '服务闭环', tone: 'primary' },
      ],
      table: {
        title: '反馈工单',
        description: '用假数据展示工单状态与责任人。',
        columns: [
          { key: 'ticket', label: '工单号' },
          { key: 'source', label: '来源角色' },
          { key: 'title', label: '问题标题' },
          { key: 'status', label: '状态', kind: 'tag', tones: { 待处理: 'danger', 处理中: 'warning', 已结案: 'success' } },
        ],
        rows: [
          { ticket: 'FB-20260327-01', source: '教师', title: '快捷组卷入口点击后无权限提示', status: '处理中' },
          { ticket: 'FB-20260327-02', source: '学生', title: '成绩页预计公布时间文案不够明显', status: '待处理' },
          { ticket: 'FB-20260327-04', source: '管理员', title: '导出脱敏版字段顺序调整', status: '已结案' },
        ],
      },
      list: {
        title: '处理建议',
        description: '帮助你演示平台如何处理不同角色反馈。',
        items: [
          { title: '考试中断类问题', description: '立即升级到高优先级，并联动监控与白名单模块排查。', meta: '最高优先级', tone: 'danger', route: '/admin/sessions/monitor' },
          { title: '成绩展示类问题', description: '优先核对发布时间、复查状态和凭证留存是否完整。', meta: '发布前必查', tone: 'warning', route: '/admin/scores/publish' },
          { title: '教研体验建议', description: '可排入下次版本优化，不影响当前大赛流程。', meta: '常规优化', tone: 'primary' },
        ],
      },
    }),
  },
}

export const getAdminSectionView = (moduleKey: string, sectionKey: string): AdminSectionView => {
  const moduleSections = sectionMap[moduleKey]
  if (!moduleSections) {
    return sectionMap.dashboard.overview
  }

  return moduleSections[sectionKey] ?? Object.values(moduleSections)[0]
}
