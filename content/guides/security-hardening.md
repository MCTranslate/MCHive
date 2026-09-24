---
id: security-hardening
title: 安全加固：从裸奔到站稳
description: 防崩、防爆、防注入 — 权限最小化、漏洞扫描、登录保护和常见攻击面梳理，把你的服务器从「筛子」变成「堡垒」。
icon: 🛡️
tags: [安全, 权限, 加固, 防攻击]
order: 5
---

# 安全加固：从裸奔到站穩

> 本教程更新于 2026 年 9 月，聚焦 Minecraft 服务端常见攻击面。适用 Paper 26.x / Folia / Leaves 等 Bukkit 系核心。

刚开服的服务器像没装锁的房门 — 你自己觉得「反正没人来」，但互联网的扫描和爆破机器人 24 小时都在找裸奔的服务端。本文从最基础的安全锁讲起，到实际遇到攻击时的做法。

## 第一层：基础权限收敛

> **90% 的安全问题不是外部黑客，是内部权限传错了。**

### LuckPerms 的默认组权限审查

很多人装完 LuckPerms 就给了默认组 `* true` 或者类似的全权限。这是把管理员的钥匙发给了所有玩家。

**默认玩家只需要这些：**

```yaml
# 使用命令在控制台执行：
/lp group default permission set essentials.sethome true
/lp group default permission set essentials.home true
/lp group default permission set essentials.tpa true
/lp group default permission set essentials.tpaccept true
/lp group default permission set essentials.tpdecline true
/lp group default permission set essentials.msg true
/lp group default permission set essentials.spawn true
/lp group default permission set chestshop.shop.create true   # 装了的话
/lp group default permission set jobs.join.* true             # 装了的话
```

### OP 是个危险的东西

原版 OP 是「服务器主人」级别的权限，能绕过很多插件的权限检查。**永远不要把 OP 给非管理员。**

常见错误做法：

```
❌ 给玩家 OP 让他「帮忙测试」
❌ 在配置里把 admin 组加 minecraft.command.op 权限验证
❌ 服务器开起来后忘记把 OP 列表清零
```

正确做法：

```bash
# 清掉所有人的 OP
/op 你的游戏名     # 只给自己
/deop 其他玩家    # 挨个清

# 在 LuckPerms 里接管 OP（config.yml 里改）
# auto-op: false ← 这个必须是 false
# commands-allow-op: true ← 这代表允许非 LP 方式给 OP，建议 false 或不用
```

### 命令别名和隐藏命令

玩家用 Tab 键补全能看到所有可用命令，这是攻击者第一步要的情报：

```yaml
# paper-global.yml
console:
  # 启用后命令补全会跳过无权限的命令（给玩家看不到的命令）
  enable-permission-based-command-suggestions: true
```

### 玩家数据隔离

每个玩家的物品、位置、末影箱等数据在 `world/playerdata/` 里以 UUID 命名存盘。默认 Paper 是「玩家下线后立即保存」，这是对的。

别有这些坑：

- ❌ 让玩家A拖着自己的存档文件「复制」给玩家B（UUID 校验会失效）
- ❌ 把世界文件夹直接拷贝到另一台服务器（可能带 UUID 跨服冲突）

---

## 第二层：网络层安全

### RCON — 最容易被爆破的入口

RCON 是远程控制协议，**默认开启且端口暴露在公网 = 邀请别人来管服**。

```properties
# server.properties
# 如果你不需要 RCON（大多数情况不需要）：
enable-rcon=false

# 如果你必须用 RCON（如远程运维工具）：
# 1. 密码至少 16 位随机字符
# rcon.password=xK9#mP2$vL7qR4!wN
# 2. 防火墙限制来源 IP（只允许你家里的 IP）
# rcon.port=25575
```

### Query — 关掉没用的信息暴露

```properties
# server.properties
# 默认开启 query 时，任何人都能通过 Query 协议知道：
# - 你的 Minecraft 版本
# - 所有玩家的在线状态
# - MOTD 内容
# - 插件列表（部分核心版本）
enable-query=false
```

### 端口安全

| 端口 | 用途 | 建议 |
|------|------|------|
| 25565 | 游戏 | 放行 TCP |
| 25575 | RCON | 不放公网或限制 IP |
| 25577 | Query | 不放公网 |
| 25566+ | 额外服务器 | 各自独立管理 |

**云服务器安全组的正确做法：**

