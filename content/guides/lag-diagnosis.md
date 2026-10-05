---
id: lag-diagnosis
title: 卡顿时怎么查：从「卡了」到「是谁在卡」
description: 别再发 timings 了 — 官方已把它标记为 deprecated。用 Paper 自带的 spark 采样、/paper chunkinfo 与 /paper entity list 定位卡顿元凶，附排查决策树与常见元凶对照表。
icon: 🔍
tags: [卡顿, 排查, spark, 性能, TPS]
order: 17
---

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.3）。spark 命令语法取自官方 spark 文档，Paper 自带命令取自官方 Paper 命令文档。

## 一、先分清「卡」到底卡在哪

玩家说「卡」，可能是三种完全不同的问题。动手之前先归类，否则会往完全错误的方向使劲：

| 类型 | 玩家感受 | 用什么确认 |
|------|----------|-----------|
| **服务端卡**（TPS 掉） | 所有人同时卡：方块放不下、怪物瞬移、红石变慢 | `/spark tps`、`/mspt` |
| **网络卡** | 只有部分人卡，且他们的 ping 高 | `/spark ping`、`/spark ping --player <玩家>` |
| **客户端卡** | 只有某个人卡，但他的 ping 正常 | 让他自己看 FPS，与服务端无关（本教程不解决这种） |

> 判断口诀：**先看 TPS，再看 ping。** TPS 正常（接近 20）却有人说卡，先查他和服务器的网络；TPS 掉了才是服务端的问题，继续往下看。

**两个基础读数**：

```
/spark tps    # 过去 1 / 5 / 15 分钟的 TPS（目标 20.0）
/mspt         # 平均、最小、最大 MSPT（毫秒每 tick；要维持 20 TPS，MSPT 需低于 50）
```

> 注意：`/mspt` 和 `/tps` 官方说**能用但已被 `/spark` 取代**，日常随手看可以，正式排查请用 spark（见第三节）。

## 二、时效性重点：别再用 `/timings` 了

这是本页最该记住的一条：

> **Paper 官方文档的原话**：`/timings` **已被标记为 deprecated（计划移除）**，应改用 `/spark`；而 `/mspt`、`/tps` 也被 `/spark` 取代。文档还写了一句是：`The only command you should rely on for performance information is the /spark command.`

中文圈大量教程还在教你「开服卡了？发个 timings 链接」，**这套已经过时了**。现在正确的做法是：**用 spark 采样，看火焰图**。

## 三、好消息：spark 是 Paper 自带的，不用装

Paper 已经把 spark 打包进服务端，你**不需要下载任何东西**，也不需要往 `plugins/` 里放插件。`plugins/spark/` 就是它的工作目录（首次使用会生成 `config.json`）。

需要的权限：`spark` 或 `spark.<子命令>`（OP 默认有）。

### 一次完整的采样

```bash
# 1. 采样 60 秒后自动停止并生成报告（推荐：给它足够长的时间覆盖到卡顿发生的那一刻）
/spark profiler start --timeout 60

# 2. 等它跑完，控制台/聊天栏会给出一个在线报告链接，点开即可
#    如果采样中途想手动结束：
/spark profiler stop

# 3. 采样期间想先看一眼当前状态（不打断采样）：
/spark profiler open
/spark profiler info

# 4. 采样错了想丢弃：
/spark profiler cancel
```

**常用附加参数**：

```bash
/spark profiler start --thread *      # 追踪所有线程（不只是主线程）
/spark profiler start --alloc         # 采样内存分配（查「内存压力/GC 频繁」时用这个，而不是默认的 CPU）
```

### 怎么看报告（这是新手最卡的一步）

spark 报告是一张**火焰图**。看它的三个要点：

1. **横轴是占用比例，不是时间**。某个区块越宽，说明它吃掉的时间越多——**找最宽的那些「平顶」**，那就是元凶。
2. **从上往下是调用链**。顶层是总入口，往下是被它调用的方法。真正要找的是**最底层那个宽块**（具体做事情的代码/插件）。
3. **认名字**：宽块上如果写着插件名（如 `PluginA`、`PluginB`），那就是该插件在吃时间；写着 `net.minecraft...` 多半是原版机制（实体 tick、区块生成、红石、漏斗）。

> 一句话：**别被一大堆细条吓到，只找最宽的那几块，读它的名字。**

### 其它好用的 spark 子命令

| 命令 | 用途 |
|------|------|
| `/spark health` | 生成**实时仪表盘**（TPS / CPU / 内存 / 磁盘），每 10 秒自动刷新——卡顿发生时挂着它最好用 |
| `/spark health upload` | 生成一份**静态**健康报告（不会自动更新，适合发给别人看） |
| `/spark health show` | 直接在控制台打印；加 `--memory`、`--network` 看更多 |
| `/spark ping` / `/spark ping --player <玩家>` | 看全体或某个玩家的延迟 |
| `/spark tickmonitor` | 打开 tick 监控，超长 tick 会在控制台报警（可用 `--threshold-tick <毫秒>` 设阈值） |
| `/spark gc` | 看 GC 历史 |
| `/spark gcmonitor` | GC 监控开关 |
| `/spark heapsummary` | 生成内存（堆）摘要报告 |
| `/spark heapdump` | 导出 `.hprof` 堆快照到磁盘（**文件可能很大，注意磁盘空间**） |
| `/spark activity` | 看 spark 最近做了什么 |

## 四、Paper 自带的定位工具（不用装插件）

这几条命令能直接告诉你「多不多」，非常适合先做快速判断：

