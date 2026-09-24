# Contributing to MCHive

MCHive 是面向 Minecraft 服务器服主的中文开源知识库。贡献内容时，请优先保证它可复现、来源清晰，并适用于明确的服务端或插件版本。

## 添加教程

1. 在 `content/guides/` 创建 Markdown 文件。
2. 在 `data/guides.json` 注册 `id`、标题、简介和标签。
3. 使用 fenced code block 标记配置和命令，并注明语言。

## 添加插件资料

1. 复制 `content/plugins/_template/` 到新的插件目录。
2. 在 `data/plugins.json` 增加元数据和章节文件。
3. 可下载文件放在 `public/downloads/plugins/<id>/`，并在索引中使用以 `/downloads/` 开头的路径。

## 提交 Pull Request

- 不要提交服务器地址、玩家隐私、凭据或未公开配置。
- 保留上游插件的作者、版本和许可信息。
- 在本地运行 `npm install` 和 `npm run build`。
- PR 描述中写明内容验证的 Minecraft、服务端和插件版本。

内容会经过维护者审阅后合并。
