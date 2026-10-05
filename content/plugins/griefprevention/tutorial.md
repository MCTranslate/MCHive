---
id: griefprevention
name: GriefPrevention
description: 自助领地保护 — 玩家自己用金 shovel 圈地、扣 claim blocks 扩张、互相给信任。2011 年至今的老牌插件，管理成本几乎为零，但只能矩形、没有 GUI。
category: 领地保护
version: 16.18.7（MC 1.17.1 - 1.21）
tags: [领地, 保护, 防熊, 生存服, claim]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## GriefPrevention 安装教程

### 1. 它是什么（以及它和 WorldGuard 的根本区别）

GriefPrevention 的核心设计是**自助**：玩家自己圈地、自己扩张、自己给朋友权限，管理员基本不用管。

**这个设计带来一个根本区别**——和 WorldGuard 不是同一类东西：

| | GriefPrevention | WorldGuard |
|---|---------------|------------|
| 谁划区域 | **玩家自己** | **管理员** |
| 主要工具 | 金 shovel | WorldEdit |
| 形状 | **只能矩形** | 多边形、圆柱、旗帜区域 |
| 有 GUI 吗 | **没有** | 有 |
| 适合什么 | 生存服「谁的家」 | RPG 服的「主城/商店/活动区」 |

**判断标准很简单：**

