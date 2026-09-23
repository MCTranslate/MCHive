# MC 插件汉化站

> Minecraft 服务端插件汉化教程网站 — 收录主流插件的语言文件、配置讲解与安装教程。

## 在线访问

通过 GitHub Pages 自动部署。推送代码到 `master` 分支后，Actions 会自动构建并上线。

## 技术栈

- Vue 3 + Vite（单页应用）
- Vue Router（Hash 模式，兼容 GitHub Pages）
- 无额外依赖 — Markdown 解析器为手写子集
- GitHub Actions 自动部署

## 本地开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 构建到 dist/
```

## 如何添加新插件（贡献指南）

添加新插件**不需要修改任何前端代码**，只需三步：

### 第一步：创建 Markdown 内容文件

在 `content/plugins/` 下新建一个属于你的插件的文件夹：

```
content/plugins/你的插件id/
├── tutorial.md    # 安装教程（必须）
├── lang.md        # Lang 汉化说明/内容（必须）
└── config.md      # Config 配置讲解（必须）
```

每个文件都支持 Markdown 语法。`lang.md` 和 `config.md` 内容会直接在页面上展示，可以贴完整的 YML 文件内容。

> 可参考 `content/plugins/_template/` 中的模板。

### 第二步：在索引中注册插件

编辑 `data/plugins.json`，在数组末尾追加一项：

```json
{
  "id": "你的插件id",
  "name": "插件显示名",
  "description": "一句话描述插件功能",
  "category": "分类名（如 基础工具、保护/管理等）",
  "version": "1.14 - 1.21+",
  "tags": ["标签1", "标签2"],
  "sections": [
    { "id": "tutorial", "name": "安装教程", "file": "tutorial.md" },
    { "id": "lang", "name": "Lang 汉化", "file": "lang.md", "description": "这个语言文件的作用说明" },
    { "id": "config", "name": "Config 汉化", "file": "config.md", "description": "配置文件讲解说明" }
  ],
  "downloads": [
    {
      "name": "lang_zh.yml",
      "description": "语言文件说明",
      "path": "/downloads/plugins/你的插件id/lang_zh.yml"
    }
  ]
}
```

字段说明：

| 字段 | 说明 |
|------|------|
| `id` | 唯一标识，英文短横线，必须与目录名一致 |
| `sections` | Tab 配置 — 每个 Tab 对应一个 Markdown 文件 |
| `downloads` | 下载列表 — 没有可下载文件就写 `[]` |
| `category` | 侧边栏分组的依据 |
| `tags` | 搜索关键字 |

### 第三步：放置下载文件（可选）

如果有可下载的文件（如 YML），放到 `public/downloads/plugins/你的插件id/` 目录：

```
public/downloads/plugins/你的插件id/
└── lang_zh.yml
```

这样构建时会自动拷贝到 `dist/downloads/plugins/...`，用户可通过 `path` 字段中对应的路径下载。

### 发起 PR

完成上述三步后，提交并发起 Pull Request 即可。代码合并后 Actions 会自动部署。

> **提示：** 分类名如果不存在也没关系，前端会根据所有插件的 category 自动生成分类按钮。

## 自定义页面

如果你想让某个插件页面有特别的布局和交互（比如两个并排的代码块），可以在 `sections` 里加一个 `type: "raw"` 自定义字段，然后在 `PluginDetail.vue` 中扩展对应渲染逻辑。框架已预留好了 `section.description` 字段用于说明。

## 目录结构

```
.
├── content/plugins/              ← Markdown 内容
│   ├── _template/                ← 添加新插件模板
│   ├── essentialsx/
│   ├── worldguard/
│   └── luckperms/
├── data/
│   └── plugins.json              ← 插件索引（在此注册）
├── public/
│   ├── downloads/plugins/        ← 可下载文件
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Sidebar.vue           # 侧边栏（自动生成分类+列表）
│   │   └── DownloadSection.vue   # 下载区
│   ├── views/
│   │   ├── Home.vue              # 首页
│   │   └── PluginDetail.vue      # 详情（自动加载 Markdown）
│   ├── composables/
│   │   └── markdown.js           # Markdown 解析
│   ├── router/index.js
│   ├── styles/main.css
│   ├── App.vue
│   └── main.js
├── .github/workflows/deploy.yml  # GitHub Actions
├── index.html
├── package.json
└── vite.config.js                # base: './' 兼容 GitHub Pages
```

## 部署配置

1. 在仓库 Settings → Pages → Build and deployment 选择 **GitHub Actions**
2. 如果使用项目路径（`username.github.io/repo`）部署而非用户/组织主页，需要修改 `vite.config.js` 中的 `base` 为 `'/repo名/'`

## License

GPL-3.0
