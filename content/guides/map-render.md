---
id: map-render
title: 地图渲染与网页地图
description: 让玩家的浏览器里长出整张服务器地图 — BlueMap 与 Dynmap 该怎么选、端口与反向代理怎么配、渲染开销和磁盘怎么控，以及「地形公开」这件事的代价。
icon: 🗺️
tags: [地图, 网页地图, BlueMap, Dynmap, 渲染, 运维, 安全]
order: 23
---

# 地图渲染与网页地图

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.3）+ Java 25。文中 BlueMap 的版本号、配置键名、命令与默认端口均取自 **BlueMap 5.28 的官方 jar（解包读取默认配置）与官方 wiki**；Dynmap 的兼容范围取自 Modrinth 项目元数据。

玩家在浏览器里拖着地图找自家房子、服主坐在手机上就能巡查建筑进度——这就是网页地图的魅力。它也是本站里**唯一一个会主动把服务器内容公开到公网**的功能，所以本文有一半篇幅在讲代价和边界。

## 一、先想清楚：你要用它干什么

| 你的需求 | 网页地图值不值 |
|----------|----------------|
| 玩家互相找建筑、找队友、看地形 | 非常值，几乎是刚需 |
| 服主远程巡查建筑进度 / 确认违规建筑位置 | 值，比进服跑一趟快得多 |
| 服务器官网想挂一张「看看我们服长什么样」 | 值，还自带宣传效果 |
| 只是想让玩家不迷路 | 不值，装个传送点或路牌就够了 |
| 服里全是秘密基地 / PVP 偷家玩法 | 谨慎，见第八节 |
| 硬盘快满了、CPU 只有 2 核 | 先别装，见第五节 |

**它给你的**：一个 URL，玩家不用开游戏就能看 3D 地图、量距离、看标记点。

**它的代价**（三笔账，装之前就得认）：

1. **磁盘**：渲染结果是实打实的文件，随已生成区块面积增长，且删之前一直占着。
2. **CPU**：首次渲染要把整个世界转成 3D 模型，是一次性的大工程；之后是持续的小额增量。
3. **信息公开**：地图一旦能访问，服务器地形就对访问者公开了——**包括玩家没圈保护的基地**。

> 网页地图不是「装上去就完事」的插件。它是你对外开了一个新服务，要按「开服务」的标准管：端口、备份、访问控制，一个都不能少。

## 二、选型：BlueMap 还是 Dynmap

老教程十有八九推荐 Dynmap——那是 2024 年的正确建议，**2026 年 9 月已经不是了**。先看硬事实：

| 对比项 | BlueMap | Dynmap |
|--------|---------|--------|
| Modrinth slug | `bluemap` | `dynmap` |
| 最新发布 | 5.28（2026-09-25） | v3.8（2026-01-14） |
| 项目声明的 MC 支持范围 | **1.13 – 26.3** | **1.10.2 – 1.21.11** |
| 支持 26.x？ | ✅ 支持（26.1.1 / 26.1.2 / 26.2 / 26.3 均在列） | ❌ 不支持，最高到 1.21.11 |
| 支持的加载器 | paper / purpur / spigot / folia / fabric / forge / neoforge / sponge | bukkit / paper / spigot / fabric / forge |
| 开源协议 | MIT | Apache-2.0 |
| 是否免费 | ✅ 免费开源 | ✅ 免费开源 |
| Web 端形态 | 官方自带内置 Web 服务，WebGL 真 3D（three.js 那一套），可缩放旋转 | 传统 2D 平铺图 + 有限的斜视角 |
| 运行要求 | 服务端插件模式要求 **Java 25+** | 跟随其声明的 MC 版本 |

**本站推荐：BlueMap。** 理由不是「3D 更好看」，而是更硬的一条——**Dynmap 的项目元数据里，MC 版本只到 1.21.11，压根不覆盖 26.x**。也就是说 Dynmap 停在 2026 年 1 月之后再没跟上新版本，你在 Paper 26.3 上装它，属于拿一个自己都不声明支持的版本去赌。

> **为什么网上还在推 Dynmap？** 因为 Dynmap 的历史长、教程存量大，而版本滞后是 2025 年底之后才明显拉开的事。你搜到的「安装网页地图」教程大多是那个时间点之前写的。**判断方法很简单**：去 Modrinth 项目页看 `Game versions` 一栏里有没有你要跑的版本号，比任何教程都可靠。

