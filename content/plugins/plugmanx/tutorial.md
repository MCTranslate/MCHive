---
id: plugmanx
name: PlugManX
description: 运行时插件管理器 — 不重启就能加载/卸载/重载单个插件。开发测试服很顺手，生产服热插拔官方明确不建议，别拿它当常规运维手段。
category: 运维工具
version: 3.2.1（MC 1.21 - 26.3）
tags: [插件管理, 热重载, 卸载, 运维, 风险]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
downloads: []
---

## PlugManX 安装教程

### 0. 先读这一段

**PlugManX 不是「更好的插件加载器」，它是一个带警告的应急工具。**

它的真实用途只有一个：**在不方便重启的时段，处理单个插件的加载/卸载/重载需求**。

官方的态度是明确的：不推荐在生产环境热插拔插件。Spigot/Paper 官方文档里点名 PlugMan / PlugManX，说明它「不仅继承了 `/reload` 的所有问题，还额外破坏了插件对服务器状态的预期」。

**这句话的实际含义**：Bukkit 平台没有设计成让插件自行加载/卸载。很多插件在 `onEnable` 时假设「服务器刚启动」——它读一次数据、缓存一份世界状态、建一个线程。热插拔时这些假设全部不成立，插件会带着半初始化的状态继续跑，然后出现「偶发的、无法复现的鬼毛病」。

**本站在这里的态度**：这插件该装，但要知道什么时候用、什么时候必须重启。

### 1. 它能做什么

| 功能 | 说明 |
|------|------|
| `load` / `unload` | 运行时加载 / 卸载单个插件 |
| `reload` | unload + load，等于热重载 |
| `enable` / `disable` | 只切换开关，不重新加载类 |
| `restart` | disable + enable |
| `list` | 列出插件（`-v` 带版本） |
| `info` | 看插件详情、命令、作者 |
| `usage` | 列出某个插件注册了哪些命令 |
| `lookup` | 反查某个命令属于哪个插件 |
| `dump` | 把插件名和版本导出到文件 |
| `check` | 检查插件有没有更新 |

平台：**Bukkit / BungeeCord / Folia / Paper / Purpur / Spigot**。

> 注意它**包含 BungeeCord、不包含 Velocity**。所以在 Velocity 代理上不要指望它——**Velocity 侧装不了 PlugManX**。如果你主用的是 Velocity 群组，热插拔这条路直接不通，只能重启。Velocity 本身有 `/velocity` 的管理能力，但和这个插件无关。

> 也正因为它支持 BungeeCord，在 BungeeCord 代理上卸载插件是可行的——但 BungeeCord 的插件卸载同样有上述所有问题，代理侧崩掉影响的是全群组，风险比后端更大。

### 2. 命令表

所有命令默认 OP 权限。

| 命令 | 说明 |
|------|------|
| `/plugman help` | 帮助 |
| `/plugman list [-v]` | 按字母顺序列出插件，`-v` 带版本 |
| `/plugman info <插件>` | 插件详细信息 |
| `/plugman usage <插件>` | 列出该插件注册的命令 |
| `/plugman lookup <命令>` | 反查命令属于哪个插件 |
| `/plugman dump` | 把插件名+版本导出到文件 |
| `/plugman enable [插件\|all]` | 启用 |
| `/plugman disable [插件\|all]` | 禁用 |
| `/plugman restart [插件\|all]` | 重启（disable/enable） |
| `/plugman load <插件>` | 加载 |
| `/plugman reload [插件\|all]` | 重载（unload/load） |
| `/plugman unload <插件>` | 卸载 |
| `/plugman check [插件\|all] [-f]` | 检查更新 |

配置文件在 `plugman-core/src/main/resources/config.yml`（仓库路径），本地生成的在 `plugins/PlugManX/`。

权限节点全部是 `plugman.*`：

| 权限 | 默认 |
|------|------|
| `plugman.admin` | OP（全部命令） |
| `plugman.update` | OP |
| `plugman.help` | OP |
| `plugman.list` | OP |
| `plugman.info` | OP |
| `plugman.dump` | OP |
| `plugman.usage` | OP |
| `plugman.lookup` | OP |
| `plugman.enable` / `plugman.enable.all` | OP |
| `plugman.disable` / `plugman.disable.all` | OP |
| `plugman.restart` / `plugman.restart.all` | OP |
| `plugman.load` | OP |
| `plugman.reload` / `plugman.reload.all` | OP |
| `plugman.unload` | OP |
| `plugman.check` / `plugman.check.all` | OP |

**别把 `plugman.admin` 给普通玩家。** 有了它就能 unload 别人的插件，这是权限系统的后门。

### 3. 什么时候真的需要它

说几个站得住的用场：

