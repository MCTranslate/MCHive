---
id: java-runtime-choice
title: Java 与 GC 选型：先决定用什么，再谈参数
description: 该选哪个 Java 发行版、Zulu / GraalVM / Dragonwell / Zing 怎么挑、G1GC 和 ZGC 哪个更适合你的服，以及 OpenJ9 为什么在 Paper 上会出事
icon: ☕
tags: [性能, JVM, Java, GC]
order: 15
---

# Java 与 GC 选型

> 调优的第一步不是抄参数，是选对 Java 和垃圾回收器。这篇讲**怎么选**，[性能调优从入门到精通](#/guide/performance-tuning) 讲**选完怎么调**。

## 一、先说结论

| 情况 | 用什么 |
|------|--------|
| 不知道选什么 | **Java 21 LTS（Zulu 或 Temurin）+ G1GC**，这是最稳的默认解 |
| 内存 ≥ 8G，想榨性能 | Java 21 + **ZGC** |
| 内存 4G 以下 | Java 21 + **G1GC**（ZGC 需要更多余量） |
| Minecraft 版本很老（1.8 之类） | 对应版本的 Java 8/11，**别硬上 25** |
| 服务端是 26.x | **Java 25**（26.x 服务端要求 Java 25） |

## 二、Java 版本对应关系

Java 版本不是越高越好，得跟你的服务端匹配：

| Minecraft 版本 | 需要 Java |
|----------------|-----------|
| 1.20.x – 1.21.x | Java 17 – 21 |
| 1.21.11 及部分新版本 | Java 21 |
| **26.x（本项目目标环境）** | **Java 25** |
| 1.8 – 1.12 等老版本 | Java 8 |
| 1.16 – 1.17 | Java 16 |

**装高版本的 Java 不会让老服务端变快**，反而有兼容风险。反过来，用低版本 Java 跑新服务端则直接起不来。

> 如果你在 Windows 上装了多个 Java，用 `java -version` 确认命令行默认调到的是哪个。多个 Java 的优先级看 `Path` 环境变量里**排在最前面的那个**。改完环境变量**必须重开终端**才生效——这一点很多人不知道，以为改了没用就反复改。

## 三、Java 发行版怎么选

`java -version` 里的 OpenJDK 是规范，各发行版是它的实现。差异主要在**性能、兼容性、授权**三点。

### Azul Zulu — 默认推荐

社区里最常见的选法，稳定性和安全性是它的主打。**注意别把 Zulu 的性能当成它的卖点**——很多人说「Zulu 快」，其实是把同公司的 **Zing** 的名声搞混了。Zulu 的定位是稳，不是快。

### GraalVM — 内存机器的高端选择

分 Community Edition（CE）和 Enterprise Edition（EE）。**除非你的服务器大到会被 Oracle 找上门，否则直接用 EE**。GraalVM 在 22.3.0 之后修掉了所有已知的 Minecraft 相关问题，兼容性没问题。

Oracle 官网也提供 GraalVM，但那个 EE 套件里绝大部分组件 MC 用不上，只用到编译器而已。

### Alibaba Dragonwell — 国产方案

分 Standard 和 Extended 版，**选 Extended**。对 Java 8 / 11 的老服务端比较有价值。

### Azul Zing — 性能优先，需申请

主打低延迟，和 Zulu 是同一个公司的两个产品线。**不提供公开下载**，得提交试用申请。

用在 Leaf 1.21.1 上测试时，主流插件（LuckPerms、Oraxen、ItemsAdder）都没发现不兼容；只有 HuskHomes 在 MariaDB 驱动上出现过 JVM Crash，换回 MySQL 就稳定了。

### ⚠️ OpenJ9 — 在 Paper 上不要用

OpenJ9 内存占用确实低，但**性能差**，而且和很多插件不兼容（比如 Spark）。

关键的一点：**Paper 服务端内置了 Spark，所以绝对不能在 Paper 上用 OpenJ9**。这几乎是最容易踩的雷之一——「换个省内存的 JVM 怎么反而更卡了」，答案就在这里。

## 四、GC 怎么选

GC（垃圾回收器）决定 JVM 什么时候回收内存、停顿多久。MC 服务器是**低延迟场景**，玩家在等交互，停顿就是卡顿。

### G1GC — 通用默认

分区回收，会优先回收垃圾最多的区域。停顿时间可控，兼容性最好。**内存不够的时候它就是最稳的选择。**

启动参数：

```
-XX:+UseG1GC
```

### ZGC — 低延迟，内存要够

停顿可以做到**亚毫秒级**，而且能充分利用多核。对玩家体验的提升是实打实的「几乎感觉不到 GC」。

代价是**需要更多内存余量**。经验值：起步 4 核 8G，**推荐 8 核 8G**。

启动参数：

```
-XX:+UseZGC
```

> ZGC 在 Java 21 以下还叫「Shenandoah」或 experimental ZGC（`-XX:+UnlockExperimentalVMOptions`），Java 21 之后 ZGC 转正，可以直接用。

### 怎么选

```
内存够（≥8G）？
├─ 是 → Java 21+ → ZGC
└─ 否 → G1GC
```

## 五、别做的事

调优篇目里有完整清单，这里只列最容易踩的：

- ❌ **别手动设 `-XX:ParallelGCThreads`** — JVM 自己会按 CPU 核数算，手动限制反而拖慢
- ❌ **别钉死新生代大小** — G1 的自适应算法会失效
- ❌ **别抄 `-XX:+UseConcMarkSweepGC`** — CMS 已被移除，Java 14 起直接报 `Unrecognized VM option`
- ❌ **别把内存给超物理内存的 70%** — 剩下的要留给系统，触发 swap 才是真的卡
- ❌ **别在 Paper 上用 OpenJ9**

## 六、怎么确认你现在用的是哪个

```
java -version
```

输出里会写清楚发行版和版本。比如：

```
java version "21.0.5" 2024-10-15 LTS
Zulu21.40+17-CA
```

第二行就是发行版。想换的话改 `Path` 环境变量里 Java 路径的**顺序**（最上面的优先），然后**重开终端**。

## 下一步

- [性能调优从入门到精通](#/guide/performance-tuning) — 选完之后才是参数怎么调
- [卡顿时怎么查](#/guide/lag-diagnosis) — 先确定问题出在 GC 还是别的地方
- [启动脚本与服务端目录](#/guide/startup-script) — 参数最终要落在启动脚本里