- 「每个人要有自己的家」→ GriefPrevention
- 「我要建主城，有传送区、活动区、外人禁入区」→ [WorldGuard](#/plugin/worldguard)

**两个可以共存**，很多服同时装。玩家用 GP 保护自己的家，管理员用 WG 划公共区域。

### 2. 核心机制：claim blocks

理解 claim blocks 是理解这个插件的关键。

**领地不是无限的，要花「地块」**：

```
新玩家       → 起始 100 格
在线 1 小时  → +100 格
上限         → 80000 格
```

一块领地**占用的格数 = 占地面积**（跟高度无关，GP 是垂直全柱保护）。

所以：

- 10×10 的地 = 100 格 → 新玩家的初始额度刚好够一小块
- 50×50 = 2500 格 → 要攒 25 小时
- 想要大基地 → 得在线攒，或者管理员给 bonus

**这个经济设计是 GP 的核心。** 它天然限制了「一个人占半个地图」，不需要管理员挨个审核。

### 3. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | Paper / Spigot / Purpur / Bukkit |
| 硬依赖 | **无** |
| 可选 | Vault + 经济插件（买卖 claim blocks）、WorldGuard（补强区域） |

> ⚠️ **注意：官方支持列表里没有 Folia。** 用 Folia 的话请谨慎，先在测试服验证。

### 4. 安装

- 仓库：<https://github.com/GriefPrevention/GriefPrevention>
- 官网：<https://griefprevention.com/>
- 文档：<https://docs.griefprevention.com>

jar 丢进 `plugins/`，重启。生成：

```
plugins/GriefPrevention/
├── config.yml
├── data/            ← 领地数据
└── ...
```

**领地在 `data/` 里用扁平文件存**，不需要数据库。这既是优点（简单）也是缺点（**多服不同步**）。

### 5. 玩家怎么圈地（这段服主也要讲给玩家听）

**方式一：金 shovel 右键两个角**

1. 手持**金 shovel**（真的金 shovel，不是铁的）
2. 右键第一个角
3. 右键对角的那个角
4. 中间区域就是你的领地

边界会临时显示为金块和萤石。

**方式二：放第一个箱子自动生成**

新玩家**第一次放箱子**时，GP 会自动在箱子周围生成一小块领地（默认 9×9）。这是防「还没学会用 shovel 就被熊了」的兜底设计。

**新玩家在世界里没箱子** → 造一个，合上，9×9 保护自动生效。

### 6. 常用玩家命令

| 命令 | 别名 | 说明 |
|------|------|------|
| `/AbandonClaim` | `unclaim`, `declaim` | 放弃脚下的领地（**退还格子**） |
| `/AbandonTopLevelClaim` | — | 放弃领地及其所有子领地 |
| `/AbandonAllClaims` | — | 放弃全部领地 |
| `/Claim [半径]` | `createclaim`, `makeclaim`, `newclaim` | 以脚下为中心创建领地，可给半径 |
| `/ExtendClaim` | `expandclaim`, `resizeclaim` | 朝你面向的方向扩/缩边界 |
| `/Trust <玩家>` | `/t` | 给对方**完整建造权限** |
| `/ContainerTrust <玩家>` | `/ct` | 只能用箱子/熔炉/床/按钮/动物，**不能改方块** |
| `/AccessTrust <玩家>` | `/at` | 只能进门/用床/按钮拉杆，**别的都不行** |
| `/ManageTrust <玩家>` | `permissiontrust`, `pt` | 对方可以继续给别人权限 |
| `/UnTrust <玩家>` | `/ut` | 撤销该玩家所有权限 |
| `/UntrustAll` | — | 撤销领地内所有人的权限 |
| `/TrustList` | — | 查看当前领地的权限列表 |
| `/SubdivideClaims` | `/sc` | 铲子切到**子领地模式** |
| `/RestrictSubclaim` | `/rsc` | 让子领地不继承父领地权限 |
| `/BasicClaims` | `/bc` | 铲子切回普通模式 |
| `/ClaimsList` | — | 自己的领地和剩余格子 |
| `/Trapped` | — | **被卡在别人领地里时脱困** |
| `/BuyClaimBlocks` | `/BuyClaim` | 用钱买格子（需 Vault） |
| `/SellClaimBlocks` | `/SellClaim` | 把格子换回钱（需 Vault） |
| `/UnlockDrops` | — | 死亡掉落物让别人捡 |
| `/ClaimExplosions` | — | 切换领地内是否允许爆炸 |

> **`/Trapped` 值得单独说** —— 被别人领地困住（挖了路被围死、被锁在笼子里）时用这个脱身，**有较长冷却**，防止用它逃狱。

**`public` 这个特殊参数**很多人不知道：

```
/AccessTrust public    → 所有人可以进门、用床，但箱子不能碰
```

开店铺、做公共交互区用这个。

### 7. 常用管理命令

| 命令 | 别名 | 权限 | 说明 |
|------|------|------|------|
| `/AdminClaims` | `/ac` | `griefprevention.adminclaims` | 铲子切到管理模式，创建**无主领地**（保护出生点用） |
| `/DeleteAllAdminClaims` | — | `griefprevention.adminclaims` | 删掉所有管理领地 |
| `/AdminClaimsList` | — | `griefprevention.adminclaims` | 列出管理领地 |
| `/BasicClaims` | `/bc` | — | 切回普通模式 |
| `/IgnoreClaims` | `/ic` | `griefprevention.ignoreclaims` | **临时忽略所有领地保护**（自己排查问题用） |
| `/DeleteClaim` | `/dc` | `griefprevention.deleteclaims` | 删掉脚下的领地（不论是不是你的） |
| `/DeleteAllClaims <玩家>` | — | `griefprevention.deleteclaims` | 删掉某玩家全部领地 |
| `/AdjustBonusClaimBlocks` | `/acb` | `griefprevention.adjustclaimblocks` | 给玩家加减**额外格子** |
| `/AdjustBonusClaimBlocksAll` | `/acball` | `griefprevention.adjustclaimblocks` | 给所有在线玩家加减 |
| `/SetAccruedClaimBlocks` | `/scb` | `griefprevention.adjustclaimblocks` | 直接设定已累积格子 |
| `/RestoreNature` | `/rn` | `griefprevention.restorenature` | 铲子切到**自然修复**模式（把地形还原） |
| `/RestoreNatureAggressive` | `/rna` | `griefprevention.restorenatureaggressive` | 激进修复（连基岩层一起） |
| `/RestoreNatureFill` | `/rnf` | `griefprevention.restorenatureaggressive` | 填充模式 |
| `/TransferClaim` | — | `griefprevention.transferclaim` | 管理领地转成私人领地 |
| `/SoftMute` | — | — | 半静音（软静音的人之间仍能互相听见） |
| `/DeleteClaimsInWorld <世界>` | — | `griefprevention.deleteclaimsinworld` | **仅控制台**，删某世界所有领地 |
| `/DeleteUserClaimsInWorld <世界>` | — | `griefprevention.deleteclaimsinworld` | **仅控制台**，删某世界所有玩家领地 |
| `/GPreload` | `reload` | — | 重载配置（**不是完整重载插件**） |

> ⚠️ `/DeleteClaimsInWorld` 和 `/DeleteUserClaimsInWorld` **只能在控制台执行**，而且是**不可撤销的批量操作**。执行前先备份 `data/` 目录。

### 8. 关键配置

`plugins/GriefPrevention/config.yml`，主参数在 `GriefPrevention.Claims` 段下：

```yaml
GriefPrevention:
  Claims:
    InitialBlocks: 100              # 新玩家起始格子
    BlocksAccruedPerHour: 100       # 每在线小时累积
    MaxAccruedBlocks: 80000         # 累积上限
    AutomaticNewPlayerClaimsRadius: 4   # 首次放箱子自动领地的半径
    MinimumWidth: 5                 # 领地最小宽度
    MinimumArea: 100                # 领地最小面积
```

其他重要的（完整列表以官方配置文件注释为准）：

| 配置项 | 作用 | 调它的场景 |
|--------|------|-----------|
| `PVP` | 领地里能否 PvP | 生存服设 `false`，PVP 服设 `true` |
| `Allowed PVP Types` | 允许的 PvP 类型 | 精细控制 |
| `LoseInventoryOnDeath` | 死亡是否掉落全部物品 | 生存服设 `true` |
| `AutoRemoveEntitiesSeconds` | 自动清理掉落物的秒数 | 觉得地上太乱就调小 |
| `FireSpread` | 火是否蔓延 | 保护建筑重要 |
| `WaterFlow` | 水是否流动 | 防止水毁建筑 |
| `BlockPlace` / `BlockBreak` | 领地内能否放/破坏方块 | — |
| `AnimalDrops` | 动物是否掉落 | 刷怪农场常见开关 |

> ⚠️ **领地保护状态是按世界分别设置的**，每个世界可以独立配置 Survival 模式（保护开启）或 Creative 模式（保护关闭）。技术/建筑世界通常关保护。

**`InitialBlocks` 和 `BlocksAccruedPerHour` 是新手服最该调的两个值。**

- 新手服玩家少、在线时间短 → 调大，否则玩家永远攒不够格子
- 老服/挂机服 → 保持默认

### 9. 常见坑

**金 shovel 划不了地**

- 手里拿的是**金 shovel** 吗？（不是木铲也不是铁铲）
- 你**已经有领地**了吗？GP 默认**不能重叠**——已经有地的人不能直接圈新的，得先放弃或用子领地
- 检查 `MinimumWidth` / `MinimumArea` 是不是设太大了

**`/Trapped` 冷却太长**

设计如此，防逃狱。紧急情况可以找 OP 用 `/IgnoreClaims` 处理。

**忘了 `/bc` 铲子还在子领地模式**

`/SubdivideClaims` 切了模式之后**必须** `/bc` 切回来。忘了的话后面所有右键操作都会变成建子领地，症状是「我右键怎么什么都没发生」。

**管理领地建不了（提示没权限）**

需要 `griefprevention.adminclaims`。**这个权限别随便给**——它能创建并修改无主领地，等于绕过所有格子限制。

**玩家说「我明明是岛主但放不下方块」**

大概率两个原因：

1. 他在**另一个玩家的领地**里（GP 不显示明确边界，位置看错很常见）
2. 该领地的某个 flag 被关了

让管理员跑 `/IgnoreClaims` 临时绕过，就能确认是不是保护问题。

**升级/换世界后领地全丢**

数据在 `plugins/GriefPrevention/data/`。**换服必须带走这个目录。** 只备份 `config.yml` 等于把所有领地丢了。

**Folia 上行为异常**

官方支持列表里没有 Folia。先在测试服验证。

**死循环：玩家被卡在别人领地里出不来**

`/Trapped` 冷却期间是出不来的。这时需要管理组介入了。

### 10. 什么时候别用 GriefPrevention

- **需要复杂形状的区域** —— 只能矩形，做不了多边形旗帜区。这种需求用 WorldGuard。
- **需要 GUI 管理** —— 全靠命令和两把铲子，服主自己都容易记错命令。
- **玩家流动性极高的 RPG 服** —— 领地归属和角色绑定会很麻烦。
- **Folia 服务器** —— 官方未标注支持。
- **需要跨服共享领地** —— 扁平文件存储，天然不支持。

### 11. 反过来，什么时候它比 WorldGuard 好

- **纯生存服** —— 玩家自己的家就是全部需求，GP 的自助模型最省管理成本
- **不想给管理员添活** —— 玩家自己圈地、自己互授权限
- **小服** —— 几块管理领地 + 玩家自助就够了

### 12. 关于汉化

> ⚠️ **本站未核实到该插件的官方中文语言文件机制，若要汉化需自行确认。**
>
> GriefPrevention 的提示文本历来是**内嵌在 jar 里**的，社区汉化通常靠直接改 jar 内资源文件。**当前 `16.18.7` 版本是否存在官方独立语言文件、路径在哪，本站没有核实到**。请以官方文档和实际生成的 `plugins/GriefPrevention/` 目录为准。

## 下一步

- 需要复杂区域 → [WorldGuard](#/plugin/worldguard)
- 区域保护怎么设计 → [WorldGuard 区域保护](#/guide/region-protection)
- 数据备份和迁移 → [服务器迁移](#/guide/server-migration)
- 多世界怎么配保护 → [多世界搭建](#/guide/multi-world-setup)
