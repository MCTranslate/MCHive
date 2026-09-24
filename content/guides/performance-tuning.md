---
id: performance-tuning
title: 性能调优从入门到精通
description: JVM 参数怎么配、paper.yml 哪些项目该动、实体和区块调什么 — 从「卡了怎么办」到「我全都要」，每条参数附工作原理逐行注解
icon: 🚀
tags: [性能, JVM, 优化, Paper, 配置]
order: 6
---

# 性能调优从入门到精通

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（向下兼容 1.21.x）。Folia 系核心通用，但文件名略有不同（见文中标注）。

核心装好了，插件装上了，进去一看 — TPS 10，玩家抱怨「走路像泡果冻」。这不是加内存能解决的，得调。

本文分四层（由浅入深），**新手精读第一层就能解决 60% 卡顿**。第一层解决 JVM 参数（最简单的），第二层配置文件（见效最大的），第三层插件级，第四层 Windows 专属。

> **TPS / MSPT 概念速览：**
>
> | 概念 | 含义 | 健康值 |
> |------|------|--------|
> | TPS | 每秒有多少 tick（游戏刻），MC 正常是 20 | ≥ 19.5 流畅；< 15 明显卡顿 |
> | MSPT | 每 tick 需要的毫秒数，20 TPS 意味着 tick 周期是 50ms | < 50ms 强；50-100ms 可接受；> 100ms 严重卡顿 |
>
> 查看命令：控制台 `tps` 或游戏 `/tps`

---

## 前置知识：JVM 垃圾回收（GC）到底是什么？

> 在调参数之前，先理解原理，否则你永远在「抄参数」而不是「用参数」。

### JVM 内存分块

```
JVM 堆内存（Heap）：
┌──────────────────────────────────────────────┐
│                 JVM Heap                      │
│  ┌─────────────────┐  ┌───────────────────┐  │
│  │    Young Gen    │  │    Old Gen        │  │
│  │  (新生代)        │  │   (老年代)         │  │
│  │  ┌────┬────┬──┐ │  │                   │  │
│  │  │ E  │ S0 │S1│ │  │  长期存活的对象     │  │
│  │  └────┴────┴──┘ │  │  在这里           │  │
│  │  新对象在这里      │  │                   │  │
│  └─────────────────┘  └───────────────────┘  │
└──────────────────────────────────────────────┘

E = Eden（伊甸区）—— 所有新对象在这里创建
S0, S1 = Survivor 0/1（存活区）—— 每次 GC 后在这里互换
Old = 老年代 —— 活过多次 Minor GC 的对象晋升到这里，这里是 GC 的主要战场
```

### GC 的基本流程

```
步骤 ❶：对象在 Eden 区创建
         ↓ Eden 满了
步骤 ❷：Minor GC（Minor GC 很快，延迟低）
         ├── 死亡对象 → 回收
         └── 存活对象 → 移到 Survivor
         ↓ 活过 N 次 Minor GC（默认 15 次，我们用 1 次）
步骤 ❸：对象晋升到老年代
         ↓ 老年代也满了（或者增量回收阈值到了）
步骤 ❹：Full GC / Mixed GC（G1 专用）
         └── 这一步才是卡顿的根源！因为要暂停全部应用线程
```

### G1GC（Garbage-First）的核心思想

```
G1 与其他回收器的区别：

传统回收器（如 CMS）：
  ├── 老年代满了 → 全局 STW（Stop The World，停止所有线程）
  └── STW 持续 100-500ms → 服务器冻结 → 玩家看到「卡顿一下」

G1（Garbage-First）回收器：
  ├── 不再对所有老年代做全局回收
  ├── 把堆分成几千个小「Region」（我们设 8MB 一个）
  ├── 每次只回收垃圾最多的 Region（Garbage First 名字的由来）
  └── STW 可控在 200ms 以内 → 玩家几乎感觉不到
```

这就是为什么我们用 G1 而不是 Serial / Parallel：**G1 牺牲一点吞吐量（多占点内存）来换取更低的 GC 停顿**。MC 服务器是低延迟场景，优先级是「少卡」而不是「吞吐量最大」。

---

## 第一层：启动参数调优（3 分钟生效）

