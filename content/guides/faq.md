---
id: faq
title: 避坑与排错速查
description: 从启动报错到游戏卡顿、从插件冲突到版本不兼容 — 按【症状】→【原因】→【解法】三段式速查，每条附详细注解和命令示例
icon: 🛟
tags: [排错, FAQ, 避坑]
order: 5
---

# 避坑与排错速查

> 本教程更新于 2026 年 9 月。建议加书签，出事先 Ctrl+F 搜**红色报错关键词**。

本文分四部分：**启动问题**（服务器起不来）、**游戏内问题**（玩家进服后异常）、**网络问题**（连接失败）、**排错方法论**（通用解题思路）。

---

## 一、启动问题（服务器起不来）

> 先分清楚：**完全没反应** vs **启动中崩溃** vs **启动后卡住不动**。

### 1.1 双击 start.bat 后黑框一闪就没了

**原因：** 通常是 Java 路径没配好，或者 Java 版本不对。

**解决：**

```cmd
:: 在 cmd 里手动测试 java
java -version

:: 如果提示「'java' 不是内部或外部命令」
:: 说明 PATH 没配好。解决：
:: 方法 1：写 start.bat 时 java 用完整路径
"C:\Program Files\Eclipse Adoptium\jdk-25.0.0\bin\java.exe" -Xms4G -Xmx4G -jar server.jar --nogui
pause
```

### 1.2 启动时崩溃，控制台输出 `UnsupportedClassVersionError`

**原因解读：**

```
java.lang.UnsupportedClassVersionError: org/bukkit/craftbukkit/Main has been compiled by a more recent version of the Java Runtime (class file version 69.0), this version of the Java Runtime only recognizes class file version up to 61.0
```

| 参数 | 含义 |
|------|------|
| `class file version 65.0` | Paper 26.x 需要 Java 25+（对应 class 文件版本 69） |
| `class file version 61.0` | 当前 Java 是 Java 17（只能识别版本 61） |