| 场景 | 为什么合理 |
|------|-----------|
| 开发测试服反复调配置 | 每次重启等 30 秒很折磨，reload 省时间（但见下面的警告） |
| 插件冲突排查，临时禁用一个 | 停一个插件观察，比带病运行好 |
| 玩家反馈某个插件报错，临时关掉 | 应急止血，等维护窗口再正经处理 |
| 装了插件但还没配好，先关掉 | 避免它干扰其他插件 |

### 4. 什么时候必须重启

**下面这些情况，重启是唯一正确答案：**

| 操作 | 为什么不能热插拔 |
|------|-----------------|
| **新增 / 删除 jar** | jar 需要新的类加载器，热插拔留下的旧类加载器会泄漏 |
| **升级插件版本** | 类定义变了，旧 jar 还在内存里 |
| **改 `server.properties` / `bukkit.yml` / `spigot.yml`** | 服务端核心级配置 |
| **换服务端 jar**（Paper / Purpur 升级） | 核心 |
| **改 JVM 参数** | 进程级 |
| **装卸全局核心依赖** | Vault、PlaceholderAPI、ProtocolLib 这种被几十个插件依赖的，卸载会连锁失败 |

更根本的一条原则：

> **改配置就用插件自己的 reload 命令；换 jar 就重启服务器。**

插件自己的 `/xxx reload` 是作者写的、知道该怎么清理自己的状态。`/plugman reload` 是通用暴力卸载+重载，插件作者没配合过。

### 5. 别碰这些插件

| 类别 | 为什么 |
|------|--------|
| **NMS 插件** | 直接用 `net.minecraft.server` 的内部代码，PlugManX 无法安全摘钩 |
| **ProtocolLib / PacketEvents** | 改数据包的插件会留下孤儿监听器，之后每个玩家都可能报错 |
| **数据库密集型插件** | 连接池不会在卸载时正常关闭，久了耗尽 |
| **世界生成器插件** | 注册在服务端启动期，无法干净地重新注册 |
| **生成持久实体的插件** | 实体和世界数据会不一致 |
| **Vault / PlaceholderAPI** | 全局依赖，卸载后一片插件报红 |

### 6. 正确的热插拔流程（真要用的时候）

```
1. 备份 plugins/<插件>.jar 和 plugins/<插件>/ 整个目录
2. /plugman info <插件>    ← 看有没有别的插件依赖它
3. /plugman unload <插件>  ← 盯控制台有没有异常
4. 替换 jar
5. /plugman load <插件>
6. 立刻进游戏测试关键功能
7. 接下来 10-15 分钟盯内存和日志
```

第 2 步是最容易被跳过的。`/plugman info` 能看到依赖关系——**如果 B 插件依赖 A，你卸载 A，B 不会自动停，它会带着一个失效的引用继续跑，直到某天突然崩。** 这种故障极难定位，所以别跳这步。

第 7 步也重要：内存占用出现台阶式上涨且不回落，就是类加载器泄漏的信号。这时报修，别等。

### 7. 常见坑

**reload 后内存持续上涨**

类加载器没被回收。PlugManX 处理得比 `/reload` 好，但不是完美。多次热插拔后内存阶梯上涨就是这个。

**reload 后某个插件功能失效但不报错**

典型的「插件在错误状态下运行」。`/plugman restart`（disable + enable）有时比重载干净；还不行就重启服务器。

**控制台刷屏 / 大量异常堆栈**

卸载顺序不对：被依赖的先被卸了。永远先卸「依赖别人的」，后卸「被别人依赖的」。

**想用它装新插件**

不要。`/plugman load` 加载一个新 jar，插件作者没为「服务器运行了 3 天之后才加载我」这个场景写过代码。它加载成功不代表它能正常工作——**新插件大概率需要重启**。

**和 `/reload` 比，哪个好？**

PlugManX 明显更安全（它至少尝试清理类加载器、注销命令、取消任务、移除监听器）。但两者都不该在生产服用。`/reload` 是全量重载，PlugManX 是单插件操作——**如果你非要用，选 PlugManX 逐个来，绝不用 Bukkit 的 `/reload`。**

### 8. 汉化

> **本站未核实到该插件的官方中文语言文件机制，若要汉化需自行确认。**

它的玩家可见文本很少，基本就是命令反馈那一堆：

| 改什么 | 在哪 |
|--------|------|
| 命令返回消息 | 配置里的消息段落 |
| 无权限提示 | 同上 |

打开 `plugins/PlugManX/` 下的配置文件，搜 `messages` / `locale` 之类的段落看看，**以实际文件为准**。这插件的量级，改汉化的收益也小——毕竟正常玩家不会用这些命令。

## 下一步

- 搞清楚服务器该怎么重启才安全 → [启动脚本与自动重启](#/guide/startup-script)
- 定期备份才是真正的安全网 → [服务端维护](#/guide/server-maintenance)
- 定期维护流程该怎么排 → [服务端维护实操](#/guide/server-maintenance)
- 插件装多了冲突怎么查 → [插件组合搭配](#/guide/plugin-combos)
