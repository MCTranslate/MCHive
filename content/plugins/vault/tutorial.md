---
id: vault
name: Vault
description: 经济与权限的统一 API 桥梁 — EssentialsX、ChestShop、Jobs 等插件能互通的前提
category: 基础工具
tags: [经济, 权限, 桥接, 前置]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## Vault 安装教程

### 1. 这个插件解决什么问题

服务器里经济类、权限类插件一大堆：EssentialsX 管经济、LuckPerms 管权限、ChestShop 要读余额、Jobs 要发工资……如果每对插件之间都单独对接，生态就乱套了。Vault 定义了一套统一接口，让「任何经济插件」和「任何需要钱的功能插件」能自动对接。

**一句话理解**：Vault 不直接提供玩法，它是让别的插件能互相说话的「转接头」。

### 2. 谁需要它

以下插件**依赖 Vault**，缺了它启动就会报错或功能瘫痪：

- EssentialsX 的经济模块（作为经济提供方）
- ChestShop、Jobs、领地插件等（作为经济消费方）
- 各类需要读取余额、权限组的变量与展示插件

本站 [EssentialsX 教程](#/plugin/essentialsx) 中提到的经济功能，前提就是装好 Vault。

### 3. 安装

前往 [Modrinth](https://modrinth.com/plugin/vault) 或 [SpigotMC](https://www.spigotmc.org/resources/vault.34315/) 下载，放入 `plugins/` 文件夹，重启服务器。

加载顺序不用担心：现代插件加载器会自动处理依赖关系，把需要的插件**全部装完重启一次**即可。

### 4. 验证安装

重启后在控制台输入：

```
/vault-info
```

正常会显示当前挂接的经济提供方（如 `Economy: EssentialsX Economy`）和权限提供方（如 `Permissions: LuckPerms`）。如果显示 No economy provider 之类的提示，说明你装了 Vault 但没装任何经济实现——把 EssentialsX 装上即可。

### 5. 为什么本页没有 Lang / Config Tab

很多新手会找 Vault 的汉化文件，这里明确说明：

- **没有语言文件**：Vault 从不直接向玩家显示任何消息，界面文字全部来自接入它的其他插件（如 EssentialsX），因此没有 lang.yml 可汉化
- **没有需要修改的配置**：首次启动生成的 config.yml 基本是空的，所有行为都由代码自动协商，无需人工配置

装上、重启、`/vault-info` 确认三件事做完，Vault 的全部工作就完成了。

### 6. 注意事项

> **Vault 只是转接头**：它自己不会发钱、不会管权限。经济来源（EssentialsX）和权限来源（LuckPerms）必须至少各装一个，缺了对应的提供方，依赖插件就会报错。

> **不要重复装多个经济插件**：同时挂两个经济实现会让 Vault 挑一个用，余额可能和玩家预期不符，用 EssentialsX 自带经济 + ChestShop 这种组合最省心。