**解决：** 升级 Java 到 25 或更高（见 [15 分钟极速开服 · 第 1 步](#/guide/quick-start)）。

### 1.3 启动时输出 `Invalid plugin.yml`

**原因：** 某个插件的 plugin.yml 坏了。常见场景：

- 下载的 jar 只有几百 KB（实际应该几十 MB）→ 下载失败了，删了重新下
- 该插件用的 API 和你的核心版本不兼容

**解决：**

```
步骤 1：看崩溃日志里哪一行提到了文件名
        示例输出：[Server] ERROR Could not load 'plugins/SomePlugin.jar' in folder 'plugins'
        → 文件名是 SomePlugin.jar
        
步骤 2：删掉或改名
        mv plugins/SomePlugin.jar plugins/SomePlugin.jar.bak
        
步骤 3：重启服务器
        
步骤 4：去插件官方页面重新下载正确版本
```

### 1.4 启动后卡住不动，也没有更多输出

**原因：** 通常是地图损坏或某个插件在「加载阶段」死循环。

**解决：**

```bash
# 方法 1：等 10 分钟（首次启动新地图会生成出生区域，会很慢）

# 方法 2：Ctrl+C 杀死进程，看卡住时的最后几行日志

# 方法 3：把所有插件移出 plugins/ 目录，启动
#         如果正常了 → 就是某个插件的卡死
#         再用二分法逐个放回来排查
```

### 1.5 启动输出 `Failed to bind to port`

**原因：** 端口被占用。常见场景：

- 上一次服的进程没完全关掉（还占着 25565）
- MC 客户端占用了本地端口
- 端口被其他程序占用了

**解决：**

```bash
# Linux：查哪个进程占用端口
sudo lsof -i :25565
# 输出类似：java ... TCP *:25565 (LISTEN)
# 看 PID，然后杀掉：
sudo kill -9 <PID>

# Windows：查占用端口的 PID
netstat -ano | findstr :25565
# 输出类似：TCP    0.0.0.0:25565  ...  PID:12345
# 然后去任务管理器 → 详细信息 → 找 PID 12345 → 结束
```

---

## 二、游戏内问题（玩家进服后的异常）

### 2.1 玩家输入命令提示 `Unknown command`

> 这个命令根本没有被服务器识别。按优先级顺序排查：

```
第 1 步：/plugins
          → 看命令所属插件是不是绿色
          → 红色 = 插件加载失败，去日志查报错

第 2 步：如果绿色 → 权限不够
          → 用 OP 号测试：控制台 op 玩家名
          → OP 能用 = 权限问题，配置 LuckPerms 给该组该命令权限

第 3 步：如果 OP 也不能用
          → 该插件根本没注册这个命令（可能是旧版文档里的命令，新版改了名字）
```

### 2.2 玩家反馈「一进去就卡」或「区块加载像慢动作」

这个情况通常是**性能问题**而非bug。

**排查工具链：**

```
❶ 装 https://spark.lucko.me/

❷ 游戏中输入命令：
    /spark profiler start
    
❸ 等待 5 分钟（让 profiler 采样高发场景）
    /spark profiler stop
    
❸ 控制台给一个 http 链接 → 打开网页

❹ 看火焰图（Flame Graph）：哪个颜色块最大 = 哪个最耗 CPU
    常见元凶及特征：
    ├── `net.minecraft.server.level.ChunkMap` → 区块加载过多 → 降 view-distance
    ├── `net.minecraft.world.entity.Entity` → 实体太多 → 装 FarmLimiter
    ├── 某插件名字 → 该插件写得太差 → 换替代插件
    └── `Tick` 主线程执行超时 → 装 Chunky 预生成地图
```

### 2.3 TNT 爆炸后全员 FPS 暴跌

**原因：** TNT 爆炸后生成大量「掉落物实体」（每个 TNT 方块变成一个 Item 实体），大量实体挤在一个区块导致主线程计算 TPS 崩塌。

**解决：**

```bash
# 紧急措施（控制台执行）
/kill @e[type=item]
# 立即清除所有掉落物

# 长期方案：paper-world-defaults.yml
world-settings:
  default:
    entities:
      spawning:
        # 设置全局掉落物上限
        item:
          limit: 200      # 同区块掉落物上限（默认 100 已经够低）
          
      entity-despawn-ranges:
        # 超出范围立即清理
        hard: 96
```

### 2.4 中文（聊天 / 名牌 / 书名）显示乱码

**根本原因：** Java 默认编码不是 UTF-8。

**Linux 启动参数：**

```bash
# 在启动命令里加：
java -Dfile.encoding=UTF-8 -Xms4G -Xmx4G -jar server.jar --nogui
```

**Windows 额外步骤：**

```
1. 启动脚本（start.bat）保存时编码选「ANSI」或「UTF-8 Not BOM」
   （Notepad++ → 编码 → 转为 UTF-8 无 BOM 编码）

2. 系统区域设置要勾选「Beta: UTF-8 全球语言支持」
   设置 → 时间和语言 → 语言和区域
   → 管理语言设置 → 更改系统区域设置
   → Beta 使用 Unicode UTF-8 提供全球语言支持 → 重启
```

### 2.5 装了汉化文件但不生效

有 4 个常见问题，**按顺序**逐个排查：

```
❶ 文件名不对 → 参考下表确认每个插件要求的语言文件名称

| 插件 | 要求文件名 | config 里配的字段 |
|------|-----------|-----------------|
| EssentialsX | lang_zh.yml | locale: zh |
| LuckPerms | messages_zh.yml | 内置locale，用 /lp editor 改 |
| WorldGuard | 不需要语言文件 | — |
| PlaceholderAPI | 不需要语言文件 | — |
| WorldEdit | 内置多语言 | 自动跟随客户端 |

❷ 目录放错 → 应该放在 plugins/插件名/，不是 plugins/ 根目录
    正确路径举例：plugins/Essentials/lang_zh.yml
    错误路径举例：plugins/lang_zh.yml

❸ 没重启服务端 → 大部分插件的语言文件只在启动时读取

❹ YAML 格式错误 → 比如此时你复制的是网页上的字符，中文引号「"
    要和英文引号 " 一模一样。验证方法：
    打开 https://www.yamllint.com/ → 粘贴你的文件 → 有红色报错就是格式错
```

### 2.6 插件在新版本里字段失效（控制台输出 `Unknown config option`）

**原因：** 配置文件是旧版插件留下的，新版插件改了字段名或用了不同的结构。

**解决：**

```
方法 1（推荐）：备份旧配置 → 删掉 → 让插件重新生成默认配置 → 参考[本站插件库](/plugins)重新配置

方法 2：看插件 CHANGELOG（变更日志），搜索 "config" 关键字，找改名的字段
```

---

## 三、网络问题（连接失败）

### 3.1 朋友报 `Connection refused: no further information`

**含义：** 服务器这端拒绝了连接。

**排查顺序：**

```
❶ 服务器进程在跑吗？
   命令行输入：
   Linux   → ps aux | grep server.jar
   Windows → 任务管理器看 java.exe 进程

❷ 端口放行了吗？
   云服务器 → 去控制台看看安全组规则（25565 TCP 是否开放）
   本地执行：
   Linux → sudo ufw status   （看 ufw 防火墙规则）
   Windows → netsh advfirewall firewall show rule name=all
   
❸ localhost 能连上吗？
   本机密级测试：Minecraft 客户端填 localhost
   能连上 → 服务器本身正常，问题在网络层
   不能连上 → 服务器进程有问题
```

### 3.2 朋友报 `Connection timed out`

**含义：** 请求发出去但超时了（主机没响应）。

**常见原因顺序：**

| 可能原因 | 你的操作 |
|---------|---------|
| IP 发送错误（朋友拿到了内网 IP 而不是公网 IP） | `curl ifconfig.me` 重新确认并发送 |
| 内网穿透没跑或隧道挂了 | 检查 frp 客户端是否在运行 |
| 家宽没有公网 IP | 联系运营商申请或换穿透服务 |
| 服务器有防火墙挡住了 | `sudo ufw allow 25565/tcp` |

### 3.3 能进服但 ping 延迟 > 200ms

**原因：** 物理距离远。国内玩家常因服务器在美西/欧中西部导致高延迟。

**缓解方案：**

```
方案 1 换服务器位置
        国内玩家 → 选枣庄、宿迁、上海、广州线路
        美西 / 欧中 → 永远不适合国内玩家
        
方案 2 线路优化
        CN2 GIA / 9929 / CMI 等优质线路虽然贵但延迟稳定
        普通线路（163/4837）抖动严重
        
方案 3 如果服务器在海外且不能换
        可使用游戏加速器（如 UU 加速器、迅游加速器）
        → 这是玩家自己的事，只能告知
        
方案 4 选延迟中等的「中间服务器」
        如日本/韩国节点延迟约 70-90ms，可接受
        相比美西的 150-200ms 好很多
```

---

## 四、排错的通用方法论

> 「报错看不懂」是正常的 — 没有谁天生就会。关键是**有条理**地缩小范围。

### 4.1 二分法排查插件（最高效）

当你有 10 多个插件和服务器的某个bug，用这个方法最快：

```
步骤 1：备份整个 plugins/ 目录（不需要停服）
        cp -r plugins/ plugins_all_backup/

步骤 2：把 plugins/ 里所有 jar 文件移走一半
        mv plugins/*.jar /tmp/pl_half_off/

步骤 3：重启服务器，看 bug 还在吗
        ├── bug 还在 → 问题在剩下一半里
        │   → 把剩下一半再分一半，重复步骤 2-3
        └── bug 没了 → 问题在移走的那一半里
            → 把移走的一半拿回来一半，重复步骤 2-3
            
步骤 4：最终范围缩到 1 个插件 → 找到凶手
```

### 4.2 读懂崩溃日志

崩溃日志的典型结构（阅读顺序）：

```
[时间戳] [线程/级别]: 描述内容
          ↑                 ↑
          看这个找时间点     + 找这行的「异常类名」

─────────── 以下是典型示例 ───────────

[15:23:01] [Server thread/INFO]: Done (12.345s)! For help, type "help"
[15:23:05] [Server thread/ERROR]: Encountered an unexpected exception
                                 ↑
                                 看这行：开始找异常堆栈
net.minecraft.ReportedException: Ticking entity
    at net.minecraft.server.MinecraftServer.tickChildren(...)
    at net.minecraft.server.MinecraftServer.tickServer(...)
    at net.minecraft.server.MinecraftServer.runServer(...)
    at net.minecraft.server.MinecraftServer.lambda$spin$0(...)
    at java.base/java.lang.Thread.run(...)
Caused by: java.lang.NullPointerException
    at com.example.buggyplugin.MyListener.onEntityTick(MyListener.java:42)
    ↑ 注意这行！问题根源在这里（第 42 行）
    at net.minecraft.world.entity.Entity.tick(...)
    ... 28 more
```

**关键概念：**

| 名词 | 含义 |
|------|------|
| `Server thread` | Minecraft 主线程（所有游戏逻辑都在这里跑） |
| `Netty Epoll` | 网络层线程（处理数据包收发） |
| `INFO` | 正常的日志 |
| `WARN` | 警告，可以忽略，但可以看看 |
| `ERROR` | 严重错误，必须看 |
| `FATAL` | 通常是崩溃，服务器即将停止 |

### 4.3 去搜索引擎的最佳姿势

把报错直接贴搜索引擎往往找不到中文答案。这样做效率最高：

```
❶ 把错误行复制（不要整个日志，只要那几行）

❷ 删掉具体的服务端路径和版本号
    原句：at net.minecraft.server.v1_21_R1.ChunkProviderServer.getChunkAt(ChunkProviderServer.java:425)
    改后：ChunkProviderServer getChunkAt NullPointerException

❸ 搜索「minecraft + 错误关键词 + 动词（如 fix/solve/work）」

❹ 优先看来自 spigotmc.org、paperMC GitHub、stackoverflow 的结果
```

### 4.4 最小可复现

如果试了以上所有方法还没解决：

```
目的：确定问题是「你配置不对」还是「插件/核心本身的 bug」

做法：
1. 全开一个全新的空目录（不要复制旧配置）
2. 只装 Paper 核心 + 出问题的插件
3. 能不能重现 bug？

   ├── 能重现 → 问题在插件或核心，去插件 Issue 反馈
   └── 不能重现 → 问题在你的配置或插件组合，回去用二分法
```

---

## 五、去哪里求助（给出有上下文的信息）

> 很大部分答不上来的求助帖都是因为「问题描述太模糊」。求助时请附上：

```markdown
【模板】在这两行之间复制填写
━━━━━━━━━━━━━━━━━━━━━━
【问题描述】
一句话描述现象

【复现步骤】
1. 先怎么怎么
2. 再怎么怎么
3. 触发了问题

【相关报错】
（如果有）复制报错最后的 10-20 行到这里

【环境】
- MC 版本：（如 26.3）
- 核心类型+版本：（如 Paper 26.3 build 177）
- Java 版本：（java -version 输出）
- 已装插件：（/plugins 完整列表）

【我试过什么】
写你已试过的操作，白费时间不如不复述
━━━━━━━━━━━━━━━━━━━━━━
```

### 求助渠道

| 渠道 | 适合什么 | 语言 |
|------|---------|------|
| [本站 GitHub Issue](https://github.com/MCTranslate/MCHive/issues) | 本站教程错误、汉化错误 | 中文 |
| 插件 SpigotMC 页面 | 插件 bug、功能建议 | 英文 |
| 插件 GitHub Issue | 核心 bug、详细调试 | 英文 |
| MC 相关 QQ 群 | 紧急求助、经验讨论 | 中文 |
| MC 论坛（MCBBS / 各种论坛） | 综合求助 | 中文/英文 |
| Reddit r/Minecraft | 公开讨论（如果问题不够专业可以发） | 英文 |

---

## 六、常见报错一句话解法

> 速查版 — 记住这些最常见的 5 条就能解决 80% 的问题：

| 报错 | 一句话解法 |
|------|-----------|
| `UnsupportedClassVersionError` | Java 版本低了，装 Java 21+ |
| `Invalid plugin.yml` | 删掉报错误的插件，重新下载 |
| `Failed to bind to port` | 端口被占用，杀掉占用进程或换端口 |
| `offline-mode` 提示登录失败 | online-mode=true 只允许正版；or 装 AuthMe 用离线模式 |
| 玩家权限 `/xxx` 没有 | 先用 OP 测试：`op 玩家名`；LP 用 `/lp user ... info` 查权限 |

## 下一步

- 能解决但卡在某个配置上？→ 看对应插件的 [配置逐项解释](/plugins)
- 服务器调完性能还是差？→ [性能调优从入门到精通](#/guide/performance-tuning)
- 发现配置文件不会改了？→ [15 分钟极速开山](#/guide/quick-start) 的 server.properties 章节
- 插件装了一半想知道加载顺序？→ [插件组合方案](#/guide/plugin-combos) 的安装顺序章节