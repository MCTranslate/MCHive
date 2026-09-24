---
id: essentialsx
name: EssentialsX
description: 全能基础功能 — 家、传送、经济、飞行、昵称、邮件、天气与时间控制，生存服必装的瑞士军刀。
category: 功能插件
tags: [经济, 传送, 家, 基础, 必备]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: EssentialsX 中文语言文件，替换后界面文字将全部变为中文
  - id: config
    name: Config 汉化
    file: config.md
    description: EssentialsX 配置文件中文注释版，逐项解释参数含义与推荐值
downloads:
  - name: lang_zh.yml
    description: EssentialsX 中文语言文件
    path: /downloads/plugins/essentialsx/lang_zh.yml
---

## EssentialsX 安装教程

### 1. 下载插件

前往 [Modrinth](https://modrinth.com/plugin/essentialsx) 或 [SpigotMC](https://www.spigotmc.org/resources/essentialsx.9089/) 下载最新版本。

### 2. 安装

将 jar 文件放入服务器的 `plugins/` 文件夹，重启服务器。

### 3. 安装汉化

1. 从下方「Lang 汉化」Tab 下载 `lang_zh.yml`
2. 将其放入 `plugins/EssentialsX/` 目录
3. 在 `config.yml` 中找到 `locale: english` 改为 `locale: zh`
4. 执行 `/ess reload` 或重启服务器

### 4. 常用命令

| 命令 | 说明 |
|------|------|
| /sethome [名称] | 设置家 |
| /home [名称] | 传送回家 |
| /tpa <玩家> | 请求传送到某玩家 |
| /tpaccept | 接受传送请求 |
| /fly | 切换飞行模式 |
| /speed <1-10> | 调整移动速度 |
| /seen <玩家> | 查看玩家最后上线时间 |

### 5. 注意事项

> EssentialsX 还需要 **Vault** 作为经济系统的桥梁，建议一并安装。