很多时候卡顿不是服务器太烂，是 JVM 参数在拖后腿。**这步错了，后面怎么调配置都没用。**

### 不要做的事（附原因）

```
❌ -XX:+UseConcMarkSweepGC
   → CMS 回收器已在 Java 14 中 DELOMBOK 文档标记为废弃，Java 15 彻底移除
   → 用了直接报错「Unrecognized VM option 'UseConcMarkSweepGC'」

❌ -XX:ParallelGCThreads=4
   → 手动限制并行 GC 线程数。在 4 核 CPU 上可能合适，但在 16 核上会大大拖慢 GC
   → 不手动设 = JVM 自动检测 CPU 核数并优化分配，通常更聪明

❌ -Xmn1G
   → 固定新生代大小。G1 的核心算法就是动态调整新生代占比来适应不同负载
   → 你把新生代钉死 = G1 的自适应算法失效，退化为类似 CMS 的行为

❌ -XX:+AggressiveOpts
   → Java 9+ 中已删除。标识未来的优化实验版本，无用且可能触发 bug

❌ 加一长串你看不懂的参数
   → 大神模板的参数可能是从 Java 8 抄到 Java 25，早就过期了
   → 相信 JVM 默认 + 少量已知有效的调优，比堆参数安全 10 倍
```

### 2026 年推荐的通用模板（生产验证版）

```bash
java -Xms8G -Xmx8G \
  -XX:+UseG1GC \
  -XX:+ParallelRefProcEnabled \
  -XX:MaxGCPauseMillis=200 \
  -XX:+UnlockExperimentalVMOptions \
  -XX:+DisableExplicitGC \
  -XX:G1NewSizePercent=30 \
  -XX:G1MaxNewSizePercent=40 \
  -XX:+UnlockDiagnosticVMOptions \
  -XX:G1MixedGCCountTarget=4 \
  -XX:G1MixedGCLiveThresholdPercent=90 \
  -XX:G1RSetUpdatingPauseTimePercent=5 \
  -XX:SurvivorRatio=32 \
  -XX:+PerfDisableSharedMem \
  -XX:MaxTenuringThreshold=1 \
  -XX:G1ReservePercent=20 \
  -XX:G1HeapWastePercent=5 \
  -XX:InitiatingHeapOccupancyPercent=15 \
  -XX:G1HeapRegionSize=16M \
  -jar server.jar --nogui
```

（这是一行命令，bash 的 `\` 把多行粘合成一行执行。Windows 下要把 `\` 去掉，所有参数写在一行。）

### 完整参数详解表

每条都附：**功能** + **为什么这样设** + **不这样设会怎样**。

| 参数 | 功能 | 推荐值 | 调大后果 | 调小后果 |
|------|------|--------|----------|----------|
| `-Xms` | 初始堆内存 | 等于 `-Xmx` | 动态扩容消耗性能 | 初始频繁 GC |
| `-Xmx` | 最大堆内存 | 视场景而定 | 太大 GC 停顿太长 | 太小触发 OOM |
| `-XX:+UseG1GC` | 启用 G1 回收器 | — | — | — |
| `-XX:MaxGCPauseMillis` | 目标最大 GC 停顿 | 200 | GC 太过频繁 | GC 停顿过长 |
| `-XX:G1NewSizePercent` | 新生代最小占比 | 30% | 可能浪费内存 | Minor GC 频繁 |
| `-XX:G1MaxNewSizePercent` | 新生代最大占比 | 40% | 老年代空间小了 | Old GC 频繁 |
| `-XX:MaxTenuringThreshold` | 晋升老年代前的存活次数 | 1 | Minor GC 更耗时 | Old GC 频繁 |
| `-XX:G1HeapRegionSize` | 单个 Region 大小 | 16M | 灵活性降低 | Region 数太多 |
| `-XX:G1ReservePercent` | 预留堆空间防溢出 | 20% | 可用内存减少 | 容易触发 Full GC |
| `-XX:InitiatingHeapOccupancyPercent` | 触发 Mixed GC 的老年代阈值 | 15% | Mixed GC 频繁 | Old GC 堆积 |
| `-XX:SurvivorRatio` | Eden/Survivor 比例 | 32 | Survivor 不够 | Survivor 浪费 |
| `-XX:G1MixedGCCountTarget` | Mixed GC 分几步做完 | 4 | 停顿更长 | 回收不充分 |
| `-XX:+ParallelRefProcEnabled` | 并行处理引用 | — | — | 串行更慢 |

### 为什么要设 `-XX:MaxTenuringThreshold=1`？

这是理解 MC 的关键点：

```
MC 服务端对象的典型生命周期：

