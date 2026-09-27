---
id: vault
name: Vault
description: 经济与权限的 API 桥梁 — EssentialsX、ChestShop、Jobs 等插件能互通的前提，权限/经济/聊天三合一中间件。
category: 权限管理
version: 1.7.3（遗留版本 · 兼容 MC 1.13+）
tags: [经济, 权限, 桥接, 前置, API]
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

Vault 是「中间件」，站在它两端的是两类插件：

- **提供方**（把经济 / 权限数据交给 Vault）：EssentialsX、LuckPerms 等。它们**不依赖** Vault 也能独立运行，但装了 Vault 后会自动挂接上来。
- **消费方**（通过 Vault 读取余额或权限组）：ChestShop、Jobs、各类商店 / 任务 / 领地插件，以及需要显示余额、权限组的前缀变量与展示插件。这些插件通常在自己的 `plugin.yml` 里写了 `depend: [Vault]`，**缺了 Vault 会加载失败或功能报错**。

> **关键判断**：只装 EssentialsX、不需要其他插件读它的经济数据时，**不需要** Vault；只有当你还要装依赖 Vault 的插件（商店、任务等）时才需要。详见本站 [EssentialsX 教程](#/plugin/essentialsx)。

### 3. 安装

当前最新版是 **1.7.3**（发布于 2020-07-17，之后长期未更新），Paper 26.x 上直接装它即可。

前往 [SpigotMC](https://www.spigotmc.org/resources/vault.34315/) 或官方页面 [dev.bukkit.org](https://dev.bukkit.org/projects/vault) 下载，放入 `plugins/` 文件夹，重启服务器。

> 注意：**Vault 没有 Modrinth 发布页**（`modrinth.com/plugin/vault` 是无效链接），不要试图在 Modrinth 找它。

加载顺序不用担心：Vault 自身声明了 `load: startup`，依赖它的插件会在自己的 `plugin.yml` 里写 `depend: [Vault]`（或 `softdepend`），服务端据此先加载 Vault。把需要的插件全部装完，重启一次即可。

### 4. 验证安装

重启后在控制台输入（游戏内使用需要 `vault.admin` 权限，默认仅 OP）：

```
/vault-info
```

正常会输出四行（格式取自 Vault 源码）：

```
[Vault] Vault v1.7.3-b131 Information
[Vault] Economy: Essentials Economy [Essentials]
[Vault] Permission: LuckPerms [...]
[Vault] Chat: ...
```

每行括号里的名字由对应插件上报，实际显示可能不同；若某一行显示 `None`（例如 `Economy: None`），说明这一类没有挂接任何实现——缺经济就把 EssentialsX 装上。另有 `/vault-convert [economy1] [economy2]` 可在两种经济实现之间搬运数据，一般用不到。

### 5. 为什么本页没有 Lang / Config Tab

很多新手会找 Vault 的汉化文件，这里明确说明：

- **没有语言文件**：Vault 从不直接向玩家显示任何消息，界面文字全部来自接入它的其他插件（如 EssentialsX），因此没有 lang.yml 可汉化。
- **不需要配置文件**：Vault **不会**生成、也不附带默认 `config.yml`，所有行为都由代码自动协商，无需人工配置。它唯一识别的开关是更新检查 `update-check`（默认 `true`）——只有你手动创建 `plugins/Vault/config.yml` 并写下 `update-check: false` 时才会生效。日常使用无需创建该文件。

装上、重启、`/vault-info` 确认三件事做完，Vault 的全部工作就完成了。

### 6. 注意事项

> **Vault 只是转接头**：它自己不会发钱、不会管权限。经济来源（EssentialsX）和权限来源（LuckPerms）必须至少各装一个，缺了对应的提供方，依赖插件就会报错。

> **不要重复装多个经济插件**：同时挂两个经济实现会让 Vault 挑一个用（按服务优先级），余额可能和玩家预期不符，用 EssentialsX 自带经济 + ChestShop 这种组合最省心。

> **时效性提示**：Vault 1.7.3 发布后长期未更新（GitHub 仓库最后一次提交为 2024-03-10，仓库未归档），但因其 `api-version: 1.13` 且只是 API 桥，至今仍能在 Paper 26.x 上正常加载。社区已有活跃的延续项目 [VaultUnlocked](https://modrinth.com/plugin/vaultunlocked)（当前 2.20.3，支持到 MC 26.3，并支持 Folia），可作为未来替换的选项。
