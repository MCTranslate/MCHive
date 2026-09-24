---
id: plugin-combos
title: 插件组合方案：按服务器类型直接抄
description: 生存服 / RPG 服 / 小游戏服 / 公益服各自的最优插件清单与加载顺序
icon: 🧩
tags: [组合, 推荐, 选型]
order: 4
---

# 插件组合方案：按服务器类型直接抄

开服最痛苦的不是装插件，是**选型**：同类型的插件一大堆，装哪个？装了会不会冲突？权限怎么搭配？

> **本站承诺**：本文所有推荐均为免费插件（优先开源项目）。付费插件如 LiteBans、BedWars1058、MMOItems 等只在对比说明中出现，不做推荐。
>
> 本文更新于 2026 年 9 月，插件支持范围以各项目当前发布页为准。

本文按服务器类型给出成熟方案。每套方案都经过社区验证，覆盖了该类型服务器 90% 的需求。插件名后标注了本站是否有详细教程和汉化（✅ = 有）。

## 生存服（最常见）

定位：原版生存玩法 + 基础保护和经济，朋友服 / 小型社区服首选。

### 基础层（必装）

| 插件 | 作用 | 备注 |
|------|------|------|
| EssentialsX ✅ | 家/传送/昵称/基础命令 | 生存服的半条命 |
| LuckPerms ✅ | 权限分组 | 默认玩家/会员/管理员 |
| Vault | 经济权限 API 桥梁 | 装了它经济插件才能互通 |
| DecentHolograms | 全息图 | 公告、排行榜展示 |

### 保护层（强烈推荐）

| 插件 | 作用 | 备注 |
|------|------|------|
| WorldGuard ✅ | 区域保护 | 主城/出生点保护 |
| WorldEdit ✅ | 地图编辑 | WorldGuard 的前置 |
| CoreProtect | 方块操作记录/回滚 | 被熊了能查谁干的 |
| GriefPrevention | 玩家自领地 | 让玩家自己圈地，减少管理负担 |

### 经济层

| 插件 | 作用 | 备注 |
|------|------|------|
| EssentialsX 的经济模块 | 基础货币 | 前面装了 EssentialsX 就有了 |
| ChestShop | 箱子商店 | 玩家间交易 |
| Jobs | 职业系统 | 打工赚钱，增加留存 |

**加载顺序**：Vault → LuckPerms → EssentialsX → 其他。实际上 modern 插件加载器会自动处理依赖，你只需要保证**全部装完重启一次**。

## RPG 生存服

定位：加技能、等级、装备强化，往 MMO 方向靠。

在生存服基础上追加（全部免费）：

| 插件 | 作用 | 备注 |
|------|------|------|
| MythicMobs | 自定义 Boss/怪物 | RPG 服灵魂。免费版可自定义绝大多数技能；变量技能等高级功能在付费版，本站不推荐购买，免费版覆盖 80% 场景 |
| mcMMO | RPG 化生存技能 | 开源免费，挖矿/钓鱼都有等级 |
| Quests | 任务系统 | 免费开源，引导玩家目标 |
| Citizens | NPC | 免费，商人/任务发布者 |
| ModelEngine | 自定义模型 | 免费版可用，让 MythicMobs 的 Boss 有专属外观 |

> 曾经流行的付费装备插件 MMOItems 本站不做推荐——装备系统用 mcMMO + 原版附魔 + LootX 之类的免费方案同样能搭起来，只是要自己多花点时间调数值。RPG 服的 MythicMobs 配置非常复杂，建议先跑通生存服再加这些。每加一个插件**重启一次**，出问题立刻知道是谁。

## 小游戏 / 起床战争服

定位：多局游戏、地图轮换、计分板。

| 插件 | 作用 | 备注 |
|------|------|------|
| Multiverse-Core | 多世界管理 | 免费开源，v5 已重构支持新版本 |
| BedWars2023 | 起床战争 | 免费开源（BedWars1058 的社区分支），持续维护 |
| ScreamingSandals BedWars | 起床战争备选 | 免费开源，支持 1.8.8 - 26.x，新旧版本通吃 |
| TAB | Tab 列表美化 | 免费，显示排名/段位 |
| PlaceholderAPI | 变量占位符 | 免费，其他插件的美化基础 |

> 老牌的 BedWars1058 是付费插件，本站不推荐——社区分支 BedWars2023 免费开源且继承了它的玩法体系。另一个选择是 ScreamingSandals 团队的开源 BedWars，版本兼容性做得最好（从远古 1.8 一路支持到 2026 年的 26.x）。
>
> 小游戏服基本都是 BungeeCord / Velocity 群组服架构：大厅服 + 多个游戏服。上面的插件装在「游戏服」里，大厅服另配。单服硬玩小游戏也可以，但地图轮换体验差。

## 公益服 / 开放社区服

定位：长期运营，玩家多，需要防捣乱。

在生存服基础上追加（全部免费）：

| 插件 | 作用 | 备注 |
|------|------|------|
| AuthMe | 登录注册 | 免费，offline-mode 必装 |
| BanManager | 封禁系统 | 免费开源（LiteBans 的免费替代），封人/禁言有记录可查，2012 年维护至今 |
| ChatControl | 聊天管理 | 免费版即可做刷屏/广告过滤 |
| Plan | 服务器数据统计 | 免费开源，在线人数/玩家行为分析 |
| DiscordSRV | Discord 联动 | 免费开源，国外社区用，国内可换 QQ 机器人 |

> 常见付费选择 LiteBans（约 10 欧元）本站不做推荐——BanManager 免费开源且功能覆盖相同，大型服务器验证多年。

## 通用优化层（任何服都建议）

| 插件 | 作用 | 备注 |
|------|------|------|
| spark | 性能分析 | 卡服时用它找元凶，比猜测靠谱 |
| Chunky | 预生成区块 | 开服前跑一遍，大幅减少卡顿 |
| ClearLagg / EntityDetection | 实体清理 | 控制 TNT/掉落物爆炸实体数量 |

## 权限分组模板（LuckPerms 速用）

装完 LuckPerms 后，在控制台执行这套命令，一个标准的权限体系就出来了：

```
/lp creategroup member
/lp creategroup vip
/lp creategroup admin

# 默认组：基础生存权限
/lp group default permission set essentials.sethome true
/lp group default permission set essentials.home true
/lp group default permission set essentials.tpa true

# VIP 组：继承默认 + 更多家 + 飞行
/lp group vip parent add member
/lp group vip permission set essentials.sethome.multiple.vip true
/lp group vip permission set essentials.fly true

# 管理组：全部权限
/lp group admin permission set * true

# 把自己提为管理员
/lp user 你的游戏名 parent add admin
```

更多 LuckPerms 细节看 [LuckPerms 教程](#/plugin/luckperms)。

## 下一步

- 每个插件的完整配置和汉化下载 → 左侧插件库
- 插件之间打架了 → [避坑与排错](#/guide/faq)