两个都是免费开源项目，本站的「只推荐免费 / 开源插件」承诺不受影响，纯粹是版本适配问题。

## 三、手把手：从下载到打开地图

以 BlueMap 5.28（paper 版）为例，官方 jar 文件名是 `bluemap-5.28-paper.jar`。

```bash
# 1. 下载：Modrinth 项目页或 GitHub Releases，选 paper（同时兼容 purpur / folia）
#    https://modrinth.com/plugin/bluemap
#    https://github.com/BlueMap-Minecraft/BlueMap/releases

# 2. 丢进 plugins/ 目录，重启服务器
#    启动后 BlueMap 会做两件事：
#      · 生成整套默认配置文件
#      · 为服务端里已加载的每个世界预配一张地图（maps/<id>.conf）

# 3. 编辑 plugins/BlueMap/core.conf —— 把这一项改成 true
#    accept-download: true
#    （不改成 true，BlueMap 拿不到生成 3D 模型要用的客户端资源）

# 4. 编辑 plugins/BlueMap/webserver.conf —— 改端口
#    port: 8100

# 5. 重载配置
/bluemap reload
```

然后浏览器打开 `http://<服务器IP>:<端口>/`（默认 8100）。

**第一步先确认的**：服务器控制台里有没有出现 `Webserver started...`。没有的话，先别管浏览器，回头看日志里的报错。

> **别用 `https` 去访问内置 Web 服务。** 官方 FAQ 明确说了 BlueMap 的内置 Web 服务不支持（也不会支持）SSL，所以用 `http://` 访问才是正常的。想要 HTTPS 必须走反向代理，见第六节。

## 四、配置文件都在哪、哪些键真正要动

BlueMap 的配置是 **HOCON** 格式（不是 YAML），这是新手最容易懵的一点——缩进和 `key: value` 长得像 YAML，但语法规则不同，改之前建议先扫一眼 HOCON 的基本写法。

**目录结构**（相对服务端根目录）：

```text
plugins/BlueMap/          ← 配置文件目录（Paper/Spigot）
├── core.conf             ← 核心：资源下载、渲染线程、更新间隔
├── webserver.conf        ← 内置 Web 服务：开关、端口、webroot、绑定 IP
├── webapp.conf           ← 网页端：webroot、起始视角、滑块默认值
├── plugin.conf           ← 与游戏联动：玩家标记、隐藏规则、渲染暂停阈值
├── maps/                 ← 一个 .conf = 一张地图（世界/维度）
│   ├── world.conf
│   ├── world_nether.conf
│   └── world_the_end.conf
└── storages/             ← 渲染结果存哪、怎么压缩
    ├── file.conf
    └── sql.conf

bluemap/web/              ← webroot（默认位置，在服务端根目录）
├── index.html            ← 网页端入口
└── maps/                 ← 渲染产物（默认存在这里）
```

注意 `plugins/BlueMap/`（配置）和 `bluemap/web/`（渲染产物）是**两个不同的地方**，后者默认不在 plugins 下面。备份和清理时要分开处理。

### 必看的几个键

| 文件 | 键 | 默认值 | 什么时候要动 |
|------|-----|--------|--------------|
| `core.conf` | `accept-download` | `false` | **第一次必改**，改成 `true` 否则渲染不出来 |
| `core.conf` | `render-thread-count` | `1` | 渲染太慢 / 太吃 CPU 时（见第五节） |
| `core.conf` | `render-thread-priority` | 注释掉（Java 默认优先级） | 渲染抢 CPU 时调低，取值 1–10 |
| `core.conf` | `full-update-interval` | `1440`（分钟） | 想改全量检查周期；设 `0` 关闭 |
| `core.conf` | `update-cooldown` | `60`（秒） | 同一区块文件的更新冷却，一般不改 |
| `core.conf` | `metrics` | `true` | 介意匿名用量上报就关掉 |
| `webserver.conf` | `enabled` | `true` | 想改用外部 Web 服务器（nginx 等）时设 `false` |
| `webserver.conf` | `port` | `8100` | **必改**，换成你有权限开放的端口 |
| `webserver.conf` | `ip` | `0.0.0.0`（隐藏项，默认配置里没有） | 只想让反代访问时设 `"127.0.0.1"` |
| `webapp.conf` | `webroot` | `bluemap/web` | 想换位置，且**必须与 webserver.conf 的 webroot 一致** |
| `webapp.conf` | `client-decompression` | 注释掉（`false`） | 用外部 Web 服务器静态托管时要打开 |
| `plugin.conf` | `player-render-limit` | `-1`（不限制） | 人多了就暂停渲染，填在线人数阈值 |
| `plugin.conf` | `live-player-markers` | `true` | 不想在地图上显示玩家位置就关 |
| `storages/file.conf` | `root` | `bluemap/web/maps` | 想把渲染产物放到别的大盘 |
| `storages/file.conf` | `compression` | `gzip` | 可选 `gzip` / `zstd` / `deflate` / `none` |