```
❌ 0.0.0.0/0 → 25565 TCP ← 全开放，任何人能扫
✅ 0.0.0.0/0 → 25565 TCP ← 游戏端口必须开放，但要配合后端配置
✅ 仅家庭 IP/特定段 → 25575 TCP ← RCON 限制来源
❌ 0.0.0.0/0 → 22/3389 TCP ← SSH 或远程桌面千万别对公网全开放
```

### 防暴力破解登录

如果你的服务器 `online-mode=false`（离线模式，俗称盗版服），任何人都可能用管理员的名字登录。**必须装登录插件：**

```
首选：AuthMeReloaded
- 命令注册密码，登录后才能动
- 失败次数限制（默认 3 次错就踢）
- 登录超时踢出（防止挂在上面占位置）

次选：LimboAuth（更轻量）
```

AuthMe 的基本配置：

```yaml
# plugins/AuthMe/config.yml
settings:
  sessions:
    enabled: true           # 同一 IP 短时间免登录
    timeout: 10             # 10 分钟
  restrictions:
    maxLoginPerIp: 3        # 同 IP 最多 3 账号，防注册机
    maxJoinPerIp: 2         # 同 IP 最多 2 人同时在线
    minNicknameLength: 3    # 用户名最短 3 字符
    kickNonRegistered: true # 没注册的玩家直接踢
```

### 防 DDoS（有限预算内）

小服主基本没法扛住真正的 DDoS，但能防住大部分脚本小子的「加农炮」攻击：

| 方案 | 免费 | 效果 |
|------|------|------|
| 换端口 | ✅ | 防住 90% 的随机扫描 |
| 启用防火墙速率限制 | ✅ | 防住短时间大量登录请求 |
| 代理（BungeeCord / Velocity） | ✅ | 代理可隐藏真实 IP |
| 商业 DDoS 防护（Cloudflare Tunnel / TCPShield） | 部分付费 | 真加的防护 |
| 换主机商（自带清洗） | 付费 | 大概率能防御 |

**最简单有效的：TCPShield**

安装 TCPShield 后，你的游戏端口不再直接暴露。玩家连 TCPShield 的域名 → TCPShield 过滤攻击流量 → 转发到你的真实 IP。免费计划对小型服完全够用。

**配置步骤：**
1. 去 tcpshield.com 注册，添加域名
2. 把域名 CNAME 指向他们提供的前缀
3. 给你的服务器安装 TCPShield 插件
4. 防火墙只放行 TCPShield 的 IP 段，真实端口不暴露

---

## 第三层：服务器端安全

### 核心漏洞处理

Paper/Spigot 偶尔会爆出严重漏洞（如任意代码执行、权限绕过）。**关注安全公告是每个服主的义务**：

| 信息源 | 频率 |
|--------|------|
| Paper Discord #announcements | 重大漏洞发布 |
| 核心官网 Security Advisories | 每季度汇总 |
| Minecraft Wiki CVE 页面 | 通用漏洞披露 |

**出问题时的响应流程：**
1. 在 Discord/论坛 搜索漏洞名
2. 核心作者通常会在 24-48 小时内发布修复版
3. 停服 → 备份 → 替换核心 → 验证 → 重启
4. 如果在修复前被利用了，检查可疑玩家、查 CoreProtect 日志

### 反作弊基础

反作弊插件永远是新版本的「猫鼠游戏」。选反作弊的思路：

- ❌ 不要装多个反作弊（冲突且卡）
- ❌ 不要相信「100% 反作弊」的宣传
- ✅ 开源反作弊优先（有社区持续更新）

| 开源反作弊 | 侧重 | 性能影响 |
|-----------|------|----------|
| Grim | 全方面（飞行、速度、战斗） | 中等 |
| Vulcan | 轻量、可配置性高 | 较低 |
| Matrix | 综合型 | 中等 |

**反作弊的正确配置建议：**

```yaml
# 以 Grim 为例 — 反作弊的 VL（违规等级）设置
# 初学者默认即可，高级服微调
alerts:
  # 多少人 VL 才发警报，避免刷屏
  min-vl-to-alert: 3
  
  # 哪些检测该开、哪些该关（根据玩家反馈调谐）
  # 飞行检测一般最准，杀戮aura误报偏高
```

**不要把反作弊当万能药**。配置不对会踢掉正常玩家（丢包、瞬移、水管 BUG）。设置 VL 上限前先观察真实玩家的 VL 分布，据此调参。

### 反崩溃攻击

新手常遇到的恶意玩家攻击：

