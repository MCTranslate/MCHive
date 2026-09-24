# MCHive

> Minecraft 服务器知识平台 — 从零开服指南、服务端教程、插件资料与配置说明。

## 在线访问

通过 GitHub Pages 自动部署。推送代码到 `master` 分支后，Actions 会自动构建并上线。

## 技术栈

- Vue 3 + Vite（单页应用，Hash 路由兼容 GitHub Pages）
- 无第三方依赖：Markdown / YAML frontmatter 解析器均为轻量手写子集
- 渲染前会转义原始 HTML，链接限制为安全协议
- GitHub Actions 自动部署

## 本地开发

```bash
npm install
npm run dev          # http://localhost:5173；启动前会自动 validate + build:index
npm run build        # 构建到 dist/；同样先校验与生成索引
npm run validate     # 仅校验 content/ 下所有 frontmatter
npm run build:index  # 仅从 content/ 聚合生成 data/*.json
```

`npm run dev` 与 `npm run build` 都会先跑 `validate`（schema + 命名 + 引用一致性）和 `build:index`（从 markdown frontmatter 生成 JSON 索引）。任何校验失败都会阻断 dev / build。

## 内容与贡献

MCHive 同时维护开服指南与插件资料。所有内容都以 Markdown 形式存放在 `content/`，元数据写在每个 md 文件顶部的 YAML frontmatter 里。**不再需要手抄 JSON 索引**，启动 / 构建时由脚本自动聚合。

### 目录约定

```
content/
├── guides/<id>.md             # 开服教程（每个 md 顶部带 frontmatter）
└── plugins/
    ├── <id>/                  # 每个插件一个目录
    │   ├── tutorial.md        # 必填；含 frontmatter 元数据 + 教程正文
    │   ├── lang.md            # 可选；展示为代码块
    │   └── config.md          # 可选；展示为代码块
    └── _template/             # 贡献模板（贡献时复制整个目录）
```

### 如何添加新插件

只需新增一个目录并写好 frontmatter，无需修改任何 JSON 或前端代码：

1. **复制模板**：把 `content/plugins/_template/` 整个目录复制一份，重命名为你的插件 id（必须与目录名一致、只含 `a-z 0-9 -`）。
2. **改 frontmatter**：在新的 `tutorial.md` 顶部 `---` 块里填：
   - `id` — 必须等于目录名
   - `name` / `description` — 必填，用于卡片与搜索
   - `category` — 左侧分组；已有「基础工具」；新增分类会自动建分组
   - `tags` / `version` — 可选，搜索关键字与版本区间
   - `sections` — 可省略；省略时自动扫描本目录下所有 `.md`（`tutorial.md` 走 markdown 渲染，其余走代码块）
   - `downloads` — 列出可下载文件路径，文件必须放在 `public/downloads/plugins/<id>/` 下
3. **写正文**：`tutorial.md` 写 Markdown 教程正文；`lang.md` / `config.md` 粘贴 YML 或 properties 等「纯文本文件」原文（页面会自动以代码块渲染，可一键复制）。
4. **放置下载文件**（可选）：如果有可下载的 YML 等，放到 `public/downloads/plugins/<id>/`。
5. **跑起来**：`npm run dev` — predev 钩子会自动校验 frontmatter 与引用一致性，发现错误立刻报错；通过后再生成 `data/plugins.json`，无需手动维护。

### 如何添加新教程

直接新建 `content/guides/<id>.md`（id 即文件名去后缀），顶部 frontmatter：

```yaml
---
id: my-guide
title: 教程展示标题
description: 一句话讲清楚这篇教程解决什么问题
icon: 📖
tags: [标签1, 标签2]
order: 6
---
```

`order` 控制侧边栏顺序（升序），省略则按文件名字典序。文件下方写 Markdown 正文即可。

### 字段契约

完整契约见 `schemas/` 目录：

- `schemas/plugin.schema.json` — 插件 frontmatter 必填字段、类型、命名约束
- `schemas/guide.schema.json` — 教程 frontmatter 契约
- `schemas/section.schema.json` — sections 配置契约

校验器会在 `predev` / `prebuild` 钩子中加载这些 schema 阻断违例内容进入构建产物。

### 发起 PR

完成上述步骤后提交并发起 Pull Request。代码合并后 Actions 会自动部署。

## 目录结构

```
.
├── content/                   ← Markdown 内容（唯一真实源）
│   ├── guides/                ← 开服教程
│   └── plugins/               ← 插件资料
│       ├── _template/         ← 贡献模板
│       ├── essentialsx/
│       ├── luckperms/
│       └── worldguard/
├── data/                      ← 构建产物（由 build:index 自动生成，可读）
│   ├── plugins.json
│   └── guides.json
├── schemas/                   ← JSON Schema 契约
├── scripts/                   ← Node 脚本
│   ├── parse-frontmatter.mjs  ← 共享 frontmatter 解析（Vue 与脚本共用）
│   ├── build-index.mjs        ← 扫描 content/ → data/*.json
│   └── validate-content.mjs   ← schema 校验 + 命名/引用一致性
├── public/downloads/plugins/  ← 可下载文件（按 <id> 子目录组织）
├── src/
│   ├── components/            ← Sidebar / DownloadSection
│   ├── views/                 ← Home / PluginDetail / GuideDetail / ...
│   ├── composables/
│   │   ├── markdown.js        ← Markdown 解析（顶部自动剥离 frontmatter）
│   │   └── frontmatter.js     ← YAML 解析器
│   ├── router/index.js
│   ├── styles/main.css
│   ├── App.vue
│   └── main.js
├── .github/workflows/deploy.yml
├── index.html
├── package.json               ← scripts: dev/build 串联 validate + build:index
└── vite.config.js             ← base: './' 兼容 GitHub Pages
```

## 部署配置

1. 在仓库 Settings → Pages → Build and deployment 选择 **GitHub Actions**
2. 如果使用项目路径（`username.github.io/repo`）部署而非用户/组织主页，需要修改 `vite.config.js` 中的 `base` 为 `'/repo名/'`

## License

GPL-3.0