1. 大量「临时对象」
   ├── tick 期间的数据包
   ├── 玩家移动时的位置计算结果
   ├── 区块加载时的临时方块数据
   └── 这些对象在 1 次 tick 后立即死亡
   
2. 少量「长期对象」
   ├── 在线玩家的数据
   ├── 区块数据（即使玩家不在线也可能保留）
   └── 插件的持久缓存数据

普通应用的对象生命周期模型：
   80% 对象活几分钟，20% 活几小时

MC 服务端的反向模型：
   90% 对象活 1-2 个 tick（毫秒级），10% 活几天

因此，让对象只走一轮 Survivor区就晋升老年代（MaxTenuringThreshold=1）：
  → 快速把短命对象从 Young 区移出
  → 减少 Minor GC 的拷贝开销
  → 让 Young 区更高效
  → MC 服务器专属调优
```

### `-Dfile.encoding=UTF-8` 必须加的冷知识

```bash
# 很多 Windows 默认是 GBK，中文聊天/名牌/文件名会乱码
java -Dfile.encoding=UTF-8 -Xms8G -Xmx8G ...
#    ↑ 加上这个，所有 I/O 操作强制用 UTF-8 编码
#    ↑ 不加这个，你的中文物品名字就是 ??? 方块
```

### 内存给多少合适？

**常见的错误认知：内存越大越好。** 实际上：

```
物理内存 4GB → JVM 分配 2-3GB（一半，留 1GB 给操作系统 + Bukkit 层）
物理内存 8GB → JVM 分配 4-6GB（留 2GB 给 OS + 文件和映射缓存）
物理内存 16GB → JVM 分配 8-12GB（留 4GB）
物理内存 32GB+ → JVM 分配 16-24GB（留够 OS，但不是直线上升）

⚠️ 为什么不是「堆越大越好」？
  
  JVM 堆越大 → GC 的扫描区域就越大 → 一次 Full GC 的 STW（停止时间）越长
  4GB 堆 → Full GC 停顿约 200ms → 玩家感觉一下卡顿
  32GB 堆 → Full GC 停顿可能 3-5秒 → 服务器直接假死
  
  因此：
  10 人服给 32GB 堆 = 给赛车加拖拉机引擎，反而更慢
  100 人服给 2GB 堆 = 小水杯游泳，GC 频繁触发，更卡
  
  原则：给够用就行，留出 OS 需要的 buffer
```

| 场景 | 推荐 JVM 内存 | 理由 |
|------|-------------|------|
| 朋友服（5 人内） | 2-4G | 插件少，实体少 |
| 小型社区（20 人） | 4-6G | 中型规模 |
| 中型服务器（50+ 人） | 8-12G | 需要预生成 + 调配置 |
| 大型服务器（100+ 人） | 12-16G | 考虑拆服或 Folia |

---

## 第二层：Paper 配置文件调优（90% 的优化在这里）

### 配置文件层级关系

```
Paper 有四层配置文件，优先级从低到高：

paper-global.yml         # 全局设置（所有世界共用）
  ↑ 覆盖
paper-world-defaults.yml # 世界默认值（新建世界继承）
  ↑ 覆盖
worlds/world/paper-world.yml  # 具体世界的独立配置
  ↑ 覆盖
bukkit.yml + spigot.yml  # 传统兼容层（仍有效）

        一般修改优先级：
        90% 的优化项在 paper-world-defaults.yml
        8% 在 paper-global.yml
        2% 需要动 spigot.yml
