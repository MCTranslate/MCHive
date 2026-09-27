---
id: discordsrv
name: DiscordSRV
description: 把服内聊天同步到 Discord（意义不明，反正国内玩家更多，这个插件就当凑数了）
category: 社区互动
version: 1.27.0（MC 1.7.10 - 26.3）
tags: [Discord, 互通, 社区, 聊天]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: config
    name: Config 汉化
    file: config.md
    description: config.yml 关键项中文注释版，含 Bot Token 与频道 ID 配置
  - id: lang
    name: Lang 说明
    file: lang.md
    description: 消息模板在 config.yml 中自定义，无独立语言文件
---

## DiscordSRV 安装教程

### 1. 它能做什么

把游戏内聊天**双向同步**到 Discord 频道——玩家在游戏里发消息，Discord 里能看到；Discord 里发消息，游戏里也能看到。还可以把进服/退服/死亡/成就等事件推送到 Discord。

它是公益服和社区服的标配——玩家不用打开游戏也能参与讨论。

### 2. 版本与下载

当前版本 **1.27.0**，开源协议 GPL-3.0，支持 MC **1.7.10 – 26.3**。

- [GitHub Releases](https://github.com/DiscordSRV/DiscordSRV/releases)
- [Modrinth](https://modrinth.com/plugin/discordsrv)

### 3. 安装前置：创建 Discord 机器人

DiscordSRV 需要一个 **Discord Bot Token** 才能工作：

1. 打开 [Discord Developer Portal](https://discord.com/developers/applications) → New Application
2. 左侧 Bot → Add Bot → 复制 **Token**
3. OAuth2 → Scopes 勾 `bot` → 权限勾「查看频道」「发送消息」→ 复制邀请链接
4. 用邀请链接把机器人**邀请到你的 Discord 服务器**

### 4. 安装与配置

```bash
# 1. 将 jar 放入 plugins/，重启一次（生成 plugins/DiscordSRV/）
# 2. 编辑 plugins/DiscordSRV/config.yml
#    BotToken: "你的Bot Token"
#    Channels: {"000000000000000000": "000000000000000000"}
#             ↑ 游戏聊天频道 ID        ↑ Discord 频道 ID
# 3. 重启服务器
```

> **频道 ID 怎么取**：Discord 里右键频道 → 复制频道 ID（需要开启开发者模式：设置 → 高级 → 开发者模式）。

### 5. 验证

启动后控制台如果看到 `[DiscordSRV] Bot connected`，说明 Bot 连接成功。在游戏里发一句话，Discord 频道里应该同步出现。

### 6. 安全提醒

> **Bot Token 等于你 Discord 机器人的密码**——不要分享、不要提交到 Git。泄露后任何人都可以用你的机器人身份发消息。
>
> **聊天同步意味着服内对话会离开你的服务器**——请在服务器规则里告知玩家。

## 下一步

- 账号安全还没做好？→ [账号安全：正版验证、白名单与登录插件](#/guide/account-security)
- 想给不同玩家不同权限？→ [权限系统设计](#/guide/permissions-design)
- 装完一堆插件后要清理？→ [插件组合](#/guide/plugin-combos)
