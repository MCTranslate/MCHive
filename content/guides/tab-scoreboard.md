---
id: tab-scoreboard
title: 记分板与 Tab 列表实战：让服务器「看得见」信息
description: 侧边栏记分板、Tab 列表、BossBar 怎么显示余额和前缀 — 先讲清 PlaceholderAPI / TAB / LuckPerms 三者分工，再给 TAB 6.2.0 的真实配置键、变量速查表与常见坑。
icon: 📊
tags: [记分板, Tab列表, 变量, PlaceholderAPI, TAB, 美化]
order: 22
---

# 记分板与 Tab 列表实战：让服务器「看得见」信息

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.3）。文中版本号、变量名、命令与配置键均对照官方 jar 与官方接口核对过。
>
> 本页承诺：**只推荐免费 / 开源插件**。

新手最常见的一个误解是：「我装了记分板插件，为什么余额那一行是空的？」

答案通常是：记分板插件自己**并不知道**你有多少钱。它只会画格子，格子里的数字得别人给它。

这篇教程先讲清「谁提供数据、谁搬运数据、谁把数据画出来」，再给一套能直接抄的 TAB 配置。

---

## 一、先搞清三者关系（全文最关键的一节）

服务器里的「信息展示」从来不是一个插件完成的，而是**三层**配合：

