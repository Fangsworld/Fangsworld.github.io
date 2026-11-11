type ProjectLink = {
  label: string;
  href: string;
};

export const projectCategories = [
  '英语学习',
  '写作训练',
  '个人管理',
  '知识库管理',
  '逻辑分析',
  '信息分析',
  '用户研究',
] as const;

export type Project = {
  slug: string;
  category: (typeof projectCategories)[number];
  name: string;
  platform: string;
  color: string;
  description: string;
  overview?: string;
  features: string[];
  publicUrl?: string;
  localUrl?: string;
  links?: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: 'maze-english',
    category: '英语学习',
    name: '迷宫英语',
    platform: 'Web / iPhone / macOS',
    color: '#176b9a',
    description: '用自己感兴趣的英文内容练英语。边读边查词，收藏生词，再跟着原声练听说。',
    overview: '迷宫英语把阅读、词汇和原声跟读放在一起。遇到生词，可以在原文里查意思，顺手把它加入词库。想练听说时，可以跟着原声逐句练习，把读懂的表达练到能说出来。',
    features: [
      '阅读英文材料，随文查词并收藏想复习的单词。',
      '用原声和双语字幕对照理解内容，逐句跟读。',
      '网页版从阅读页进入，另有 iPhone 和 macOS 客户端。',
    ],
    publicUrl: 'https://learn.yuwenpingye.com/reading',
    localUrl: 'http://127.0.0.1:5052/reading',
  },
  {
    slug: 'life-story',
    category: '个人管理',
    name: '人生故事',
    platform: 'iPhone',
    color: '#a24d35',
    description: '选出今天最重要的事，专注做一段，记下实际进展。每天留下一点可以回看的故事。',
    overview: '人生故事把计划、行动和回顾放在同一天里。早上选出今天最重要的事，做的时候留一段专注时间，结束后记下推进了什么。过一阵再翻回来，可以看到某件事是怎么一步步做成的。',
    features: [
      '用「今日三件事」定下重点，把专注记录关联到正在推进的事。',
      '专注结束后记下进展、卡点和结果。',
      '写下当天的故事，按日期回看过去的记录。',
    ],
    links: [
      { label: '技术支持', href: '/life-story/support' },
      { label: '隐私政策', href: '/life-story/privacy' },
    ],
  },
  {
    slug: 'family-files',
    category: '个人管理',
    name: '收好',
    platform: 'iPhone',
    color: '#ad4162',
    description: '整理 iPhone 相册里的相似照片、截图和重要资料。挑出想留的照片，找回需要的文件。',
    overview: '收好有两个入口。「相册」把相似照片和截图分组，方便一起看、挑选和收藏。「资料」从已授权的照片中识别证件、病历等文件，核对归档后可以按文字找回来。识别在设备上完成，删除照片由你确认。',
    features: [
      '浏览自动分组的照片，收藏喜欢的照片，也可以纠正分组。',
      '识别照片里的文字，核对后将重要资料归档。',
      '搜索已归档的资料，查看原图或分享为 PDF。',
    ],
  },
  {
    slug: 'note-keyboard',
    category: '写作训练',
    name: '笔记输入法',
    platform: 'iPhone',
    color: '#4f5fa3',
    description: '为 iPhone 上的日常中英混输设计。写中文时，可以顺手输入英文缩写、数字和标点。',
    overview: '在 iPhone 上回消息或记东西，一句话里常常会夹着英文缩写、数字和标点。笔记输入法从这些常见场景入手，把拼音、候选词和基本编辑放在同一套键盘里，减少来回切换。',
    features: [
      '支持中文拼音、英文、数字和标点。',
      '中文模式下可用 Shift 输入大写字母，方便输入 GitHub、API 等常见写法。',
      '提供拼音候选和基本编辑操作，便于修改输入。',
    ],
  },
  {
    slug: 'liantule',
    category: '英语学习',
    name: '练吐了',
    platform: 'iPhone',
    color: '#c14948',
    description: '从看稿到脱稿，分段练习英语演讲。',
    features: ['用带稿、跟读、半脱稿、脱稿四个阶段逐步减少提示。', '保留练习录音，使用设备端语音识别比较录音与原文。'],
  },
  {
    slug: 'encounter',
    category: '英语学习',
    name: '遇见',
    platform: 'iPhone / iPad',
    color: '#a33f68',
    description: '按心情阅读双语短文，听朗读，收藏喜欢的句子。',
    features: ['按心情切换短文，查看译文与写法赏析。', '慢速跟读，保存美句，也可以写下自己的回应。'],
  },
  {
    slug: 'listening',
    category: '英语学习',
    name: '倾听',
    platform: 'iPhone / iPad',
    color: '#6051a3',
    description: '用不同情景练习开口和回应的互动原型。',
    features: ['选择情景，查看预设角色回应与表达示例。', '支持系统朗读，互动由离线脚本驱动。'],
  },
  {
    slug: 'wordplay',
    category: '英语学习',
    name: '文字之谜',
    platform: 'iPhone / iPad',
    color: '#136d79',
    description: '通过更换英文词改变场景、完成目标的解谜游戏。',
    features: ['在不同关卡里尝试词语组合，观察场景变化。', '随时撤销或重开，卡住时可以逐级查看提示。'],
  },
  {
    slug: 'milo',
    category: '个人管理',
    name: 'Milo 米洛',
    platform: 'iPhone',
    color: '#2d7358',
    description: '把日常问答、写作和联网研究放进一个对话界面。',
    features: ['按任务选择直接回答或联网研究。', '查看来源与执行过程，从历史对话继续追问。'],
  },
  {
    slug: 'shiye',
    category: '知识库管理',
    name: '随手存',
    platform: 'iPhone',
    color: '#a15b24',
    description: '收藏读到的文章，集中整理、阅读和回顾。',
    features: ['从系统分享菜单或剪贴板收藏链接。', '搜索收藏，阅读正文，按需查看笔记、重点卡片和导图。'],
  },
  {
    slug: 'pocket-cinema',
    category: '写作训练',
    name: '脑洞片场',
    platform: 'iPhone',
    color: '#8d3e76',
    description: '把一个简短的故事点子变成一支 60 秒分镜短片。',
    features: ['从预设故事类型开始，编辑六个分镜的字幕。', '在设备上生成视频，保存草稿并通过系统分享。'],
  },
  {
    slug: 'yanjie',
    category: '写作训练',
    name: '言界写作',
    platform: 'macOS',
    color: '#765436',
    description: '围绕个人文风组织素材、写作与修订的工作台。',
    features: ['用不同体裁的模板搭建文章骨架。', '把灵感、研究素材和风格准则放进同一个写作流程。'],
  },
  {
    slug: 'maze-quant',
    category: '信息分析',
    name: '迷宫量化',
    platform: 'Web / iPhone / macOS',
    color: '#197363',
    description: '用于整理市场资料、研究交易策略和复盘的工具。',
    features: ['集中查看市场信息、财报与研究报告。', '用历史数据回测策略，整理研究与决策记录。'],
  },
  {
    slug: 'shannian',
    category: '写作训练',
    name: '闪念',
    platform: 'iPhone',
    color: '#9a6412',
    description: '随手捕捉灵感，把零散想法存成卡片。',
    features: ['创建和浏览灵感卡片。', '打开卡片继续补充和展开想法。'],
  },
  {
    slug: 'zhiku',
    category: '知识库管理',
    name: '知库 Zhiku',
    platform: 'macOS / Web',
    color: '#286957',
    description: '把笔记和网页剪藏整理成可搜索的本地 Markdown 知识库。',
    features: ['全文搜索、按标签筛选，并把网页正文保存为笔记。', '用 AI 摘要或提问，循引用回到原笔记。'],
  },
  {
    slug: 'logic-playground',
    category: '逻辑分析',
    name: '逻辑游乐场',
    platform: 'iPhone',
    color: '#325ca8',
    description: '用小游戏练习逻辑与数学的基本功。',
    features: ['在手机上完成逻辑与数学练习。', '通过逐个挑战积累解题经验。'],
  },
  {
    slug: 'logic-map',
    category: '逻辑分析',
    name: '逻辑双线地图',
    platform: 'macOS',
    color: '#1c7185',
    description: '收集和复核案例的本地逻辑分析工具。',
    features: ['创建案例并记录出处与原文。', '在案例卡片上复核分析、维护字段。'],
  },
  {
    slug: 'human-research-lab',
    category: '用户研究',
    name: 'Human Research Lab',
    platform: 'Web',
    color: '#3b6884',
    description: '围绕人物组织公开访谈、证据与研究假设。',
    features: ['按人物整理访谈来源和研究证据。', '比较跨人物的解释与待验证问题。'],
  },
  {
    slug: 'ai-monitor',
    category: '信息分析',
    name: 'AI 舆情观察台',
    platform: 'Python / Web',
    color: '#32669d',
    description: '整理公开新闻和技术社区的 AI 线索。',
    features: ['采集并去重公开来源的记录。', '用交互看板查看线索和来源。'],
  },
];
