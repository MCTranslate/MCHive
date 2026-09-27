---
id: server-migration
title: 服务器迁移与升级
description: 换核心、换机器、跨大版本升级 — 停服顺序、该拷哪些目录（Paper 26.x 的新目录结构）、插件数据怎么搬、迁移后怎么验收，一次讲清。
icon: 🚚
tags: [迁移, 升级, 换服, 存档, 备份]
order: 15
---

# 服务器迁移与升级

> 本教程更新于 2026 年 9 月，面向 Paper 26.x / Java 25。迁移是一次性重活——流程对了翻车概率很低，少拷一个目录就是一场事故。
>
> 备份体系（3-2-1 原则、定时备份脚本、灾难恢复）见 [服务器日常运维手册](#/guide/server-maintenance)；数据库层面的搬迁见 [服务器数据库搭建](#/guide/database-setup)。本文只讲**换机、换核心、换版本**这三件事，不重复讲备份体系。

## 一、先分清：你要做的是哪种「迁移」

三种「迁移」的风险完全不同，别混为一谈。

| 类型 | 典型场景 | 风险 | 可逆性 |
|------|----------|------|--------|
| 换核心 | Spigot / Purpur → Paper | 低（同代存档格式一致） | 可逆（换回原核心即可） |
| 换机器 / 换服务商 | 本地搬到云主机、A 机房搬到 B 机房 | 中（考的是「有没有拷全」） | 可逆（保留旧机数据就能回退） |
| 跨大版本升级 | 1.21.11 → 26.3 | 高（存档被改写） | **不可逆** |

> **最重要的一句话**：跨大版本升级后，存档格式会被改写，**升级后的存档无法再用旧版本核心打开**。Paper 官方在 26.1 更新公告里写得很直白：`After upgrading your world to 26.1, you cannot downgrade back to a lower version!`。升级前无论如何先做一份完整备份，并**把备份放到另一台机器或对象存储上**——和生产数据放在同一块硬盘上的「备份」，不叫备份。

## 二、Paper 26.x 的世界目录长什么样（本页最关键的一节）

这是**最容易整篇教程过时**的地方。网上绝大多数「MC 服务器迁移」教程还在教你去拷 `world/`、`world_nether/`、`world_the_end/` 三个平级目录——**那套写法从 Paper 26.1 起已经不对了**。

Paper 26.1 跟随原版改动，把世界存储结构改成了「一个主世界文件夹 + 里面的 `dimensions/`」。官方公告（[papermc.io/news/26-1](https://papermc.io/news/26-1)）给出的结构如下：

```
world/                      ← 文件夹名由 server.properties 的 level-name 决定
├── level.dat               ← 世界元数据（出生点、种子等）
├── data/
│   └── minecraft/          ← 三个维度共享的数据：game rules、计分板、天气…
├── datapacks/
├── dimensions/
│   └── minecraft/
│       ├── overworld/      ← 主世界
│       │   ├── data/{minecraft,paper}/
│       │   ├── entities/
│       │   ├── poi/
│       │   ├── region/     ← 区块文件（*.mca）在这里
│       │   └── paper-world.yml
│       ├── the_nether/     ← 下界（旧结构里是 world_nether/DIM-1）
│       └── the_end/        ← 末地（旧结构里是 world_the_end/DIM1）
├── players/
│   ├── advancements/
│   ├── data/               ← 玩家背包、位置、经验
│   └── stats/
└── session.lock
```

由此得到两个关键结论：

1. **26.1 及以后**：下界、末地不再是独立文件夹，而是 `world/dimensions/minecraft/the_nether/`、`.../the_end/`。**迁移时拷 `world/` 一个目录就够了**（前提是这个 `world/` 里已经包含 `dimensions/`）。
2. **26.1 之前**（含 Spigot 与旧版 Paper）：三个维度是平级的 —— `world/`（主世界，含 `level.dat`）、`world_nether/DIM-1/`、`world_the_end/DIM1/`。**只拷 `world/` 会丢下界和末地**，新服会生成空的下界/末地，玩家在下界的家、末地城刷怪塔会「凭空消失」（其实没丢，是你没拷）。

> **怎么确认自己服是哪一套**：打开服务器根目录，看你的主世界文件夹（`level-name` 对应的那个）里有没有 `dimensions/` 子目录。
> - 有 `dimensions/` → 新结构，只拷主世界文件夹即可；
> - 只有 `region/`、`level.dat`，且根目录另有 `world_nether/`、`world_the_end/` → 旧结构，三个目录都要拷。
>
> 一句话：**以你服实际生成的目录结构为准**，别照抄任何一篇不看版本的教程。

**新旧路径对照表**（排查「某个文件去哪了」时用；旧路径以 `level-name=world` 为例）：

| 数据 | 26.1 之前（旧结构） | 26.1 及以后（新结构） |
|------|--------------------|----------------------|
| 主世界区块 | `world/region/` | `world/dimensions/minecraft/overworld/region/` |
| 下界 | `world_nether/DIM-1/region/` | `world/dimensions/minecraft/the_nether/region/` |
| 末地 | `world_the_end/DIM1/region/` | `world/dimensions/minecraft/the_end/region/` |
| 玩家背包 / 位置 | `world/playerdata/` | `world/players/data/` |
| 成就 | `world/advancements/` | `world/players/advancements/` |
| 统计 | `world/stats/` | `world/players/stats/` |
| 各世界的 `paper-world.yml` | `world_nether/paper-world.yml` | `world/dimensions/minecraft/the_nether/paper-world.yml` |

> 顺带说一句：`dimensions/` 下每个世界文件夹里都有自己的 `region/`、`entities/`、`poi/` 与 `paper-world.yml`；而 `level.dat` 与 `session.lock` 只有世界根目录一份，由服务端自己维护，**不要单独手改**。

### 自定义命名空间的世界（Multiverse）

从 [Multiverse-Core](#/plugin/multiverse-core) 5.7 起，可以用「命名空间」创建世界。用 `/mv create myplugin:pvp_arena normal` 建出来的世界，落在 `world/dimensions/myplugin/pvp_arena/`。

默认命名空间就是 `minecraft`：普通的旧名字（如 `hub`、`resource`）等价于 `minecraft:hub`，文件夹仍在 `minecraft` 命名空间下（形如 `world/dimensions/minecraft/hub/`）；默认三界就是 `world/dimensions/minecraft/{overworld,the_nether,the_end}/`。

> 结论还是那句：**迁整个世界文件夹（连同 `dimensions/`）**，别精确到某个维度单独拷，就不会漏。

## 三、动手前：停服、存档、以及「该拷什么」

### 1. 正确的停服顺序

**绝对不要在服务器运行中直接拷世界目录。** 服务器在跑的时候会持续写盘（自动保存、玩家数据、区块），你拷到一半可能拷到「写了一半」的文件，恢复时就是经典的 `Chunk NBT tag is not valid` 区块损坏。

正确顺序：

```
□ 1. 发公告：至少提前 30 分钟，告诉玩家即将维护
□ 2. 让所有玩家下线（游戏内 /kickall "服务器维护中"）
□ 3. 在控制台执行 save-all flush     ← 注意是 flush，见下方说明
□ 4. 等控制台提示保存完成（视存档大小，几秒到几十秒）
□ 5. 执行 stop，并等进程真正退出（不是命令一发就以为退了）
□ 6. 现在才开始打包 / 拷贝
```

第 3 步的 `save-all` 和 `save-all flush` 区别值得单独说：

| 命令 | 行为 |
|------|------|
| `save-all` | 立即保存玩家数据，并把所有区块**标记为待保存**，区块会「随时间陆续」写盘 |
| `save-all flush` | 立即把**所有玩家和区块**写盘，会短暂冻结服务器一下 |

只执行 `save-all` 就去拷文件，可能还有区块没落盘，所以**迁移/备份场景用 `save-all flush`**。但注意：它只是让「这一瞬间」的数据落盘，进程不死它就会继续写——**它不能替代停服**。

> 进阶玩法是 `save-off`（暂停写盘，玩家/进度/统计文件除外）→ 拷贝 → `save-on`。但对新手，**直接停服最稳**，不用冒这个险。

### 2. 要带走的文件清单

同一台机器换核心基本不用管；换机器/换服务商时，对着这张表勾：

| 优先级 | 文件 / 目录 | 说明 |
|--------|-------------|------|
| **必带** | 世界文件夹（`world/`，旧结构再加 `world_nether/`、`world_the_end/`） | 地形、建筑、玩家数据（背包/位置/经验）全在这里 |
| **必带** | `plugins/` 整个目录 | 注意是**整个目录**，不能只拷 `.jar` |
| **必带** | `server.properties` | 端口、正版验证、白名单等核心设置 |
| **必带** | `eula.txt` | 表示你已同意 EULA；漏了服务端直接拒绝启动 |
| **必带** | `ops.json`、`whitelist.json`、`banned-players.json`、`banned-ips.json` | 谁是指挥官、谁能进服、封禁名单；**漏了不报错，只会「悄悄失效」** |
| **必带** | `config/`（含 `paper-global.yml`、`paper-world-defaults.yml`） | Paper 的全局配置 + 「所有世界的默认值」 |
| **必带** | `bukkit.yml`、`spigot.yml`、`commands.yml`、`permissions.yml`、`help.yml` | 其余服务端配置 |
| 建议带 | 启动脚本（`start.sh` / `start.bat`） | 里面记着 JVM 参数（内存等），换机后照着改路径 |
| 建议带 | 插件用到的外部数据库 | 见第八节——**MySQL 里的数据不在 `plugins/` 里！** |
| 可选 | `usercache.json` | 玩家名→UUID 缓存，会自行重建，带上省事 |
| **不用带** | `libraries/`、`versions/`、`.paper-remapped/`、`cache/` | 服务端启动时会按新环境自动重建 |
| **不用带** | 服务端 `.jar` | 换机器时在新机器重新下载与版本匹配的 jar |
| 视情况 | `logs/`、`crash-reports/` | 仅用于事后排查，一般不必带 |

> 一个真正常见的翻车点：只拷了 `plugins/*.jar`，没拷 `plugins/` 里的各个**子目录**。插件的配置和玩家数据都在子目录里（`plugins/LuckPerms/`、`plugins/Essentials/`……），漏了它们，家、权限、余额、领地全部回默认。**要拷 `plugins/` 就整个目录拷。**

> 另一个「悄悄失效」的坑：`ops.json` 和 `whitelist.json` 不在世界里，最容易被忘。漏了 `ops.json`，换完服你自己都不是 OP 了。

### 3. 打包优于逐文件传输

换机器/换服务商时，**先在旧机上打一个大压缩包再下载**：一个大文件比几万个小区块文件传得快，也不容易在途中静默丢文件。

```bash
# 旧机（Linux）示例：打包世界 + 插件 + 核心配置
tar -czf mc-migrate.tar.gz world plugins config server.properties eula.txt \
    ops.json whitelist.json banned-players.json banned-ips.json \
    bukkit.yml spigot.yml

# 校验体积是否正常：旧机上 4 GB 的存档，下完只剩 300 MB 就是没下完
ls -lh mc-migrate.tar.gz
```

## 四、server.properties：迁移时最该改的几个键

换机、换核心后八成要动 `server.properties`。下表键名与默认值取自 [Paper 官方文档](https://docs.papermc.io/paper/reference/server-properties/)与 Minecraft Wiki；**默认值会随版本变化，以你实际生成的文件为准**（改完记得停服再改）。

| 键名 | 默认值（参考） | 迁移时为什么要关注 |
|------|---------------|--------------------|
| `level-name` | `world` | 主世界文件夹名。**改错了新核心会找不到世界，直接生成一个全新的空世界** |
| `server-port` | `25565` | 监听端口。换机后端口可能变，记得同步客户端地址、防火墙与端口映射（见 [端口映射与外网访问](#/guide/port-forwarding)） |
| `server-ip` | 空 | 绑定到哪个 IP，一般留空（监听全部）。换机后若旧值写死了某张网卡的 IP，可能直接起不来 |
| `online-mode` | `true` | **正版验证开关，迁移时尽量别动**——改动会改变玩家 UUID，家和权限会「集体消失」（详见第十节） |
| `view-distance` | `10` | 视距（3–32）。换到性能更弱/更强的机器时调 |
| `simulation-distance` | `10` | 实体模拟距离（3–32）。同上 |
| `max-players` | `20` | 人数上限 |
| `white-list` | 视版本而异 | 是否启用白名单；改它的同时别忘了把 `whitelist.json` 一起搬 |
| `enforce-whitelist` | `false` | 是否强制把不在白名单的人踢出去 |
| `motd` | `A Minecraft Server` | 服务器列表里显示的标语 |
| `difficulty` | `easy` | 难度 |
| `gamemode` | `survival` | 默认游戏模式 |
| `region-file-compression` | `deflate` | 区域文件压缩格式（`deflate`/`lz4`/`none`，`gzip` 仅 Paper）。26.1 起 Paper 把旧的 `unsupported-settings.compression-format` 并入了这个键 |

> **`white-list` 的默认值提醒**：Paper 官方文档记录为 `false`，而 26.3 起原版把它改成了 `true`。值随版本变，**以你生成的文件为准**，别照抄任何一个数字。

> **坑：`pvp`、`enable-command-block`、`allow-nether`、`spawn-monsters` 这四个键已经不存在了。** 从 1.21.9（快照 25w35a）起，原版把它们从 `server.properties` 移除、改成了**游戏规则**（game rule）。老教程还在教你「在 server.properties 里把 `pvp` 设为 false」——**写了完全无效**，因为服务端根本不认这个键。要关 PvP 请用 `/gamerule pvp false`（游戏规则存在存档里，改完连重启都不需要）。

## 五、场景一：同一台机器换核心

换核心通常是把 Spigot / Purpur / 原版换成 Paper（或反向）。因为同代存档格式一致，这是**风险最低**的一种迁移。

```
□ 1. 确认目标核心支持你当前的 MC 版本（去核心官网看版本列表）
□ 2. 停服（按第三节顺序：save-all flush → stop）
□ 3. 打包备份一份，放到别的盘 / 别的机器
□ 4. 备份 plugins/ 整个目录
□ 5. 用新核心的 jar 替换旧 jar（文件名可保持一致，方便复用启动脚本）
□ 6. 启动，盯控制台 15 分钟：不能有 ERROR / FATAL
□ 7. 自己进服验证（见第九节）
```

几个要点：

- **同代换核心一般不用动世界目录**。但如果旧核心用的是「分体目录」（`world_nether/DIM-1`），而新核心是基于 26.1+ 新布局的 Paper，中间就可能存在一次**目录布局转换**。这种跨布局的情况，务必在**测试服**先走一遍，确认新核心能正确识别旧目录，再动生产服。
- 插件兼容性要重新确认：Spigot 插件通常能在 Paper 上跑，但反向不一定（为 Paper 写的、用了 Paper 独有 API 的插件，未必能在 Spigot 上跑）。
- 换核心不改变世界数据，出错也有退路：**换回原来的 jar 即可**。

## 六、场景二：换机器 / 换服务商

考的是「有没有拷全」。按第三节的清单来，核心步骤：

```
① 旧机：停服 → save-all flush → stop → 打成一个大压缩包
② 传输：下载到本地再上传到新机；或旧机直传新机
③ 新机：装好相同版本的 Java（26.x 需要 Java 25+）
④ 新机：下载与 MC 版本匹配的服务端 jar（注意用新接口，见下方提醒）
⑤ 新机：解压，还原出 world/、plugins/、server.properties 等
⑥ 新机：按需改 server.properties（端口、server-ip），但不要改 online-mode
⑦ 新机：把 MySQL 数据库导入（见第八节）
⑧ 启动，看控制台无 ERROR，进服逐项验证
```

> **下载 Paper 请用新接口**：Paper 已**停用**旧的 `api.papermc.io/v2`（访问会返回 `{"ok":false,"error":"sunset"}`），网上大量教程还在用旧地址。新接口是 `https://fill.papermc.io/v3/projects/paper`，或直接从 [papermc.io/downloads](https://papermc.io/downloads/paper) 页面下。

换机的额外注意点：

- **新机目标目录必须是干净的**：上传前确认目标目录没有旧的残留数据，别把新倒进去的数据和旧 `world/` 混在一起。
- **端口映射要重做**：换了机器，公网 IP 与防火墙规则都变了，客户端地址也要跟着改（见 [端口映射与外网访问](#/guide/port-forwarding)）。
- **MySQL 不会跟着 `plugins/` 走**：如果你的插件用远程数据库，`plugins/` 里只有连接配置，**真正的数据在数据库里**，必须单独导出/导入。

## 七、场景三：跨大版本升级（不可逆）

从 1.21.x 升到 26.x，或 26.1 → 26.2 → 26.3 这类升级，是三种迁移里**唯一不可逆**的。

```
□ 1. 确认目标版本已发布，且你要用的插件都已适配（插件不支持就别升）
□ 2. 做完整备份，并确认备份能恢复（真恢复一次，别只信「我备份了」）
□ 3. 把备份复制到另一台机器 / 对象存储（异地）
□ 4. 停服：save-all flush → stop
□ 5. 替换服务端 jar 到目标版本
□ 6. 先起一次，让核心完成存档格式转换
□ 7. 看完整启动日志：有 ERROR 就停下，回滚
□ 8. 逐个验证玩法（出生点、传送、下界/末地、村民、红石机器）
```

跨大版本升级的老大难：核心升级时会对旧存档做「数据迁移」，可能改变世界高度、生物群系 ID、方块状态格式。社区流传的「升级前先搜 breaking changes」是对的——到核心的官方公告 / Discord 搜 `upgrade X to Y breaking changes`，找不到就别升。

> **26.1 这一跳要特别当心**：它同时做了两件事——(1) 世界存储结构大改（见第二节），(2) 存档不可回退。从旧版本升上来时，核心会**自动把你的世界搬进 `dimensions/`**。这不是丢数据，但意味着：**升级后如果反悔想降级，光换回旧 jar 是没用的**，必须用升级前的备份。升级前那一刻的备份，就是你唯一的安全绳。

> 想让**玩家**先平稳过渡（旧客户端连新服务端）？那是 ViaVersion / ViaBackwards 的活，和本页讲的「服务端升级」不是一回事，见 [版本兼容](#/guide/version-compat)。

**跨度太大就分两跳。** 如果是从更老的版本（如 1.20.x）直奔 26.3，优先考虑在路径上挑一个稳定版本先跳一次、确认世界正常，再跳到目标版本。一次跳得越远，出问题时「是哪一个版本改动导致的」越难排查。

**挑好迁移窗口。** 迁移是停服操作，安排在玩家低峰的时段，预留 1–2 小时，并提前公告（玩家客户端通常也要跟着更新）。跨版本升级尤其不要在节假日晚高峰做实验。

## 八、插件数据搬迁：不是拷了 jar 就完事

插件的数据分两种：**文件型**（在 `plugins/<插件名>/` 里）和**数据库型**（在 MySQL 里）。前者跟着 `plugins/` 目录走，后者必须单独搬。

| 插件 | 数据在哪 | 换机 / 换库怎么搬 |
|------|----------|-------------------|
| [LuckPerms](#/plugin/luckperms) | 默认 H2 单文件：`plugins/LuckPerms/luckperms-h2-v2.mv.db`；也可用 MySQL / YAML 等 | 拷 `plugins/LuckPerms/` 整个目录即可。**若换了存储后端（如 H2→MySQL），数据不会自己搬**：`/lp export 文件名` → 改 `config.yml` 的 `storage-method` → 重启 → `/lp import 文件名` |
| [CoreProtect](#/plugin/coreprotect) | 默认 SQLite：`plugins/CoreProtect/database.db`；也可用 MySQL | 拷 `plugins/CoreProtect/` 即可。**换库不会自动搬历史**：官方在 SQLite↔MySQL 之间搬家靠 `/co migrate-db`，而它是 **CoreProtect 23.0+ 捐赠（Patreon）版专属的控制台命令**，公开版用不了——公开版换库请用数据库工具手动导表，或继续用 SQLite |
| [EssentialsX](#/plugin/essentialsx) | `plugins/Essentials/userdata/<UUID>.yml`（家、余额、昵称都在内） | 拷 `plugins/Essentials/` 整个目录。**它的数据按 UUID 存**，UUID 一变这些文件就「对不上人」 |
| [Multiverse-Core](#/plugin/multiverse-core) | `plugins/Multiverse-Core/worlds.yml` + 世界文件夹 | 两个都要带。只搬世界文件夹、不带 `worlds.yml`，世界的别名/规则会回默认；没被识别时用 `/mv import <文件夹名> <环境>` 重新接管已有世界 |

> **换存储后端 ≠ 数据自动迁移**，这是插件层面最常见的误解。LuckPerms 换 H2 / MySQL / YAML 都要走 export / import；CoreProtect 换 SQLite / MySQL 在公开版没有一键命令。动手前先读插件文档，并**先备份 `plugins/<插件名>/`**。

## 九、迁移后验证清单

切换完成、服务端能起来，只代表「没报错」，不代表「迁成功了」。管理员自己进服，按下表逐项验收：

| 验收项 | 怎么验 | 期望结果 |
|--------|--------|----------|
| 玩家还是原来的账号 | 用原账号登录，`/lp user <名字> info` | 能进；显示的 UUID 与迁移前一致 |
| 权限还在 | `/lp user <名字> info`，再试一条受限命令 | 组、前缀、权限节点都在，命令有权限 |
| 经济余额正确 | `/balance` | 金额与迁移前一致 |
| 家 / 传送点还在 | `/home`、`/homes`、`/back` | 家里的位置正常，没有变成「没有家」 |
| 世界都在 | `/mv list` | 主世界、下界、末地、自定义世界全部在列 |
| 下界/末地没丢（旧结构迁移重点） | 进下界门、去末地看看 | 建筑与原样一致，不是新生成的空地形 |
| 领地 / 区域保护正常 | WorldGuard `/rg list`，并试破坏受保护区域 | 区域在、保护生效 |
| 插件无报错 | 看控制台启动日志 | 出现 `Done (xx.xxxs)!`，且没有 `ERROR` / `SEVERE` |
| CoreProtect 历史可查 | `/co lookup t:1d r:20` | 能查到**迁移前**的记录（说明数据库也迁到了） |
| OP / 白名单 | 看 `/op` 列表、让名单内/外玩家尝试连服 | `ops.json`、`whitelist.json` 都生效 |
| 插件版本兼容 | `/plugins` | 没有红色（未启用 / 报错）的插件 |

> 下界/末地的验收，是**旧结构（26.1 之前）迁移**最容易漏掉的一项。只看主世界正常就宣布成功，结果玩家一进下界发现全是新地形——多半是你只拷了 `world/`，没拷 `world_nether/`、`world_the_end/`。

## 十、常见坑速查

| 症状 | 原因 | 解法 |
|------|------|------|
| 下界 / 末地「重置」了 | 26.1 之前的旧结构里下界末地是独立文件夹，你只拷了 `world/` | 补拷 `world_nether/`、`world_the_end/`；数据没丢 |
| 玩家的家 / 权限 / 余额全没了 | UUID 变了。最常见于 `online-mode` 开关被改动（正版↔离线），或换了登录方式 | 把 `online-mode` 改回原值；UUID 由正版验证/离线算法决定，错位后只能靠备份 + 改回原设置恢复 |
| 改了 `server.properties` 里的 `pvp` / `enable-command-block` 没反应 | 这些键自 1.21.9 起已被移除，改成了游戏规则 | 用 `/gamerule`（或多世界下用 `/mv gamerule` 按世界设置） |
| 插件配置全回默认了 | 只拷了 `.jar`，没拷 `plugins/` 里的插件数据子目录 | 拷整个 `plugins/` 目录，别只拷 jar |
| 自己进服发现自己不是 OP | `ops.json` 没带过来 | 从旧服拷 `ops.json`，或重新 `/op` 自己 |
| 白名单玩家进不来 / 陌生人能进 | `whitelist.json` 没带，或 `white-list` / `enforce-whitelist` 与旧服不一致 | 对齐这两个键，并带上 `whitelist.json` |
| CoreProtect 查不到迁移前的记录 | 用了 MySQL，但只搬了 `plugins/`、没导数据库 | 从旧库导出再导入新库 |
| 换了存储后端后权限/记录「消失」 | 换后端不会自动搬数据 | LuckPerms 走 `/lp export` → `/lp import`；CoreProtect 公开版需手动导表 |
| 服务端起不来，报找不到世界 | `level-name` 指向的文件夹名不对，或世界文件夹没放对位置 | 核对 `level-name` 与磁盘上的实际目录名 |
| 世界出现区块错误 | 没停服就拷，或跨大版本升级异常 | 用备份恢复；跨版本必要时用中间版本过渡，别一步跳太远 |
| 下载 Paper 报 `sunset` | 用了已停用的 `api.papermc.io/v2` 旧接口 | 改用 `fill.papermc.io/v3` 或官网下载页 |

## 下一步

- 迁移前还没搭好备份体系？先补上：[服务器日常运维手册](#/guide/server-maintenance)
- 迁移涉及数据库（LuckPerms / CoreProtect 换 MySQL）？看：[服务器数据库搭建](#/guide/database-setup)
- 想让玩家不改客户端也能进新版服务端？看：[版本兼容](#/guide/version-compat)
- 想把主城、生存、小游戏拆成独立进程分别迁移？那是群组服：[用 Velocity 搭群组服](#/guide/velocity-network)