```

**新手只需要关注 `paper-world-defaults.yml` 这一个文件，就把性能优化了 80%。**

### 必调项目（按影响程度排序）

#### 1. 视野视距（最直接的优化，立竿见影）

```yaml
# paper-world-defaults.yml
chunks:
  # view-distance 决定了「玩家能看到多远」（方块）
  # 实际影响：每 tick 要同步给客户端的区块数
  # 设为 N → 玩家周围的 (2N+1)×(2N+1) 个区块需要处理
  #
  # 数学关系：
  # view-distance=8 → 17×17=289 个区块要同步
  # view-distance=6 → 13×13=169 个区块要同步
  # 每降 1 ≈ 减少 22% 的区块同步开销
  view-distance: 6
  # 新手推荐：6（10 人服）或 8（20-30 人服）
  # 不要低于 4，否则玩家游戏体验像「瞎子摸象」

  # simulation-distance 决定了「多远的实体/TNT 会被完整 AI 模拟」
  # 通常比 view-distance 低，因为「看得到」≠「需要完整模拟」
  simulation-distance: 4
  # 设为 4 → 玩家周围 4 区块内的怪物会 AI 追踪、补货
  #         5+ 区块外的怪物静止不动（但仍存在 Server 里，只是不动）

  # 区块保存频率（tick 数），默认 6000 tick = 5 分钟
  # 设太频繁（如 1000）→ 磁盘 IO 暴涨
  # 设太少（如 12000）→ 崩服时丢更多进度
  # 小服推荐保持 6000，大服可以提到 12000
  autosave-period: 6000
```

#### 2. 实体相关（卡顿的头号元凶，70% 的服务器性能瓶颈来自实体）

```yaml
# paper-world-defaults.yml
entities:
  spawning:
    # ❶ 按单区块算的怪物生成上限
    #    默认 70 已经很低（再降可能影响刷怪塔效率）
    #    但大量模组服默认 100+
    monster-spawn-max: 70        # 默认 70，调到 30 大幅减少开销
    animal-spawn-max: 10         # 默认 10（猪牛羊鸡），5-8 够用
    water-spawn-max: 5           # 默认 5（鱼/鱿鱼），不动
    water-ambient-spawn-max: 20  # 默认 20（鳕鱼等），降到 10 省 CPU
    ambient-spawn-max: 0         # 默认 15（蝙蝠），关掉：蝙蝠毫无用处

    # ❷ 按玩家人数分配怪物的比例开关（重要！）
    #    打开后，怪物生成上限 = per-player-mob-spawns 比例 × 玩家数
    #    10 人服和 1 人服的刷怪塔效率基本一致
    per-player-mob-spawns: true  # 强烈推荐开启
    
    # ❸ 怪物不会在玩家视野内生成，但超出距离会清除
    despawn-ranges:
      monster:
        soft: 28   # 超出 28 格软清除（玩家走后随机消失，默认 32）
        hard: 96   # 超出 96 格硬清除（瞬间消失，默认 128）

  # ❹ 实体激活范围（第二重要的性能旋钮）
  #    「激活」= 完整模拟 AI/移动/路径追踪
  #    「不激活」= 实体仍然在世界里，只是不动不思考（省 CPU）
  activation-range:
    monsters: 32     # 32 格内的怪物会追击、走位
    animals: 24      # 24 格内的动物会走、吃草
    raiders: 48      # 48 格内的袭击村民（掠夺者）
    misc: 16         # 16 格内的经验球/掉落物
    water: 12        # 12 格内的水生生物
    villagers: 24    # 村民：路径寻路是性能黑洞，宁可低点
    
  # ❹ 非活跃实体的 tick 间隔（YAPS 调优）
  #    不活跃的怪物、动物每秒 tick（20 tick）→ 每 2-4 tick tick 一次
  tick-rates:
    behavior:
      villager:
        validatenearbypoi: 60     # 村民检查附近的兴趣点（职业方块）频率（tick），默认 1
        acquirepoi: 120           # 村民尝试获取新兴趣点频率，默认 1
    sensor:
      villager:
        secondarypoisensor: 80    # 村民检查次要兴趣点的频率，默认 40
      axolotl:                    # 美西螈传感器
        attackable-target: 40
        nearest-players: 40