| 攻击类型 | 原理 | 防御 |
|----------|------|------|
| 大量 TNT 爆炸 | 单次爆炸计算量堆叠 → 超时 | WorldGuard 标志 `tnt: deny` |
| 实体堆叠（falling block） | 几万实体同位置挤 | Paper 自动清理 + FarmLimiter |
| 牌子崩溃 | NBT 长度或特殊字符 | AntiCrashSigns 插件 |
| 书崩溃 | 超长内容 + 翻页逻辑 | 限制书最大页数 |
| 崩服数据包 | 异常数据包触发核心逻辑 | 核心层修复 + 防火墙快速模式 |

WorldGuard 防爆：

```bash
# 出生区等敏感区域禁用 TNT
/rg flag __global__ tnt deny

# 世界策略
/rg flag __global__ creeper-explosions deny  # 苦力怕不炸地形
/rg flag __global__ enderman-grief deny     # 末影人不能搬方块
```

---

## 第四层：审计与响应

### 记录一切的 CoreProtect

```yaml
# plugins/CoreProtect/config.yml
check-updates: false       # 关闭自检（新版移除）
api-enabled: true
mysql:
  use: true                # 大服必须用 SQLite → MySQL
  host: localhost
  port: 3306
  database: coreprotect
  username: root
  password: ''
```

```bash
# 查询破坏（回滚前的确认步骤）
/co lookup u:玩家名 t:1d a:block
# 输出谁、在什么时间、在哪个坐标、破坏/放置了什么方块

# 回滚（谨慎！先备份！）
/co rollback u:玩家名 t:1d r:global
```

**大服直接 MySQL，SQLite 在多人同时读写时会锁库卡服。**

### Plan 的会话数据

Plan 能告诉谁凶 — 玩家的在线记录、击杀/死亡数、区块移动轨迹：

```
/plan 玩家名
→ 查看概览
→ 查看会话
→ 查看 ping/性能贡献
```

### 出问题时的时间线检查

当服务器「突然挂掉」，按顺序查：

```
1. logs/latest.log：启动时间点和报错的完整堆栈
2. crash-reports/：有没有崩溃报告
3. 服务器资源监控（htop / 任务管理器）：CPU/内存是否打满
4. 异地网络测试：玩家集体断线还是只有你连不上？
  - 所有人连不上 → 你的主机/网络问题
  - 部分人连不上 → 可能是 DDoS 或地区网络问题
5. 安全日志：有没有管理员账号被盗
   /co lookup u:admin a:command
   - 确认管理员没有执行过可疑命令
```

---

---

## 第四层：插件安全审计

> **这是每个服主都该做但 90% 的人没做的事：检查插件本身是否安全。**

### 恶意插件的现实风险

```
真实案例（2023-2025）：
├── 某「优化插件」在后台偷偷执行 Shell 命令，把服务器算力用来挖门罗币
├── 某「背包插件」利用 Bukkit API 权限漏洞，让装了的玩家自动获得 OP
├── 某「国籍查询插件」每 30 秒把玩家 IP 和 UUID 发到第三方服务器
└── 破解核心（如「某论坛 Paper 破解版」）内置后门，任何拿到 jar 的人都能远程执行命令

收服方式：
├── GitHub 知名项目 → 开源可查源码 → 社区审查 → 相对安全
├── 论坛/网盘流传的「绿色版」 → 编译过程无可视 → 无法确认是否含后门 → 高风险
└── 论坛「破解付费版」 → 破解过程往往会关闭签名验证 → 植入后门极其容易
```

### 快速检查插件是否安全

```
审计步骤（5 分钟快速版）：

❶ 该插件在 GitHub 有官方仓库吗？
   ├── 有 → 去仓库看 Star 数、Issues、提交频率
   │   ├── Star > 500 + < 10 个 open issue + 近 1 个月有提交 → 安全
   │   └── Star < 50 + 长时间无更新 → 谨慎
   └── 没有 → 需要人工审计

❷ 检查 jar 文件的签名
   jarsigner -verify -verbose -certs plugins/MyPlugin.jar
   ├── 「jar is verified」 → 签名有效，来源可信
   └── 「jar is unsigned」 → 无法确认来源 → 谨慎

❸ 反编译插件（进阶，找出可疑行为）
   工具：JD-GUI (http://java-decompiler.github.io/) 或 Bytecode Viewer
   打开 .jar → 反编译 → 搜索 suspicious 函数名：
   ├── Runtime.getRuntime().exec()  → 可以执行系统命令（危险！）
   ├── ProcessBuilder → 同上
   ├── java.net.HttpURLConnection → 网络请求（可能在收集信息）
   ├── Bukkit.dispatchCommand → 执行命令（可能被用来给自己 OP）
   └── FileOutputStream → 写文件（可能感染服务器文件）
```

