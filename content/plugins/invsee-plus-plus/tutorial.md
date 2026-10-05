---
id: invsee-plus-plus
name: InvSee++
description: 查看和编辑玩家的背包、末影箱、装备栏 — 关键是支持离线玩家，甚至能查从来没登录过的人，附赠 give/clear 子插件。
category: 玩家管理
version: InvSee++（MC 1.8 - 26.3）
tags: [查背包, 离线玩家, 末影箱, 管理, 经济]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## InvSee++ 安装教程

### 1. 它比 EssentialsX 的 `/seen` 强在哪

EssentialsX 也能查背包，但有几件事它做不到：

| 能力 | EssentialsX | InvSee++ |
|------|------------|---------|
| 看在线玩家背包 | ✅ | ✅ |
| **拿走 / 替换对方的装备** | 有限 | ✅ |
| **查离线玩家背包** | 有限 | ✅ |
| **查从来没登录过的玩家** | ❌ | ✅ |
| **查末影箱** | 有限 | ✅ |
| 查看工作台/铁砧/附魔台等容器 | 有限 | ✅ |
| 玩家重登后自动重载 | — | ✅ |
| 记录所有改动 | 部分 | ✅ 可配置 |
| 自定义界面布局和标题 | ❌ | ✅ |

**最关键的一条是「查从来没登录过的玩家」。** 经济服出问题时，你要处理的那个账号可能根本不是本服的账号，但它在你这儿有物品记录。

### 2. ⚠️ Folia 不支持（这是设计如此，不是有 bug）

**InvSee++ 明确说明 Folia 支持已被禁用**，原因是「会造成服务器崩溃级的 bug」，作者说需要重新设计才会恢复。

| 平台 | 支持 |
|------|------|
| Spigot / Paper / Purpur / Glowstone | ✅ |
| **Folia** | ❌ **明确不支持，不要装** |

