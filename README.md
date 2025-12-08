# 个人品牌网站模板

一个现代化的响应式个人品牌网站，采用玻璃拟态设计风格，基于Huemint配色方案。

## 🎨 设计特色

- **玻璃拟态设计**：半透明卡片效果，现代感十足
- **Huemint配色**：温暖的色调搭配，视觉舒适
- **响应式布局**：完美适配桌面、平板、手机
- **流畅动画**：滚动动画和交互动效
- **现代字体**：Google Fonts (Poppins + Inter)

## 📁 文件结构

```
new_website/
├── index.html          # 主页文件
├── styles/
│   └── main.css       # 样式文件
├── scripts/
│   └── app.js         # 交互脚本
├── images/
│   └── doraemon_avatar_8.webp  # 头像图片
└── README.md          # 说明文档
```

## 🚀 快速开始

### 1. 自定义个人信息

编辑 `index.html` 文件，替换以下内容：

- **姓名**：搜索 "您的姓名" 并替换
- **职业标语**：搜索 "专业标语/个人Slogan" 并替换
- **个人介绍**：搜索相应的描述文本并替换
- **联系方式**：搜索邮箱、电话、地址并替换
- **头像图片**：替换 `images/doraemon_avatar_8.webp`

### 2. 自定义技能

编辑 `scripts/app.js` 文件，修改 `skillsData` 数组：

```javascript
const skillsData = [
  {
    icon: 'code',  // Lucide图标名称
    title: '技能名称',
    description: '技能描述'
  }
  // 更多技能...
];
```

### 3. 自定义项目

编辑 `scripts/app.js` 文件，修改 `projectsData` 数组：

```javascript
const projectsData = [
  {
    title: '项目名称',
    description: '项目描述',
    tags: ['技术栈标签'],
    image: '项目图片URL'
  }
  // 更多项目...
];
```

### 4. 本地预览

在项目目录下启动本地服务器：

```bash
# Python方式
python -m http.server 8000

# Node.js方式
npx serve

# 然后访问 http://localhost:8000
```

## 🎯 主要功能

- **响应式导航**：支持桌面和移动端
- **技能展示**：网格布局的技能卡片
- **项目作品集**：项目卡片展示
- **联系表单**：功能完整的联系表单
- **平滑滚动**：页面内导航平滑滚动
- **动画效果**：滚动触发的动画效果

## 🎨 配色方案

基于Huemint配色方案：

- **奶白色** `#fffffb` - 主要背景色
- **深棕色** `#3b2418` - 主要文字色
- **青绿色** `#0cbfa0` - 主要强调色
- **珊瑚色** `#e74267` - 次要强调色
- **金色** `#e7c000` - 装饰强调色
- **深青绿** `#26ac9e` - 阴影和深度

## 🔧 自定义选项

### 修改配色
编辑 `styles/main.css` 中的 `:root` 变量：

```css
:root {
  --color-primary: #fffffb;
  --color-primary-dark: #3b2418;
  --color-accent: #0cbfa0;
  --color-accent-secondary: #e74267;
  --color-accent-tertiary: #e7c000;
  --color-accent-quaternary: #26ac9e;
}
```

### 修改字体
在 `styles/main.css` 中修改字体变量：

```css
:root {
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

### 添加新的技能或项目
在 `scripts/app.js` 中向相应数组添加新项目。

## 📱 响应式断点

- **桌面端**：`> 1024px`
- **平板端**：`768px - 1024px`
- **移动端**：`< 768px`

## 🌐 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 📄 许可证

本项目采用 MIT 许可证。

## 💡 使用提示

1. **图片优化**：建议使用 WebP 格式图片以获得更好的性能
2. **SEO 优化**：根据需要修改页面标题、描述和关键词
3. **性能优化**：可以压缩 CSS 和 JavaScript 文件
4. **部署建议**：可以使用 Netlify、Vercel 或 GitHub Pages 进行部署

---

**作者**：MiniMax Agent  
**版本**：1.0.0  
**更新时间**：2025-12-08