### 高危权限节点速查表

> 下面的权限节点如果给了非管理员玩家，相当于把服务器控制权交了出去：

```
───────────── 绝对不要给玩家开放的权限 ─────────────

# OP 接管类
*                           # 星号 = 所有权限，这是 OP 级别
minecraft.command.op        # 可以给任何人 OP（包括自己）
minecraft.command.deop      # 可以给任何人 deOP
bukkit.command.op           # 同上，旧版

# 关服/停服类
minecraft.command.stop      # 关服
minecraft.command.restart   # 重启
minecraft.command.save-off  # 关自动保存（数据会丢）
bukkit.command.reload       # reload 插件（可能导致内存泄漏）

# 命令执行类
bukkit.command.execute      # 执行任意控制台命令
minecraft.command.execute   # 1.13+ 的新命令系统，危险

# 文件操作类（某些插件提供的权限）
worldedit.*                 # 可以一键删除整个世界
essentials.deleted         # 可以删除玩家数据

───────────── 小心控制的权限 ──────────────────

# 尽量少给的（容易成瘾，授多了难收回）
essentials.gamemode         # 切创造模式
essentials.give             # 刷物品
essentials.enchant          # 附魔
```

---

## 进阶：加固 Checklist（四级版）

> 优先级从高到低，新手从 P0 开始。

```
┌────────────────────────────────────────────────────────────────────────┐
│  P0：基础生存级（不做这层 = 裸奔，早晚会被人搞死）                        │
├────────────────────────────────────────────────────────────────────────┤
│  ☐ online-mode 确认（推荐 true，盗版必须装 AuthMe）                      │
│  ☐ LuckPerms 默认组权限收紧（不给 `*` 权限）                             │
│  ☐ 清除不必要的 OP（只留你自己的账号）                                    │
│  ☐ RCON 关闭或限制来源 IP                                                │
│  ☐ 关闭 Query（减少信息暴露）                                            │
│  ☐ 安装 CoreProtect（至少能查凶手）                                      │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  P1：防护标准级（做到这层 = 抵挡 80% 的自动化攻击）                       │
├────────────────────────────────────────────────────────────────────────┤
│  ☐ WorldGuard 区域保护（出生点 + 主城）                                   │
│  ☐ 防火墙只开放必须端口（25565 + 你 SSH 的端口）                         │
│  ☐ 内网穿透通道绑定（如 frp token）                                      │
│  ☐ AuthMe（如果 offline-mode=true 则必装）                               │
│  ☐ 反作弊插件（Grim/Vulcan 任选一）                                      │
│  ☐ spark 性能分析（异常流量能快速定位）                                   │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  P2：合规运营级（长期公益服的标配）                                       │
├────────────────────────────────────────────────────────────────────────┤
│  ☐ BanManager 封禁记录                                                   │
│  ☐ 聊天过滤（ChatControl / ChatManager）                                 │
│  ☐ 法律合规：备案 + 内容审核 + 未成年保护                                  │
│  ☐ DDoS 防护（TCPShield / Cloudflare Tunnel）                            │
│  ☐ 加密的世界下载（防止客户端篡改）                                       │
│  ☐ 管理员行为审计（记录所有 lp/perm/op 命令）                             │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  P3：极致安全级（大型服 / 对外商业服）                                    │
├────────────────────────────────────────────────────────────────────────┤
│  ☐ 完全独立的「权限管理系统」（不依赖游戏内 LP，用 web 管理）              │
│  ☐ IP 白名单（仅允许部分 IP 连入）                                       │
│  ☐ 双因素认证登录（2FA for admins）                                      │
│  ☐ 日志留存 180 天+                                                      │
│  ☐ 定期安全审计（每个季度跑一遍 Checklist）                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 最终提醒

安全不是一次性设置，是**持续维护的习惯**。每加一个插件就想一遍「它现在拿的是最小权限吗」，每月花 30 分钟看一遍日志和备份 — 这些不起眼的动作，会让你的服务器比 90% 的裸奔同行更持久。

## 下一步

- 配置文件改坏了怎么办？→ [15 分钟极速开服](#/guide/quick-start) 有覆盖重来的方法
- 不知道怎么配权限分组？→ [插件组合方案](#/guide/plugin-combos) 有 LuckPerms 示例
- 服务器卡得不正常（不是配置，是有人在攻击）？→ [避坑与排错](#/guide/faq) 的网络故障章节