```bash
/paper chunkinfo [<世界>]        # 当前加载的区块数量与分类
/paper entity list [<过滤>] [<世界>]   # 列出正在 tick 的实体及数量
/paper mobcaps [<世界>]          # 全局怪物上限与可生成区块数
/paper playermobcaps [<玩家>]    # 某个玩家周边的怪物上限
/paper fixlight                  # 重算光照（WorldEdit 操作后地形发黑时用）
/paper heap                      # 导出堆转储（同 spark heapdump，注意磁盘）
```

**`/paper chunkinfo` 的输出分类怎么看**：

| 类型 | 含义 |
|------|------|
| `Total` | 当前加载的区块总数 |
| `Inactive` | 不 tick 但会生成区块（不可访问） |
| `Full` | 边界区块：不 tick，但实体和方块已加载且可访问 |
| `Block Ticking` | 方块会 tick，但实体不自然生成/不 tick（惰性区块） |
| `Entity Ticking` | 完整 tick 的区块（**这个数字大，才是真的在烧 CPU**） |

**`/paper entity list` 支持通配符过滤**，很适合抓「某类实体炸了」：

```bash
/paper entity list *                  # 全部
/paper entity list minecraft:pig      # 只看猪（命名空间不能省）
/paper entity list minecraft:e*       # 所有 e 开头的
/paper entity list minecraft:pig???   # pig 与 piglin，但不含 piglin_brute
```

## 五、常见元凶对照表

采样结果显示某类东西很宽，或者上面几条命令读出来「很多」，按下表对号入座：

| 迹象 | 最可能的元凶 | 处理方向 |
|------|-------------|----------|
| `Entity Ticking` 区块数很高 | 玩家分散、视距/模拟距离过大 | 调 `view-distance` 与 `simulation-distance` |
| 某类实体数量异常多 | 刷怪场、掉落物没清、动物繁殖失控 | 限制生成、清理掉落物、加清理机制 |
| 火焰图里某插件名占很宽 | 该插件有高开销任务或写得不好 | 换插件 / 调它自身的配置 / 减少调用频率 |
| 频繁 GC、`--alloc` 采样显示分配量大 | 堆太小或存在内存泄漏 | 先按 [性能调优](#/guide/performance-tuning) 调整堆大小；持续上涨则怀疑泄漏 |
| 区块生成相关很宽 | 玩家在跑图/生成新地形 | 预生成地图（用 Chunky 一类工具） |
| 红石、漏斗相关很宽 | 大型机器、大量漏斗 | 优化机器 / 减少漏斗 / 用更省的运输方式 |
| 只有特定时间点卡 | 定时任务（备份、清理、定时重启） | 把重任务挪到低峰期，见 [服务器日常运维手册](#/guide/server-maintenance) |
| TPS 正常但玩家卡 | 网络问题，不是服务端 | 查端口与线路，见 [让外网连上你的服务器](#/guide/port-forwarding) |

> **别急着加内存**。很多卡顿是「主线程在等某个插件干活」或「实体太多」，加内存并不能让 tick 变快——**先采样，再决定**。

## 六、一套可复用的排查流程

```
① 玩家反馈卡
      ↓
② /spark tps  ── TPS 正常？ ── 是 → 查 /spark ping（网络问题）
      ↓ 否
③ /spark health 挂上（实时看 TPS/CPU/内存/磁盘）
      ↓
④ /paper chunkinfo + /paper entity list 看「量」是否异常
      ↓ 量异常 → 先按第五节对表处理
      ↓ 量正常
⑤ /spark profiler start --timeout 60（严重时加 --thread *）
      ↓
⑥ 看火焰图，找最宽的平顶，读它的名字（插件名 or 原版机制）
      ↓
⑦ 针对性处理：插件 → 换/调配置；原版机制 → 按第五节处理
      ↓
⑧ 改完再采样一次，对比是否改善（**这一步不能省，否则你不知道有没有用**）
```

> 排查的黄金习惯：**改一处、采样一次、对比一次**。一次性改五个参数，出问题你也不知道是谁改坏的。

## 七、常见坑

| 症状 | 原因 |
|------|------|
| 找不到 `/spark` 命令 | 确认你是 Paper（不是原版服务端）；权限需要 `spark` |
| 报告链接打不开 | 检查服务器能否访问外网；或用 `/spark health show` 直接看控制台输出 |
| 采样期间服务器更卡了 | 采样本身有开销，**别在高峰期长时间采样**；用 `--timeout` 控制在 30–60 秒 |
| 火焰图全是 `net.minecraft...` 看不懂 | 只看最宽的几块，把名字贴出来搜；或结合 `/paper entity list` 判断是不是实体问题 |
| 采样没抓到卡顿 | 卡顿是偶发的——**在卡顿发生的那段时间采样**，或用 `/spark tickmonitor` 长期挂着等它报 |
| 堆转储后磁盘满了 | `/spark heapdump` 与 `/paper heap` 都可能产出大文件，**确认磁盘空间再执行** |
| 按老教程发 timings，没人理 | `/timings` 已 deprecated，改用 spark（见第二节） |
| 内存一直涨不回落 | 可能是内存泄漏，采样用 `--alloc` 看分配来源，并考虑重启 + [服务器迁移与升级](#/guide/server-migration) 时做一次干净环境 |

## 下一步

- 查到元凶后怎么调参数：[性能调优从入门到精通](#/guide/performance-tuning)
- 卡顿伴随报错、或完全起不来：[避坑与排错速查](#/guide/faq)
- 觉得是有人在搞事（刷屏、刷实体）而不是配置问题：[安全加固：从裸奔到站稳](#/guide/security-hardening)
- 想把这些动作变成日常流程：[服务器日常运维手册](#/guide/server-maintenance)
