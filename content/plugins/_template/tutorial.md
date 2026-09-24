---
id: your-plugin-id
name: 插件展示名
description: 一句话讲清楚这个插件解决什么问题、适合什么场景
category: 基础工具
version: 1.13 - 26.x
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
  - name: lang_zh.yml
    description: 插件中文语言文件
    path: /downloads/plugins/your-plugin-id/lang_zh.yml
---

<!--
  贡献指南：
  1. 复制整个 content/plugins/_template/ 文件夹，重命名为你的插件 id（必须与目录名一致、只含 a-z 0-9 -）。
  2. 替换上方 frontmatter 字段：
     - id 必须等于目录名
     - name / description 必填，用于卡片与搜索
     - category 用于左侧分组（已有「基础工具」；新增分类会自动建分组）
     - tags 用于搜索关键字
     - version 可选，写支持版本区间
     - sections 可省略，省略时自动扫描本目录下所有 .md（tutorial.md 走 markdown，其它走代码块）
     - downloads 列出本插件可下载文件的绝对路径，文件必须放在 public/downloads/plugins/<id>/ 下
  3. tutorial.md 写正文（Markdown），会自动渲染。
  4. lang.md / config.md 默认作为代码块展示。删除整文件即可从 sections 中消失。
  5. 跑 npm run dev：predev 钩子会先校验 frontmatter，再生成 data/plugins.json。
  6. 详细字段说明见 schemas/plugin.schema.json。
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