```

#### 3. 红石 — 性能与兼容性的权衡

```yaml
# 红石实现方案
redstone-implementation: VANILLA  
# 可选值：
#   VANILLA   = 原版行为（红石机器完好无损）+ 性能差一点
#   EIGENCRAFT = 更快但部分机器失效（飞行器、零刻）
#   ALTERNATE = 中性折中（经典飞机仍可用）
```

**决策树：**

```
玩家主要玩法中有红石机器吗？
  ├── 是，有飞行器/零刻/刷铁机需求 → VANILLA
  ├── 是，但只有简单红石门/压力板 → ALTERNATE  
  └── 没有（纯生存/小游戏）       → EIGENCRAFT（更省 CPU）
```

#### 4. 其他关键性能项

```yaml
# ❶ 灯塔/信标效果处理
#    每次信标给范围内玩家计算效果，NBT 读取是性能开销
beacon:
  effect-range:
    # 默认值已经比较激进，不要再调高
    level: 4     # 不要超过 4

# ❷ 机关触发（观察者、漏斗、投掷器）
#    观察者的红石检测本身不频繁，但如果大量观察者堆叠在一个区块会出问题
redstone:
  # 每秒红石 tick 数，保持 20 即可，20 = 默认

# ❸ 物品合并
#    玩家丢出的物品默认每 5 分钟合并一次（2500 tick）
item-merging:
  # 合并同类物品能大幅减少实体数（掉落物也是一种合并收益）
  radius: 2.5      # 2.5 格内的同类物品会合并

# ❹ 防透视（不影响性能，默认开启即可）
anti-xray:
  enabled: true
  engine-mode: 2    # 模式 2（隐藏矿石）性能开销可忽略
```

### spigot.yml 里的经典项

```yaml
# spigot.yml
world-settings:
  default:
    # ❶ 视距（和 paper 的 view-distance 保持一致，避免冲突）
    view-distance: 6
    
    # ❷ 怪物检测玩家的范围（玩家多远时怪物注意到）
    mob-spawn-range: 6
    
    # ❸ 实体激活范围（如果 paper 里已配，这里的配置会被覆盖）
    entity-activation-range:
      monsters: 32
      animals: 24
      misc: 16
      
    # ❹ 漏斗优化
    ticks-per:
      hopper-transfer: 8     # 漏斗传输冷却（8 tick = 0.4 秒）
      hopper-check: 1        # 漏斗检测冷却（1 tick）
      
    # ❺ 合并半径
    merge-radius:
      item: 2.5              # 物品合并半径
      exp: 3.0               # 经验球合并半径
```

---

## 第三层：插件级优化

### 必装的性能辅助插件（对比选择）

| 插件 | 作用 | 适用场景 | 注意 |
|------|------|---------|------|
| [spark](https://spark.lucko.me/) | 性能分析的「听诊器」，火焰图可视化 | **必备**，所有服都该装 | 分析时本身有 1-5% 性能开销，分析完卸下 |
| [Chunky](https://github.com/pop4959/Chunky) | 预生成地图区块 | **新服必装** | 跑的时候很占 CPU，最好在空跑时挂一晚 |
| [FarmLimiter](https://www.spigotmc.org/articles/farmlimiter.296/) | 限制农场密度/实体堆积 | 大型生存服必装 | 调太严会误伤玩家 |
| [EntityTrackerFixer](https://www.spigotmc.org/resources/entitytrackerfixer.62171/) | 修复实体追踪的隐藏开销 | 1.16+ 高版本服 | 新版 Paper 已内置部分功能，效果递减 |
| [Clumps](https://www.spigotmc.org/resources/clumps.69281/) | 合并附近的经验球 | PVP/机械服成熟方案 | 仅合并经验球 |
| [LimitPillagers](https://www.spigotmc.org/resources/limitpillagers.85269/) | 限制袭击生物的巡逻生成 | 大型生存服必装 | 无冲突 |

### 用 spark 找性能瓶颈（标准化流程）

```
前置准备：
  ① 装 spark
  ② 启动后在控制台输入：
     /spark profiler --thread Server Thread
     （只分析主线程，插件引起的卡顿全在主线程）
     
采样流程：
  ③ 等 1-2 分钟让玩家正常活动（跑图、建设、打怪）
  ④ /spark profiler --stop
  ⑤ 控制台给一个 URL → 打开网页火焰图