| 层级 | 代表插件 | 干什么 | 缺了会怎样 |
|------|---------|--------|-----------|
| **① 数据来源** | [LuckPerms](#/plugin/luckperms)（前缀/后缀/组名）、[EssentialsX](#/plugin/essentialsx)（余额） | 真正持有数据 | 变量解析出来是空的 |
| **② 变量接口** | [PlaceholderAPI](#/plugin/placeholderapi)（下称 PAPI）+ 扩展 | 把 ① 的数据翻译成统一的 `%xxx%` 写法 | 变量原样显示成 `%xxx%` |
| **③ 展示层** | **TAB** | 把 `%xxx%` 画到侧边栏 / Tab 列表 / BossBar / 头顶 | 有数据也没地方显示 |

一句话概括：

```
LuckPerms / EssentialsX = 真正有数据的那位（数据在它手里）
PlaceholderAPI          = 统一变量插座（自己不产生内容）
TAB                     = 拿变量去画界面（自己也不存数据）
```

### 「只装 TAB 能不能用？」——能，但只能显示 TAB 自己会算的东西

TAB 自带一批**内部变量**，不需要 PAPI：玩家名、延迟、在线人数、TPS、内存、世界名……这些是 TAB 自己从服务端 API 拿的。

而 **「只装 PAPI 能不能用？」——不能。** PAPI 只负责把 `%变量%` 替换成内容，自己不显示任何东西；没有 TAB 这类展示插件，玩家什么都看不到。

> 想显示 **PAPI 生态里的变量**（余额、权限组前缀、任何自定义扩展）时，才需要 PAPI。
>
> 判断方法很实用：把变量写进配置，进游戏看那一格——显示成 `%vault_eco_balance%` 原样 = 缺 PAPI 或对应扩展；显示成空白 = 数据层没给值。
>
> 这个分工和 [经济系统搭建](#/guide/economy-setup) 里的「提供方 / 接口 / 消费方」完全一致，只是把「钱」换成了「任意信息」。

---

## 二、展示插件选型：TAB

本站只推荐免费 / 开源插件。这一类（Tab 列表 + 记分板 + BossBar 三合一）推荐 **TAB**（作者 NEZNAMY）。

### 为什么是它（均为实际核对数据）

| 项目 | TAB |
|------|-----|
| 许可证 | **Apache-2.0**（开源免费） |
| 最新版本 | **6.2.0**（2026-09-17 发布） |
| **是否支持 MC 26.3** | **支持**（见下方核实依据） |
| 加载器 | Paper / Purpur / Folia（`folia-supported: true`）；另有 Velocity / BungeeCord / Fabric / NeoForge 版本 |
| jar 内 `api-version` | `1.13`（避免 legacy 警告，不代表只支持 1.13） |
| 是否需要 PAPI | **不需要**（`softdepend`，只在你用 PAPI 变量时才需要） |

### 26.3 支持情况：核实结论

结论是**支持**，两条依据都可追溯：

1. **6.2.0 的 GitHub Release 说明原文**：*Added 26.3 Bukkit support and removed support for 1.19.1 - 1.19.3*；
2. **`TAB.v6.2.0.jar` 内的版本校验提示串**（解包 `me/neznamy/tab/platforms/bukkit/BukkitTAB.class` 可见）：
   `[TAB] This jar only supports 1.7.10, 1.8.8, 1.12.2, 1.16.5, 1.17.1, 1.18.2 and 1.19.4 - 26.3`

也就是说：**MC 26.3 直接用 TAB 6.2.0 即可，不需要等更新，也不需要换方案。** 上一版 6.1.3（2026-09-05）**没有**这条说明，从旧版升上来的请确认实际版本。

> 插件自身的提示语可在 `plugins/TAB/messages.yml` 里改，汉化思路见 [插件汉化](#/guide/plugin-localization)。

### ⚠ 下载别下错：两个 jar 只有一个能用

6.2.0 的 Release 页提供两个 Bukkit 产物，**26.3 必须选第一个**：

```
✅ TAB.v6.2.0.jar                          ← 通用版（universal），26.3 用这个
❌ TAB.v6.2.0.-.Paper.1.20.5.-.1.21.4.jar   ← 仅面向 Paper 1.20.5–1.21.4，26.3 不要用
```

核实方式：解包看 `me/neznamy/tab/platforms/bukkit/` 下的版本包——通用版内含 `v26_1`、`v26_2`、`paper_26_2` 等 26.x 实现包；另一个只有 `paper_1_20_5`、`paper_1_21_2`、`paper_1_21_4`，**没有 26.x 的实现**。README 原文：*"The universal jar contains all modules for all supported platforms."*

### 下载地址（官方）

```
项目页（源码 / Wiki）：https://github.com/NEZNAMY/TAB
GitHub Releases（推荐）：https://github.com/NEZNAMY/TAB/releases
SpigotMC：https://www.spigotmc.org/resources/57806/
Modrinth：https://modrinth.com/plugin/tab-was-taken
```

> ⚠ **Modrinth 上的 slug 是 `tab-was-taken`，不是 `tab`。** 那个叫 `tab` 的项目（"Fabric Tab List"）是**另一个 fabric 模组**，与本页的 Bukkit 插件毫无关系。认准作者 NEZNAMY。下载只认官方页，别用来路不明的「整合包」，见 [插件组合](#/guide/plugin-combos)。

### 安装

把 `TAB.v6.2.0.jar` 放进 `plugins/` 并重启，首次生成 `plugins/TAB/`。验证：`/plugins` 里 TAB 是绿色、控制台无报错。配置都在该目录下（名字取自 jar 内 `config/`）：

```
plugins/TAB/config.yml        ← 主配置：记分板 / Tab / BossBar / 刷新频率
plugins/TAB/groups.yml        ← 按权限组设置前缀、后缀、Tab 名
plugins/TAB/users.yml         ← 按单个玩家覆盖（UUID 或玩家名）
plugins/TAB/animations.yml    ← 轮播动画（Header/Footer 里那个流动的横条）
plugins/TAB/messages.yml      ← 插件自己的提示语
```

---

## 三、最小可用流程：一步步装、一步步验

严格按顺序做。**每步都验一下**，出问题能立刻定位到是哪一层断了。

### 步骤 1：装数据来源（LuckPerms + 经济插件）

按 [权限系统设计](#/guide/permissions-design) 装好 LuckPerms，按 [经济系统搭建](#/guide/economy-setup) 装好 EssentialsX（或你选的经济插件）+ Vault。

### 步骤 2：装 PAPI

下载 **2.12.3**（2026-07-03 发布，官方标注支持 MC 1.8 – 26.3），放进 `plugins/` 重启。

> PAPI 首次启动会在 `plugins/PlaceholderAPI/` 生成 `config.yml`，常用开关有 `check_updates`、`cloud_enabled`（eCloud 开关，默认 `true`）。PAPI **没有任何语言文件**，不需要汉化，详见 [PlaceholderAPI 插件页](#/plugin/placeholderapi)。

### 步骤 3：装扩展（关键，最容易漏）

PAPI 装完变量池是**空的**，必须下载扩展：

```
/papi ecloud download Player
/papi ecloud download Server
/papi ecloud download Vault
/papi ecloud download LuckPerms
/papi reload
```

下载成功后 PAPI 会提示 `Make sure to type /papi reload to enable your new expansion!`——**别漏了 `/papi reload`**，否则扩展已躺在文件夹里但没被加载。

> 扩展保存在 **`plugins/PlaceholderAPI/expansions/`**。手动下载的扩展 jar 也放这里，放完同样要 `/papi reload`。
>
> 这四个扩展都已在 PAPI 官方 eCloud 目录（`https://ecloud.placeholderapi.com/api/v3/?platform=bukkit`）中核实存在：Player 2.0.9、Server 2.7.3、Vault 1.8.3、LuckPerms 5.4-R2。

### 步骤 4：用 `/papi parse` 验证变量链路

这是最有价值的调试手段，一定要会用：

```
/papi parse me 余额: %vault_eco_balance%
```

- 返回 `余额: 12345.0` → 数据层 → PAPI 链路通了；
- 返回 `余额: %vault_eco_balance%`（原样）→ **扩展没装或没 reload**；
- 返回 `余额: `（空白）→ 扩展装了但取不到值（多半是 Vault 后面没有经济实现，见 [经济系统搭建](#/guide/economy-setup)）。

命令格式是 `/papi parse {target} {message}`，`me` 就是自己。

### 步骤 5：装 TAB，改配置，重载

按第六节改 `plugins/TAB/config.yml`，然后 `/tab reload`。

> 改了 PAPI 扩展要 `/papi reload`；改了 TAB 配置要 `/tab reload`。**这两个重载是两件事**，很多人只做其中一个。

### 步骤 6：二次验证 + 进游戏看效果

```
/tab parse <玩家> %vault_eco_balance%
```

TAB 会返回它自己解析出来的值。PAPI 侧正常、TAB 侧不正常，说明问题出在 TAB（通常是刷新配置或 `display-condition`）。最后进游戏验证：侧边栏用 `/sb` 切换（默认 `toggle-command`），BossBar 用 `/bossbar`，Tab 列表按 Tab 键直接看。

---

## 四、PAPI 命令速查（取自 2.12.3 jar 内的命令帮助文本）

主命令是 `placeholderapi`，别名 **`papi`**。下面这些子命令的用法串是**从 jar 内 `CommandECloud` 的帮助菜单原文提取**的，可以直接对照：

| 命令 | 作用 |
|------|------|
| `/papi ecloud list <all/{作者}/installed> {页码}` | 列出可用扩展 |
| `/papi ecloud info <扩展名> {版本}` | 看某个扩展的信息 |
| `/papi ecloud placeholders <扩展名>` | **列出某个扩展支持哪些变量**（查变量首选） |
| `/papi ecloud download <扩展名> {版本}` | 下载扩展，下完要 `/papi reload` |
| `/papi ecloud update <扩展名/all>` | 更新扩展 |
| `/papi ecloud refresh` / `clear` | 刷新 / 清空本地扩展目录缓存 |
| `/papi parse {目标} {文本}` | 实测变量替换结果（调试首选） |
| `/papi parserel {目标一} {目标二} {文本}` | 解析「关系型」变量（两个玩家之间） |
| `/papi reload` | 重载 PAPI 与配置，启用新扩展 |
| `/papi list` | 列出已激活的扩展 |

> 权限：`placeholderapi.admin` 与 `placeholderapi.ecloud.*` 默认都是 **op**。
>
> 提示 *"The eCloud Manager is not enabled!"* → 检查 `cloud_enabled`（默认 `true`）；提示 eCloud 无数据 → 先 `/papi ecloud refresh`，仍不行可能是防火墙 / 机房屏蔽，详见 `https://placeholderapi.com/ecloud-blocked`。

---

## 五、变量速查表

分两类：**TAB 自带**（不用装 PAPI）和 **PAPI 扩展提供**（必须装对应扩展）。下表每一个变量都已在官方产物中核实存在。

### TAB 自带变量（不需要 PAPI）

取自 `TAB.v6.2.0.jar` 内的变量注册表：

| 变量 | 含义 |
|------|------|
| `%player%` | 玩家名 |
| `%displayname%` | 显示名（含昵称插件改过的名字） |
| `%world%` | 所在世界名 |
| `%group%` | 玩家的主权限组名 |
| `%ping%` / `%health%` / `%deaths%` / `%gamemode%` | 延迟（ms）/ 生命值 / 死亡数 / 游戏模式 |
| `%online%` / `%worldonline%` / `%serveronline%` | 在线人数 / 本世界在线 / 本服在线 |
| `%staffonline%` / `%nonstaffonline%` | 有 `tab.staff` 权限的在线人数 / 非管理在线人数 |
| `%tps%` / `%mspt%` | 服务端 TPS / 每 tick 毫秒 |
| `%time%` / `%date%` | 当前时间 / 日期（格式见 `placeholders` 段） |
| `%memory-used%` / `%memory-max%` | 已用 / 最大内存（MB）；另有 `-gb` 后缀版本 |
| `%vanished%` | 是否处于隐身状态 |
| `%player-version%` / `%player-version-id%` / `%bedrock%` | 客户端版本 / 版本号 / 是否基岩版（配合 [跨版本](#/guide/version-compat) 用） |
| `%luckperms-prefix%` / `%luckperms-suffix%` | LuckPerms 前缀 / 后缀（**注意是短横线**） |
| `%luckperms-prefixes%` / `%luckperms-suffixes%` / `%luckperms-weight%` | 全部前缀 / 全部后缀 / 权限组权重 |

### 需要 PAPI 扩展的变量

| 变量 | 含义 | 需要哪个扩展 |
|------|------|-------------|
| `%player_name%` / `%player_displayname%` | 玩家名 / 显示名 | Player |
| `%player_world%` | 所在世界名 | Player |
| `%player_x%` / `%player_y%` / `%player_z%` | 三轴坐标 | Player |
| `%player_health%` / `%player_ping%` / `%player_level%` | 生命值 / 延迟（ms）/ 经验等级 | Player |
| `%player_gamemode%` / `%player_first_join_date%` | 游戏模式 / 首次进服日期 | Player |
| `%server_online%` / `%server_max_players%` | 在线人数 / 最大在线数（凑成 `12/100`） | Server |
| `%server_uptime%` / `%server_ram_used%` | 运行时长 / 已用内存 | Server |
| `%server_tps_1%` | 1 分钟 TPS（另有 `_5` / `_15`） | Server |
| `%vault_eco_balance%` | 余额（原样数值） | Vault（**且需要 Vault + 经济插件**） |
| `%vault_eco_balance_fixed%` / `_formatted%` / `_commas%` | 去小数尾巴 / 带货币单位 / 带千分位 | Vault |
| `%vault_eco_balance_<数字>dp%` | 指定小数位，如 `%vault_eco_balance_2dp%` | Vault |
| `%vault_prefix%` / `%vault_suffix%` / `%vault_group%` | 权限组前缀 / 后缀 / 组名 | Vault |
| `%luckperms_prefix%` / `%luckperms_suffix%` | 权限组前缀 / 后缀（**下划线**） | LuckPerms |

> **两个高频坑，务必看这里**：
>
> 1. **`%luckperms-prefix%`（TAB 自带，短横线）和 `%luckperms_prefix%`（PAPI 扩展，下划线）是两个不同的变量。** 前者由 TAB 直接读 LuckPerms，后者走 PAPI 的 LuckPerms 扩展。写错的那一个会原样显示。TAB 官方默认 `groups.yml` 用的是短横线版本。
> 2. **`%vault_rank%` 不存在。** 想显示「等级 / 身份」用 `%vault_group%`（组名）或前缀变量。硬写 `%vault_rank%` 的结果就是原样显示。

### 查变量的首选方法（比背表靠谱）

```
/papi ecloud placeholders Player
/papi ecloud placeholders Vault
```

会直接列出该扩展支持的所有变量，永远是最新版，比任何教程都准。也可以查 [官方 Wiki](https://wiki.placeholderapi.com/)。

---

## 六、可直接复制的配置（键名取自 TAB 6.2.0 真实默认配置）

### 侧边栏记分板（`config.yml` 的 `scoreboard` 段）

默认 `enabled: false`，**必须手动打开**才会有记分板：

```yaml
scoreboard:
  enabled: true
  toggle-command: /sb              # 玩家自行开关记分板的命令
  remember-toggle-choice: false    # 是否记住玩家的开关选择（重启后仍生效）
  hidden-by-default: false         # 是否默认隐藏（要玩家自己 /sb 打开）
  delay-on-join-milliseconds: 0    # 进服后延迟多久显示
  scoreboards:
    scoreboard:
      title: "<#E0B11E>我的服务器</#FF0000>"
      lines:
        - "&7%date%"
        - ""
        - "&6服务器:"
        - "* &e在线&7: &f%online%"
        - "* &e本世界&7: &f%worldonline%"
        - "&6个人信息:"
        - "* &b延迟&7: &f%ping%&8ms"
        - "* &b世界&7: &f%world%"
        - "* &b余额&7: &f%vault_eco_balance_fixed%"
```

> `scoreboards` 下可以放**多套**记分板，用 `display-condition` 决定谁看哪一套。默认配置里就有一套示例：
> `display-condition: "%player-version-id%>=765;%bedrock%=false"`（只给 1.20.3+ 且非基岩版的玩家看）。分号表示「且」。

### Tab 列表头部 / 底部（`header-footer` 段）

```yaml
header-footer:
  enabled: true
  designs:
    default:
      header:
        - "&3&l我的服务器"
        - "&7欢迎回来，&a%player%&7！"
        - "&7在线：&f%online%&7 人"
        - ""
      footer:
        - "&7延迟：&f%ping%&7ms  &7TPS：&f%tps%"
        - "&7余额：&f%vault_eco_balance_commas%"
        - "&7%time%"
        - ""
```

`designs` 下同样支持多套，用 `display-condition` 按世界/玩家区分（默认配置里有一套 `world-test` 示例：`display-condition: "%world%=test"`）。

### Tab 列表右侧数字（`playerlist-objective` 段）

就是玩家名字右边那一列数字：

```yaml
playerlist-objective:
  enabled: true
  value: "%ping%"                 # 排序 / 比较用的原始值
  fancy-value: "&7延迟: %ping%"    # 实际显示出来的文本
  title: "TAB"                    # 列名，仅基岩版可见
  render-type: INTEGER            # INTEGER（数字）或 HEARTS（心）
```

### BossBar（`bossbar` 段）

```yaml
bossbar:
  enabled: true
  toggle-command: /bossbar
  remember-toggle-choice: false
  hidden-by-default: false
  bars:
    ServerInfo:
      style: "PROGRESS"     # 1.9+ 可选 PROGRESS / NOTCHED_6 / NOTCHED_10 / NOTCHED_12 / NOTCHED_20
      color: "BLUE"         # BLUE / GREEN / PINK / PURPLE / RED / WHITE / YELLOW
      progress: "100"       # 进度百分比
      text: "&f在线 &b%online%&f 人 &8|&7 TPS &b%tps%"
```

### 前缀 / 后缀 / Tab 名（`groups.yml`）

`groups.yml` 里每个键就是一个权限组名，`_DEFAULT_` 是所有组的兜底配置。下面是 TAB 6.2.0 的官方默认值，能直接用：

```yaml
_DEFAULT_:
  tabprefix: "%luckperms-prefix%"   # Tab 列表里的前缀
  tagprefix: "%luckperms-prefix%"   # 头顶名字的前缀
  customtabname: "%player%"         # Tab 列表里显示的名字
  tabsuffix: "%luckperms-suffix%"   # Tab 列表里的后缀
  tagsuffix: "%luckperms-suffix%"   # 头顶名字的后缀
```

给某个组单独设置就再写一个组名（会覆盖 `_DEFAULT_`），如 `vip: {tabprefix: "&6&l[VIP] &r", tagprefix: "&6&lVIP &r"}`。单个玩家覆盖写在 `users.yml`（键是玩家名或在线 UUID）。可用属性只有这几个：**`tabprefix`、`tabsuffix`、`tagprefix`、`tagsuffix`、`customtabname`、`belowname`**（取自 jar 内实现）。

> 前缀到底显示哪个，由 **LuckPerms 的 `meta setprefix` 权重**决定，不是 TAB 决定的。TAB 只是把 `%luckperms-prefix%` 的结果显示出来。前缀不对请先去查 [权限系统设计](#/guide/permissions-design) 的 `meta setprefix` 一节。

### 排序（`scoreboard-teams` 段的 `sorting-types`）

决定 Tab 列表里谁排前面，按顺序依次生效（前面的规则先比，比不出高下再用后面的）：

```yaml
scoreboard-teams:
  enabled: true
  enable-collision: true
  invisible-nametags: false
  sorting-types:
    - "GROUPS:owner,admin,mod,helper,vip,default"
    - "PLACEHOLDER_A_TO_Z:%player%"
  case-sensitive-sorting: true
```

可用的排序类型（取自 jar 内实现类）：`GROUPS`、`PERMISSIONS`、`PLACEHOLDER_A_TO_Z`、`PLACEHOLDER_Z_TO_A`、`PLACEHOLDER_LOW_TO_HIGH`、`PLACEHOLDER_HIGH_TO_LOW`。

> `GROUPS:` 后面的组名**顺序就是优先级**，越靠前排越上面，**没写进去的组会被排到最后**。这是「排序不对」的第一嫌疑点。

---

## 七、性能与刷新频率

展示类插件是**持续在跑**的：每隔一段时间就要重新算一遍所有变量、重新发包。刷新越频繁，CPU 开销越大。

相关配置都在 `config.yml`：

```yaml
placeholder-refresh-intervals:
  default-refresh-interval: 500      # 默认刷新间隔（毫秒）
  "%player_health%": 200
  "%player_ping%": 1000
  "%server_uptime%": 1000
  "%server_tps_1_colored%": 1000
  "%server_unique_joins%": 5000
  "%vault_prefix%": 1000
```

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `default-refresh-interval` | `500` | 未单独指定的变量都用这个间隔（毫秒） |
| 单独指定的变量 | 见上 | 可以为具体变量单独设间隔，键名要写**带百分号的完整变量** |
| `permission-refresh-interval` | `1000` | 条件判断里的权限检查、从权限插件取组的间隔 |

**调优思路（保守建议）**：默认 `500` 是官方给的平衡点，绝大多数服不用动；变化慢的变量（日期、总人数、运行时长）单独**调大**；需要跟手感的（血量）官方才调到更短的 `200`；**别把所有变量都调到 50ms**——刷新翻倍不等于体验翻倍，但 CPU 开销是实打实翻倍的。

> 不确定瓶颈在哪，先用 `/tab cpu`（需 `tab.cpu` 权限，默认 op）看各功能实际占用再决定动哪一项。这里刻意不给「能省多少 CPU」的百分比——不同服差异太大，编出来的数字只会误导。更系统的排查见 [卡顿诊断](#/guide/lag-diagnosis) 与 [性能调优](#/guide/performance-tuning)。

---

## 八、常见坑（照着排，省几小时）

| 症状 | 原因与解法 |
|------|-----------|
| 变量**原样显示**成 `%vault_eco_balance%` | 对应扩展没装或没 reload。依次 `/papi ecloud list installed` → `/papi parse me %变量%` → `/papi reload` → `/tab reload`；再检查拼写（两个 `%` 缺一不可、区分大小写） |
| 变量显示成**空白**（不是原样） | 扩展在，但取不到值：`%vault_eco_balance%` 空 → `/vault-info` 的 `Economy:` 是 `None`，见 [经济系统搭建](#/guide/economy-setup)；`%luckperms_prefix%` 空 → 该玩家的组没设过前缀 |
| **前缀不显示** | 查三件事：① LuckPerms 里有没有 `/lp group <组> meta setprefix 100 "&6[VIP] "`；② 变量是 `%luckperms-prefix%`（TAB，短横线）还是 `%luckperms_prefix%`（PAPI，下划线）；③ LuckPerms 的 `meta-formatting` 默认 `format: ["highest"]` + `duplicates: first-only`，**默认只显示权重最高的那一个前缀** |
| **Tab 排序不对** | `sorting-types` 的 `GROUPS:` 没列全或顺序反了——**没写进去的组会排到最后**（头号原因）。也可用 `PLACEHOLDER_HIGH_TO_LOW:%luckperms-weight%` 按权重排 |
| 改了配置**完全没反应** | ① 改的是 `plugins/TAB/` 下的文件；② 执行的是 `/tab reload`（不是 `/reload`）；③ YAML 缩进正确、文件 UTF-8 无 BOM；④ `config.yml` 末尾的 `config-version` 别手动改 |
| **群组服**上变量全空 | 变量只在「显示它的那台服务器」生效。大厅要显示人数，PAPI + 扩展就得装在大厅服，见 [用 Velocity 搭群组服](#/guide/velocity-network) |
| 装了**跨版本插件**后显示异常 | TAB 会配合 ViaVersion / floodgate。用 `display-condition: "%bedrock%=false"` 只给 Java 版显示；用 `%player-version-id%` 按客户端版本分流；渲染异常可试 `compensate-for-packetevents-bug`。见 [版本兼容性速查](#/guide/version-compat) |

> 排序那条有个专门的地雷：`primary-group-finding-list` 是「用哪个组作为主组」的列表，官方注释原文 *"This is not sorting list and has nothing to do with sorting players in tablist!"*——**别拿它调排序**。

### 多世界服：Tab 列表看到不该看到的人

默认所有玩家共享一个 Tab 列表。想按世界隔离，开 `per-world-playerlist`：

```yaml
per-world-playerlist:
  enabled: true
  allow-bypass-permission: false     # true = 有 tab.staff 的人仍能看到全部
  ignore-effect-in-worlds:           # 这些世界里的玩家能看到全部
    - build
  shared-playerlist-world-groups:    # 这几组世界共享同一个列表
    lobby:
      - lobby1
      - lobby2
```

> 世界管理见 [多世界与主城实战](#/guide/multi-world-setup)。

---

## 九、一页速查表

| 我想…… | 怎么做 |
|--------|--------|
| 打开侧边栏记分板 | `scoreboard.enabled: true` → `/tab reload`；玩家开关用 `/sb` |
| 打开 BossBar | `bossbar.enabled: true`，命令 `/bossbar` |
| 改 Tab 右侧数字 | `playerlist-objective.value` / `.fancy-value` |
| 改 Tab 顶部/底部 | `header-footer.designs.default.header` / `.footer` |
| 按组设前缀 / 单独设 | `groups.yml` 写 `tabprefix` / `tagprefix`；`users.yml` 用玩家名或 UUID 作键 |
| 调 Tab 排序 | `scoreboard-teams.sorting-types` 的 `GROUPS:` 列表 |
| 装一个扩展 | `/papi ecloud download <名字>` → `/papi reload` |
| 看某扩展有哪些变量 | `/papi ecloud placeholders <名字>` |
| 测变量能不能用 | `/papi parse me <变量>`；TAB 侧用 `/tab parse <玩家> <变量>` |
| 变量原样显示 / 显示空白 | 缺扩展或没 reload / 数据层没值（查 `/vault-info`、查 LuckPerms meta） |
| 刷新太卡 | 调大 `placeholder-refresh-intervals.default-refresh-interval`；用 `/tab cpu` 定位 |
| 加一行「余额」 | `%vault_eco_balance_fixed%`（需 Vault 扩展 + 经济插件） |
| 显示「12/100」在线 | `%server_online%` + `%server_max_players%`（需 Server 扩展） |
| 显示权限组 | `%vault_group%` 或 `%group%`；**不要写 `%vault_rank%`** |

---

## 下一步

- 前缀 / 权限组还没理清？→ [权限系统设计：别让权限越用越乱](#/guide/permissions-design)（`meta setprefix` 是前缀的总开关）
- 余额显示空白、Vault 没接上？→ [经济系统搭建：从零让服务器「有钱」](#/guide/economy-setup)
- 变量体系想系统了解？→ [PlaceholderAPI 插件页](#/plugin/placeholderapi)（含变量中文注解速查表）
- Tab 列表要跨服同步？→ [用 Velocity 搭群组服](#/guide/velocity-network)
