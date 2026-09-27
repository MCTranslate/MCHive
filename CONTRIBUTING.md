# Contributing to MCHive

MCHive 是面向 Minecraft 服务器服主的中文开源知识库。贡献内容时，请优先保证它可复现、来源清晰，并适用于明确的服务端或插件版本。

## 添加教程

1. 在 `content/guides/` 创建 Markdown 文件（文件名即教程 `id`）。
2. 在文件顶部用 frontmatter 写 `id`、`title`、`description`、`icon`、`tags`、`order`。
3. 使用 fenced code block 标记配置和命令，并注明语言。

> **不需要手动编辑 `data/guides.json`**——它是 `npm run build:index` 从 frontmatter 自动生成的构建产物（已被 `.gitignore` 忽略），手改会被覆盖。

## 添加插件资料

1. 复制 `content/plugins/_template/` 到新的插件目录（目录名即插件 `id`）。
2. 编辑 `tutorial.md` 的 frontmatter（`id`、`name`、`description`、`category`、`version`、`tags`）。
3. 按需创建 `config.md`（配置注释版）和 `lang.md`（语言机制说明）。
4. 可下载文件放在 `public/downloads/plugins/<id>/`，并在 frontmatter 的 `downloads` 中列出路径。

> **不需要手动编辑 `data/plugins.json`**——同上，它是自动生成的。
>
> ⚠ **语言文件务必先核实插件真实读取的格式与文件名**，不要想当然——详见 `_template/tutorial.md` 里的告警。

## 提交 Pull Request

- 不要提交服务器地址、玩家隐私、凭据或未公开配置。
- 保留上游插件的作者、版本和许可信息。
- 在本地运行 `npm install` 和 `npm run build`。
- PR 描述中写明内容验证的 Minecraft、服务端和插件版本。
- frontmatter 的 `version` 字段写**插件版本号 + MC 支持区间**（如 `24.1（MC 1.16.5 - 26.2）`）。

内容会经过维护者审阅后合并。