常见瓶颈对照表：
  ┌─────────────────────────────────┬──────────────────────────────┐
  │ 火焰图中最大色块                 │ 说明 & 解决方案              │
  ├─────────────────────────────────┼──────────────────────────────┤
  │ `ChunkMap.sendChunk` / `Chunk`  │ 区块同步太多 → 降 view-distance│
  │ `Entity.tick` / `Entity.aiStep` │ 怪物太多 → 调 activation-range│
  │ `BlockEntityHopper`             │ 漏斗链太长 → 改为水流传输    │
  │ `PathfinderMob` / `Navigator`  │ 寻路计算 → 减少障碍物密度    │
  │ 某插件名                       │ 该插件代码有问题 → 换替代插件  │
  │ `net.minecraft.world.level`    │ 地图未生成 → 用 Chunky 预生成  │
  └─────────────────────────────────┴──────────────────────────────┘
```

### 地图预生成（最简单粗暴的优化）

**原理：** 玩家跑图卡顿的原因是「边跑边生成」，生成区块时要计算地形、结构、矿石、树木 — 全部是 CPU 密集型。生成完的区块存在硬盘里，读出来直接发给玩家，几乎 0 CPU 开销。

```
// 预生成命令（游戏执行）：
/chunky setradius 3000        // 设置半径为 3000 格
/chunky start                  // 开始生成

// 检查进度：
/chunky progress              // 输出已生成百分比和预计剩余时间

// 完成后：
/chunky confirm confirm       // 确认完成

⏰ 时间参考：
  半径 3000 (6000×6000) → 现代 SSD 约 3-5 小时
  半径 5000 (10000×10000) → 约 8-12 小时
  跑的时候 CPU 使用率满，建议玩家不在时跑
```

> **适用范围半径多大合适？**
>
> | 玩家规模 | 推荐半径 | 覆盖面积 |
> |---------|---------|---------|
> | 10 人内 | 2000 | 4000×4000 = 约 1600 区块 |
> | 20 人内 | 3000 | 6000×6000 = 约 3600 区块 |
> | 50 人内 | 5000 | 10000×10000 = 约 10000 区块 |
>
> 再大了没必要，玩家跑到边界的时间够你平时维护时顺便生成。

---

## 第四层：Windows 专属优化

### Java 版本选型

```
优先级：

1️⃣ GraalVM Enterprise / CE 25
   → 最快的 JVM，企业级优化，JIT 编译效率极高
   → 但 bug 比 Temurin 多，适合调优玩家
   
2️⃣ Temurin (Adoptium) 25 LTS  ← 平民首选
   → 开源免费，性能接近 GraalVM，稳定性极佳
   → https://adoptium.net/

3️⃣ Oracle JDK 25 LTS
   → 商业条款变化，不推荐个人服务器
   
❌ 不要用：
   - Oracle JDK 自带的安装器带广告
   - 任何「JRE-only」的阉割版（不支持诊断调试）
   - 绿色版/精简版（缺关键 DLL）
```

### 启动脚本完整模板（含注释版）

```bat
@echo off
chcp 65004 >nul
REM ❶ @echo off = 关闭命令本身的回显
REM
REM ❷ chcp 65004 >nul = 把窗口编码切换成 UTF-8，
REM    避免中文日志在控制台显示乱码
REM    (仅对显示不影响文件输出)
REM
REM ❸ 设置 Java 路径（如果装了多个 Java，必须指定）
set "JAVA=C:\Program Files\Eclipse Adoptium\jdk-25.0.0\bin\java.exe"

REM ❹ 启动命令（所有参数连成一行粘贴）
"%JAVA%" -Dfile.encoding=UTF-8 -Xms8G -Xmx8G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:+UnlockDiagnosticVMOptions -XX:G1MixedGCCountTarget=4 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1HeapRegionSize=16M -jar server.jar --nogui

REM ❺ pause = 如果脚本意外结束时暂停（让你看到错误信息）
pause
```

### 进程优先级（Windows 专用）

```
问题：Windows 系统里，Java 进程默认优先级是「Normal」。系统后台任务（Windows Update、杀毒软件扫描）会时不时抢占 CPU，导致 MC 服务端单 tick 执行超时。