> `ip` 是官方「隐藏配置」（不在默认模板里，官方 wiki 的 Webserver 配置页有记录）。它的默认值其实是 `0.0.0.0`，也就是**监听所有网卡**——所以你不动它，地图端口就是对外全开的。

### 命令速查

官方 wiki 的完整命令表如下（节选最常用的）：

| 命令 | 权限 | 作用 |
|------|------|------|
| `/bluemap` | `bluemap.status` | 显示渲染状态与进度（**看首次渲染进度就用它**） |
| `/bluemap version` | `bluemap.version` | 显示版本与系统信息 |
| `/bluemap reload [light]` | `bluemap.reload` | 重载配置、资源与 Web 服务；`light` 只重载非资源部分，更快 |
| `/bluemap maps` | `bluemap.maps` | 列出 BlueMap 已加载的所有地图 id |
| `/bluemap storages` | `bluemap.storages` | 列出已配置的存储 |
| `/bluemap storages <storage> delete <map>` | `bluemap.storages.delete` | 从存储里删除某个（已卸载的）地图 |
| `/bluemap stop` / `/bluemap start` | `bluemap.stop` / `bluemap.start` | 暂停 / 恢复全部渲染（**重启后仍保持**） |
| `/bluemap freeze <map-id>` / `unfreeze <map-id>` | `bluemap.freeze` / `bluemap.unfreeze` | 暂停 / 恢复单张地图的更新 |
| `/bluemap purge <map-id>` | `bluemap.purge` | 删除该地图的全部渲染数据（之后会重新渲染） |
| `/bluemap update [map-id] [x z] [block-radius]` | `bluemap.update` | 更新整张图或玩家周围指定半径（**只渲染有变化的区块**） |
| `/bluemap force-update [...]` | `bluemap.update` | 同上，但**无论有没有变化都重新渲染**（官方建议仅测试用） |
| `/bluemap fix-edges [...]` | `bluemap.update` | 重渲染地图边缘，改过渲染范围后用来修边 |
| `/bluemap tasks` / `tasks cancel` | `bluemap.tasks(.cancel)` | 查看 / 取消渲染队列 |

> **「首次渲染要执行什么命令？」——答案是：通常一条都不用执行。** 官方 wiki 开篇就写着「通常你不需要用任何命令，BlueMap 就会正确地渲染和更新地图」。装好、改完 `accept-download`、`/bluemap reload` 之后它自己就开始跑了，进度用 `/bluemap` 看。网上那些「装完先执行 `/dynmap fullrender`」的写法是 Dynmap 时代留下的习惯，BlueMap 不适用。

## 五、渲染开销：会不会拖慢服务器

### 原理：它跑在服务端线程之外

官方 wiki 的原话是：BlueMap 的渲染**异步于服务端线程**，任何时刻都不会直接阻塞服务端主线程；**只要 CPU 没有被打满，渲染时服务器就不会变慢**。

而 MC 服务端本身吃不满多核——主线程永远只用一个核，加上世界生成和网络线程，通常也就用到 3 个核左右。剩下的核可以放心分给 BlueMap。

### 首次渲染 vs 增量渲染

| 阶段 | 发生什么 | 持续时间 |
|------|----------|----------|
| 首次全图转换 | 把世界里**已生成**的全部区块转成 3D 模型文件 | 取决于世界已生成面积与 CPU/磁盘，可能很久；用 `/bluemap` 看进度和剩余时间预估 |
| 之后的日常更新 | 只转换**发生变化的**区块 | 持续的小额开销，玩家改多少就渲染多少 |

官方 FAQ 的说法是：首次转换完成后，**就再也不需要重新渲染整张地图了**。

> 首次渲染的耗时没有一个「通用数字」——它跟你已生成的区块面积、CPU 核数、磁盘速度、是否开着 hires 层都有关。**请用它自己的 `/bluemap` 输出的进度和预估时间来判断**，那个数字对你的机器才是准的。

### 真的卡了怎么办（按优先级）

