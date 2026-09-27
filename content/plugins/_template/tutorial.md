---
id: your-plugin-id
name: 插件展示名
description: 一句话讲清楚这个插件解决什么问题、适合什么场景
category: 基础工具
version: 插件版本号（MC 支持区间）
tags: [标签1, 标签2]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 中文语言文件说明（可选，删掉整行亦可）
  - id: config
    name: Config 汉化
    file: config.md
    description: 配置文件中文注释版说明（可选）
downloads:
  - name: 请填插件真实读取的文件名
    description: 说明这个文件的用途，以及该放到插件的哪个目录
    path: /downloads/plugins/your-plugin-id/<真实文件名>
---

<!--
  贡献指南：
  1. 复制整个 content/plugins/_template/ 文件夹，重命名为你的插件 id（必须与目录名一致、只含 a-z 0-9 -）。
  2. 替换上方 frontmatter 字段：
     - id 必须等于目录名
     - name / description 必填，用于卡片与搜索
     - category 用于左侧分组（已有「基础工具」；新增分类会自动建分组）
     - tags 用于搜索关键字
     - version 建议填写：先写插件版本号，再用括号补充支持的 MC 区间，
       例如 `24.1（MC 1.16.5 - 26.2）`。本站按此展示时效性，不要留空。
     - sections 可省略，省略时自动扫描本目录下所有 .md（tutorial.md 走 markdown，其它走代码块）
     - downloads 列出本插件可下载文件的绝对路径，文件必须放在 public/downloads/plugins/<id>/ 下
  3. tutorial.md 写正文（Markdown），会自动渲染。
  4. lang.md / config.md 默认作为代码块展示。删除整文件即可从 sections 中消失。
  5. 跑 npm run dev：predev 钩子会先校验 frontmatter，再生成 data/plugins.json。
  6. 详细字段说明见 schemas/plugin.schema.json。

  ⚠ 语言文件务必先核实插件真实读取的格式与文件名，不要想当然：
     - EssentialsX 用 messages_<locale>.properties（Java properties，非 YAML），且自带简体中文，无需下载
     - WorldEdit 用 lang/*.json（内置 zh-CN）
     - 有些插件（如 LuckPerms）根本没有语言文件，此时「Lang 汉化」页只写启用方式，不要提供下载
     - 提供一个插件根本不读的文件（例如格式/文件名不对），读者照做后不生效，比不提供更糟
     核对手法：下载官方 jar → 解包 → 查看实际的语言资源文件，或查阅官方文档。
-->

## 插件名 安装教程

这里写安装教程和基础使用方法。支持 Markdown 语法，包括：

- 标题、列表
- **加粗**、*斜行*
- `行内代码`
- 表格
- 引用

### 1. 安装

下载插件 jar，放入 `plugins/`，重启服务器。

### 2. 常用命令

| 命令 | 说明 |
|------|------|
| /cmd1 | 说明1 |
| /cmd2 | 说明2 |

> 提示：在 `lang.md` 中写语言文件内容，在 `config.md` 中写配置注释版。