解决：把 Java 进程优先级调到「High」。

操作步骤：
1. 启动 start.bat
2. Ctrl+Shift+Esc 打开任务管理器
3. 「详细信息」标签 → 右键 java.exe → 设置优先级 → 高
4. 确认

⚠️ 不要设「实时」，否则 Windows 系统线程会饥饿 → 鼠标和键盘可能失灵！

自动化方式（通过 PowerShell）：
```

```powershell
# 服务器启动后立刻执行一次（在 PowerShell 里运行）
Get-Process java | ForEach-Object { $_.PriorityClass = 'High' }

# 或者在 start.bat 的末尾加这一行（需管理员权限）
# wmic process where name="java.exe" CALL setpriority "high"
```

### Windows 上的常见坑

```
┌──────────────────────────────────────────────────────────────┐
│ Q：任务管理器显示 Java 用了 12GB，但我只给了 8GB 堆？           │
├──────────────────────────────────────────────────────────────┤
│ A：正常。Windows 任务管理器的「已提交」不等于「使用中的内存」。  │
│                                                              │
│ JVM 的「已提交内存」包括：                                     │
│    ① 堆内存（你设的 8GB）                                     │
│    ② MMAP 文件映射（区块文件、JAR 文件映射）                    │
│    ③ 元空间（Metaspace，类加载信息）                          │
│    ④ 代码缓存（JIT 编译后的 native 代码）                      │
│    ⑤ 线程栈（每个线程 512KB-1MB）                              │
│                                                              │
│ ≈ 8GB 堆 + 1-2GB 其他 + 1-2GB 映射 ≈ 10-12GB 已提交           │
│ 如果「使用内存」（Working Set）远小于「已提交」实际上没问题     │
└──────────────────────────────────────────────────────────────┘
```

---

## 常见问题 Q&A

**Q：TPS 还是低，我是不是该加内存？**

先花 5 分钟装个 spark 做 profile 分析，不要凭感觉加钱。5 人服 8GB 内存 TPS 低，95% 是配置问题（view-distance 太高 / activation-range 太宽）不是内存问题。反过来，20 人服给了 64GB 内存 TPS 照旧低，那是 G1 堆太大导致 Full GC 太长。

**Q：Folia 要不要改这些配置？**

Folia 的环形区域分块激活机制**天然减少**无谓开销。`activation-range` 这类配置效果远没有 Paper 上好。**Folia 核心的性能收益已经很大了，别过度优化。** 重点放在 view-distance 和 mob-spawn-max 就够了。

**Q：关了怪物 AI 刷怪塔会不会失效？**

会有一些影响，但 1.17+ 的 Paper 用「激活范围」做了折中：靠近时怪物才 AI 追踪，远离时静止不动不影响掉落物收集。这也是目前最佳方案。如果你需要很高效率的刷怪塔，考虑用 FarmLimiter 设置「不限制的例外区域」。

**Q：实体堆在一起（挂机塔）怎么处理？**

```
# 方案 1：paper-world-defaults.yml
entities:
  spawning:
    per-player-mob-spawns: true
    
# 方案 2：FarmLimiter（更精细）
/farmlimiter set max-cows-per-chunk 20
/farmlimiter set max-mobs-per-chunk 50

# 方案 3：ClearLagg（最激进，但可能误杀）
/lagg clear
```

**Q：装了优化插件后 TPS 没变化？**

TMS「没问题就是有问题」。检查：
1. 插件有没有真正在跑（`/plugins` 是不是绿色？）
2. TPS 真的是 20 / MSPT 真的是 50ms 以下？
3. 玩家的「卡」是不是网络延迟而不是 TPS（/ ping 查看延迟）
4. 关掉所有插件后 TPS 是 20 吗？如果仍然是 15 → 是你的硬件有问题

## 下一步

- 想了解更深层的 NMS 级优化？关注核心源码文档
- 配置改炸了？[避坑与排错](#/guide/faq) 的开机失败部分有恢复方法
- 想知道自己服务器具体卡在哪个环节？装 spark 做性能分析（本文第三层有完整流程）
- 安全方面担心被攻击？[安全加固](#/guide/security-hardening)