```hocon
# ① plugins/BlueMap/core.conf —— 限制渲染线程数
#    官方建议：机器只有 4 核或更少时，设为 1
#    填 0 或负数 = 可用核数减去该值（例如 6 核填 -2 → 用 4 个线程）
render-thread-count: 1

# ② plugins/BlueMap/core.conf —— 降低渲染线程优先级（1–10，默认注释掉）
#    给 JVM 一个明确信号：渲染让位于游戏逻辑
#render-thread-priority: 1

# ③ plugins/BlueMap/plugin.conf —— 人多了就自动停渲染
#    在线人数达到这个值（或更多）时暂停渲染更新，人少了自动恢复
#    0 或 -1 = 不启用
player-render-limit: -1
```

如果这三招都试过还是卡，先别急着怪 BlueMap——按 [卡顿时怎么查：从「卡了」到「是谁在卡」](#/guide/lag-diagnosis) 的流程确认是谁在吃 CPU，再对照 [性能调优从入门到精通](#/guide/performance-tuning) 的常规手段处理。

## 六、对外访问：端口、反向代理与 HTTPS

### 底线：别把渲染端口直接裸奔出去

内置 Web 服务默认监听 `0.0.0.0`。想让它只被本机访问，在 `webserver.conf` 里加一行（这是个隐藏配置项，默认模板里没有，手动写进去即可）：

```hocon
# plugins/BlueMap/webserver.conf
port: 8100
ip: "127.0.0.1"
```

改完 `/bluemap reload`，此时外部直接访问 8100 就连不上了，只能靠本机的反向代理出去。

### 反向代理（二选一）

**nginx —— 挂在子域名上**（官方 wiki 示例，端口按你实际配置替换）：

```nginx
server {
  listen 80;
  listen 443 ssl;

  server_name map.mydomain.com;

  location / {
    proxy_pass http://127.0.0.1:8100;
  }
}
```

**nginx —— 挂在网站子目录 `/map`**（注意 `location` 和 `proxy_pass` 的斜杠要配对）：

```nginx
location /map/ {
  proxy_pass http://127.0.0.1:8100/;
}
```

**Caddy**（自动申请与续期证书，配置最短）：

```text
map.mydomain.com {
  reverse_proxy 127.0.0.1:8100
}
```

子目录形式：

```text
mydomain.com {
   handle_path /map/* {
     reverse_proxy  127.0.0.1:8100
   }
}
```

### 想加访问控制？

**BlueMap 自身不带任何认证功能**——官方 FAQ 的原话是它不支持认证，需要你自己用外部 Web 服务器做（例如 nginx 的 HTTP Basic Auth）。所以：

```
想限制谁能看地图？
  ├── 内网 / 熟人小服  → 只监听 127.0.0.1，配合反向代理 + 简单口令
  ├── 公开服，只想藏玩家位置 → 不用加认证，改 plugin.conf 的隐藏规则（见第八节）
  └── 只想给管理员看  → 反向代理加 Basic Auth，或者干脆别对外开，用 SSH 隧道 / 内网穿透临时看
```

端口该怎么开放、开端口的安全底线是什么，见 [让外网连上你的服务器](#/guide/port-forwarding)。

## 七、只渲染主世界：多世界与渲染范围

### 加一张地图 / 去掉一张地图

规则很简单：`plugins/BlueMap/maps/` 下**一个 `.conf` 文件就是一张地图**，文件名（去掉扩展名）就是地图 id。

```
想去掉下界/末地？
  └── 删除 maps/ 里对应的 .conf（先用 /bluemap maps 确认 id）
        → /bluemap reload
        → 想连已渲染的文件一起清掉：/bluemap storages file delete <地图id>
           （或直接删 bluemap/web/maps/<地图id>/ 目录）

想加回来？
  └── 复制一份同类型的 .conf 改一改，文件名即新地图 id → reload
```

### 与 Paper 26.1+ 的目录结构对齐

每张地图的 `.conf` 里有两个关键字段：

```hocon
# plugins/BlueMap/maps/<地图id>.conf
world: "world"                  # 该世界/维度的存档目录
dimension: "minecraft:overworld"  # 维度 key：minecraft:overworld / the_nether / the_end
```

**Paper 26.1 起，维度数据放在 `world/dimensions/<命名空间>/<世界键>/`**，不再是老教程里的 `world_nether` / `world_the_end`（详见 [多世界与主城实战](#/guide/multi-world-setup)）。

> **别照抄网上的 `world:` 路径。** BlueMap 5.28 会自己识别新目录结构并生成正确的配置。你该做的是**打开自己机器上生成的 `.conf` 看实际值**，并用 `/bluemap maps` 核对 id。如果地图渲染异常，先怀疑 `world` / `dimension` 这两个值跟你实际的目录对不上。

### 只想渲染一部分区域

`maps/<id>.conf` 里的 `render-mask` 可以框定范围，超出范围的区块不渲染（改了之后 BlueMap 会自动尝试更新地图，包括删除范围外的瓦片）：

```hocon
render-mask: [
  {
    min-x: -4000
    max-x: 4000
    min-z: -4000
    max-z: 4000
    #min-y: 50
    #max-y: 100
  }
]
```

配合 `min-inhabited-time`（默认 `0`，调大则只渲染玩家实际去过的区块），可以把渲染量压得很小。

```hocon
# 只渲染玩家停留过的区块（inhabitedTime 累计 tick 数阈值）
min-inhabited-time: 0
```

## 八、安全与隐私：地图等于公开地形

这是本文最该被认真读的一节。

### 玩家位置要不要显示

`plugin.conf` 里有一整套隐藏规则，默认已经比较克制（旁观者不显示、隐身不显示、被 vanish 插件隐藏的不显示）：

```hocon
# plugins/BlueMap/plugin.conf
live-player-markers: true       # 是否在地图上显示玩家位置
hidden-game-modes: [            # 这些游戏模式的玩家不显示
  "spectator"
]
hide-vanished: true             # 被 vanish 插件隐藏的玩家不显示
hide-invisible: true            # 有隐身效果的玩家不显示
hide-sneaking: false            # 潜行的玩家不显示（默认关）
hide-different-world: false     # 不在当前查看世界的玩家不显示

# 低于指定光照就隐藏玩家：两个值都要低于阈值才会隐藏
hide-below-sky-light: 0
hide-below-block-light: 0
```

官方注释给了一个实用配方：**想让玩家只在地表可见，把 `hide-below-sky-light` 设成 1–15 之间的值，同时把 `hide-below-block-light` 设成 16**（方块光最高 15，所以这个条件恒真，等于「只看天光」）。这样在地下洞穴里的玩家就不会出现在地图上了。

### 地形本身是藏不住的

能访问地图的人就能看到主城布局、资源区、以及所有**没被圈保护**的建筑。这意味着：

- 玩家的秘密基地位置不再秘密。这和领地插件是两回事——领地挡的是破坏，挡不住被看见。
- 如果你服的玩法依赖「位置保密」（偷家、寻宝、藏物资），要么别开，要么严格限制访问。
- 先确认玩家建筑有基本保护，再对外公开地图。领地怎么圈见 [领地与保护实战](#/guide/region-protection) 与 [WorldGuard](#/plugin/worldguard)。

> 顺序建议：**先把保护做好，再把地图放开。** 反过来做的话，你等于给所有熊孩子发了一份带坐标的建筑清单。

更完整的服务器暴露面管理见 [安全加固：从裸奔到站稳](#/guide/security-hardening)。

## 九、磁盘与运维

### 渲染结果存在哪

默认在 **服务端根目录下的 `bluemap/web/maps/<地图id>/`**（即 webroot 里的 `maps/` 子目录）。它由 `storages/file.conf` 的 `root` 控制，压缩方式由 `compression` 控制（默认 `gzip`）。

### 占多大？——取决于这几个旋钮

这里不给具体数字，因为它完全由你的世界决定。影响因素按权重排：

| 旋钮 | 位置 | 调小的影响 |
|------|------|------------|
| 已生成的区块面积 | 世界本身 | 用 `render-mask` / `min-inhabited-time` 限制渲染范围 |
| `enable-hires: true` | `maps/<id>.conf` | 关掉能显著加快渲染并**大幅减小**地图文件体积，代价是放大后看不到完整 3D 模型 |
| `remove-caves-below-y` | `maps/<id>.conf` | 不渲染洞穴可省下大量体积 |
| `compression` | `storages/file.conf` | 换压缩算法，压缩率与 CPU 开销的取舍 |
| `enable-flat-view` / `enable-free-flight-view` / `enable-perspective-view` | `maps/<id>.conf` | 少开一种视角，少一份数据 |

想看实际占用，直接量：

```bash
du -sh bluemap/web          # 整个 webroot
du -sh bluemap/web/maps/*   # 每张地图分别占多少
```

### 备份：渲染产物可以不备份

渲染产物是**可以从世界重新生成**的，备份它不划算。写备份脚本时把它排除掉——[服务器日常运维手册](#/guide/server-maintenance) 那个 rsync 脚本里的 `--exclude='plugins/dynmap/web'` 就是同一思路，BlueMap 对应排除 `bluemap/web` 即可。

**真正需要备份的是配置**：`plugins/BlueMap/` 整个目录（尤其 `maps/*.conf`），改坏了所有地图一起乱。

### 清理

```bash
# 场景一：世界重置了 / 改了渲染设置，需要重来一遍
/bluemap purge <地图id>      # 删掉该地图的渲染数据，之后自动重新渲染

# 场景二：彻底不要这张地图了
#   1. 删掉 plugins/BlueMap/maps/<地图id>.conf
#   2. /bluemap reload
#   3. /bluemap storages file delete <地图id>   # 清掉已渲染文件

# 场景三：临时让渲染停下来（比如要跑大型预生成）
/bluemap stop                # 注意：这个状态重启服务器后仍然保持
/bluemap start               # 恢复
```

> `/bluemap stop` 的状态会**跨重启保留**。如果你哪天发现地图死活不更新，先查一下是不是之前停过忘了开回来——用 `/bluemap` 看状态即可。

## 十、常见坑

| 症状 | 原因与解法 |
|------|-----------|
| 页面打不开 | ① 控制台有没有 `Webserver started...`；② 是不是用了 `https`（内置服务只支持 http）；③ 端口（默认 8100/TCP）没放行或被防火墙挡了；④ 反向代理的 `location` 与 `proxy_pass` 斜杠没配对 |
| 打开是 404 | `core.conf` 的 `accept-download` 没改成 `true`；或 `webapp.conf` 与 `webserver.conf` 的 `webroot` 不一致 |
| 地图全黑 / 大片缺失 | 先点网页端菜单里的 `Update Map`；用 `/bluemap` 看是不是在渲染别的图；`/bluemap unfreeze <图>` 确认没被冻结；核对 `maps/*.conf` 里的 `world` 与 `dimension` |
| 只有已探索区域有图 | 正常——BlueMap **只能渲染 Minecraft 已经生成过的区块**。想让地图完整，先预生成世界 |
| 地图有洞 / 区块缺失光照 | 旧版本升级上来或预生成过的区块可能没有光照数据，BlueMap 会跳过。可临时设 `ignore-missing-light-data: true` 再 `/bluemap purge`，代价是这些区块洞穴全开、整体看起来像夜视 |
| 只有低清，放大糊 | `maps/<id>.conf` 的 `enable-hires` 被关了（打开后需 purge 重渲染）；或升级后网页端没更新——删掉 `<webroot>/index.html` 后重载 |
| 改了配置地图没变 | 改的是需要重渲染的项（官方注释里写了 "requires a re-render" 的那些）→ 用 `/bluemap purge <图>` |
| 渲染时服务器卡 | `render-thread-count` 调小（≤4 核设 1）、开 `render-thread-priority`、设 `player-render-limit`；确认 CPU 是否已被打满 |
| 磁盘爆满 | 见第九节：限制 `render-mask`、关 `enable-hires`、换压缩、`du -sh` 定位大目录后 purge |
| 版本不支持的表现 | BlueMap 侧：插件未启用或渲染异常，先 `/bluemap version` 核对；Dynmap 侧：它最高只声明到 MC 1.21.11，在 26.x 上属于未声明支持，别指望能跑 |
| 模组/自定义方块显示成黑块或粉黑格 | 确认 `core.conf` 的 `scan-for-mod-resources`；官方列出了已知不兼容项：JustEnoughIDs、NotEnoughIDs、OpenCubicChunks、SlimeWorldManager |
| 升级 BlueMap 后出问题 | 官方 FAQ 明确提示：升级可能有换 jar 之外的步骤，**务必读 changelog** |

## 下一步

- 世界还没理顺？先把世界和维度结构搞清：[多世界与主城实战](#/guide/multi-world-setup)
- 渲染吃 CPU 吃不消？从根上找瓶颈：[性能调优从入门到精通](#/guide/performance-tuning)
- 地图要长期跑着？把它纳入日常维护：[服务器日常运维手册](#/guide/server-maintenance)
- 准备对外公开前，务必过一遍：[安全加固：从裸奔到站稳](#/guide/security-hardening)