如果你在跑 Folia，这个插件直接排除。Folia 的架构差异见 [选择服务端核心](#/guide/choose-core) 与 [性能调优](#/guide/performance-tuning)。

### 3. 前置条件

| 要求 | 说明 |
|------|------|
| Java | 新版 Paper 26.x 模块建议 Java 17+ |
| 硬依赖 | 无 |
| 可选 | **Vault**（查离线玩家权限需要）、**PerWorldInventory**（分世界背包集成） |

> ⚠️ **Vault 不是可选项——查离线玩家时它会用到。** 没有 Vault，InvSee++ 无法对离线玩家做权限检查，于是你就知道为什么它推荐 Vault 了。

## 4. 安装

- SpigotMC：<https://www.spigotmc.org/resources/invsee.82342/>
- Modrinth：搜 `invsee++`
- GitHub：<https://github.com/Jannyboy11/InvSee-plus-plus>

丢进 `plugins/`，重启。生成 `plugins/InvSee++/`。

> ⚠️ **从 v0.31 之前的老版本升级，务必先备份 `plugins/InvSee++/`。** 版本跨度大的时候槽位编号体系会变（v0.31.15 起因为动物盔甲和鞍槽位，主库存槽位编号扩展了），依赖 API 的第三方插件需要同步适配。

## 5. 命令

| 命令 | 说明 |
|------|------|
| `/invsee <玩家>` | 查看并编辑该玩家的主背包 |
| `/endersee <玩家>` | 查看并编辑该玩家的末影箱 |
| `/invseeplusplusreload` | 重载配置 |

**玩家名可以用用户名或 UUID。** 改名之后 UUID 才是可靠的方式。

### PerWorldInventory 集成（可选）

装了 PerWorldInventory（分世界背包）之后，两个命令都能带一个可选参数：

```
/invsee PWI{=group,world,gamemode}
/endersee PWI{=group,world,gamemode}
```

`{...}` 里三选一：

| 参数 | 含义 |
|------|------|
| `group` | 直接指定背包分组名 |
| `world` | 指定世界，插件自己解析对应分组 |
| `gamemode` | 游戏模式 |

**不写 gamemode 时默认用 survival。**

> PerWorldInventory 那边要设 `load-data-on-join: true` 才能正常工作。

## 6. 附赠子插件

InvSee++ 附带两个「扩展」插件（作者称之为 addon），非常实用：

### InvSee++ Give

给（离线）玩家发物品：

| 命令 | 说明 |
|------|------|
| `/invgive <物品>` | 加到背包 |
| `/endergive <物品>` | 加到末影箱 |

**指令格式和原版 `/give` 一样。** 记住这一点就够用了。

> ⚠️ **版本差异要留意**：1.20.5+ 上 Give 使用接近原版的语法（不再用 NBT 标签），1.20.4 及以下仍沿用老格式。跨这个版本界线时，管理命令的写法要改。

### InvSee++ Clear

清空（离线）玩家的物品：

| 命令 | 说明 |
|------|------|
| `/invclear` | 清空背包 |
| `/enderclear` | 清空末影箱 |

格式和原版 `/clear` 一样。

## 7. 权限节点

InvSee++ 把权限拆成 10 个基础节点：

| 权限 | 作用 |
|------|------|
| `invseeplusplus.invsee.view` / `.edit` | 查看 / 编辑主背包 |
| `invseeplusplus.endersee.view` / `.edit` | 查看 / 编辑末影箱 |
| `invseeplusplus.exempt.invsee` / `.endersee` | 豁免被查看对应容器 |
| `invseeplusplus.bypass-exempt.invsee` / `.endersee` | 绕过对应豁免 |
| `invseeplusplus.tabcomplete` | Tab 补全玩家名 |
| `invseeplusplus.reload` | 重载配置 |

为了省事，有几个父权限：`view`（两个 view）、`edit`（两个 edit）、`exempt`（两个 exempt）、`bypass-exempt`（两个 bypass），以及 `invseeplusplus.*`（全部 10 个 + `give.*` + `clear.*`）。

### 推荐的权限分配

| 角色 | 分配 |
|------|------|
| **管理员** | `invseeplusplus.*` |
| **客服 / 记录员** | `invseeplusplus.view`（只读！**不要给 edit**） |
| **玩家** | `invseeplusplus.exempt` |

> 💡 **「豁免」机制值得单独讲。** 玩家可以有 `invseeplusplus.exempt.invsee`，这样**只有拥有 `bypass-exempt` 的管理员能查他**。给 VIP 玩家这个权限，是很实用的隐私保护。

## 8. 配置要点

配置文件 `plugins/InvSee++/config.yml`。**具体键名以你手上版本的配置注释为准**，这里说几个影响最大的：

| 配置项方向 | 作用 | 建议 |
|-----------|------|------|
| 离线玩家支持 | 能不能查离线玩家 | 开着，这是核心功能 |
| 未知玩家支持 | 能不能查从没登录过的 | 开着，经济服需要 |
| 界面标题 | 旁观界面标题的模板 | 用玩家名变量，防混淆 |
| 布局模板 | 槽位排列 | 用默认的，别乱改 |
| 改动日志 | 是否记录所有改动 | **开着。** 这是事后追责的证据 |
| Tab 补全离线玩家 | 补全性能 | 开着（Paper 上是异步的，不卡主线程） |

> **改动日志强烈建议开着。** 管理能改玩家背包这件事本身就是风险来源。有日志，出了纠纷能查；没日志，只能靠玩家截图。

## 9. 常见坑

| 症状 | 处理 |
|------|------|
| **装了不加载（Folia）** | Folia 不支持，见第 2 节 |
| **查离线玩家说没权限** | 装 Vault。**没有 Vault 时它无法检查离线玩家的权限** |
| **跨版本升级后物品错位** | v0.31.15 附近因新增动物盔甲和鞍槽位，**主库存槽位编号扩展了**（41=BODY、42=SADDLE、43=光标）。依赖 API 的第三方插件也要跟着改 |
| **give 命令语法变了** | 1.20.5+ 改了语法（不再用 NBT 标签），1.20.4 及以下沿用旧格式 |
| **Tab 补全卡顿** | Paper 上是异步的，不会卡主线程。真卡的话多半是权限插件不缓存检查导致的 |
| **和 PerWorldInventory 集成不生效** | PerWorldInventory 的配置里要设 `load-data-on-join: true` |

## 10. 缺点和风险

| 项 | 说明 |
|---|------|
| **Folia 完全不支持** | 明确禁用，且作者说要重新设计 |
| **能编辑玩家背包 = 能直接改玩家物品** | 这是**强大的管理能力，也是巨大的责任**。给错权限的后果很严重 |
| **没有默认的操作审计** | 要自己开日志配置 |
| **离线支持依赖 Vault** | 少一个前置 |
| **API 槽位编号不稳定** | 跨版本升级会影响第三方插件 |

**它的取舍很清楚：给你完整的管理能力，代价是你必须自己保证权限分配和日志到位。**

## 11. 关于汉化

> ⚠️ **本站未核实到 InvSee++ 的官方中文语言文件机制。**

它的界面标题、提示消息不多。想改：

1. 打开 `plugins/InvSee++/config.yml`，找界面标题（titles）和消息相关段落
2. 标题支持模板变量（通常是玩家名），可以直接写中文格式

**具体键名以你手上版本的官方配置文件注释为准。**

顺带一提：**界面标题值得认真改。** 默认标题如果只是「XX's inventory」，在有多个同类界面的情况下容易和玩家自己的箱子混淆——用中文标题或者加明显的标识，能减少「我是不是打开了别人的背包」这类误会。

## 下一步

- 权限怎么设计 → [权限系统设计](#/guide/permissions-design)
- 经济服查账思路 → [经济系统配置](#/guide/economy-setup)
- 服务器安全加固 → [服务器安全加固](#/guide/security-hardening)
- 隐身系统 → [SayanVanish](#/plugin/sayanvanish)