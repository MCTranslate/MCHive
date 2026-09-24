---
id: quick-start
title: 15 分钟极速开服
description: 真正从零开始 — 每一步都附详细注解、每条命令都附原理解释、每个坑都标注绕行方案。从空白电脑到朋友进服，随手可抄的命令行工具
icon: ⚡
tags: [开服, 入门, 极速]
order: 3
---

# 15 分钟极速开服

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（向下兼容 1.21.x 流程，文中差异处会标注）。
>
> 本教程承诺：**每条命令都有用，没有凑数的步骤**。每一步末尾都有一只「验证」框，做完立刻能确认这步是否成功。

目标：从一台空白电脑到玩家输 IP 进服。每一步都给了验证方法，做完一步确认一步，不要跳。

本教程以 **Linux（Ubuntu/Debian）+ Paper 26.x** 为例。Windows 用户流程完全一样（只命令格式不同），文中都会标注。

---

## 前置准备（1 分钟决策）

开始前先确认你具备以下三项条件之一：

| 条件 | 你能做什么 | 备注 |
|------|-----------|------|
| ✅ 一台云服务器（阿里云/腾讯云/AWS Lightsail 等） | 直接跳到第 1 步 | 推荐，最方便 |
| ✅ 家里电脑 + 公网 IP | 直接跳到第 1 步 | 需去路由器设置端口映射 |
| ✅ 家里电脑 + **无** 公网 IP | 需要内网穿透 → 跳到第 1 步 B 小节 | 推荐 SakuraFrp 或自建 frp |

**你需要的基础知识：**

- 会用终端 / 命令提示符（知道怎么打开一个黑色的命令行窗口）
- 会复制 / 粘贴文本
- 如果以上两点都不满足，先去搜索引擎搜「Linux 基础命令入门」学 10 分钟，再回来继续

---

## 第 1 步：装 Java（5 分钟）

> **为什么 Java 很重要？** Minecraft 服务端是用 Java 写的，Java 就是它的「运行环境」。Java 版本装错了 → 服务器要么跑不起来，要么跑起来奇慢无比。

### 判断你的 Paper 版本需要什么 Java

| Paper 版本 | 最低 Java | 推荐 Java | 原因 |
|-----------|----------|----------|------|
| 26.x | Java 25 | **Java 25 LTS** | Paper 26.x 官方魔改支持，GC 性能更好 |
| 1.21.x | Java 21 | Java 21 LTS | 最终稳定版 |
| 1.20.x | Java 17 | Java 21 LTS | 向下兼容 |

**一句话：装 Java 25 就对了。** Paper 26.x 向下兼容，1.21.x 也能跑。

### A. Ubuntu / Debian（最常见的服务器发行版）

```bash
# ❶ 先更新包管理器索引（获取最新软件列表）
#    类比：刷新手机 App Store 的应用列表
sudo apt update

# ❷ 安装 Java 25（Temurin 版，开源免费）
#    Temurin = Eclipse 基金会维护的 OpenJDK，官方推荐
#    -y = 自动确认 yes（不用手动输 Y）
sudo apt install -y openjdk-25-jre-headless
#    ├─ headless = 无 GUI 版（服务器不需要图形界面，省内存）
#    └─ 如果你要装带 JDK 的完整包，把 jre 改成 jdk

# ❸ 如果 apt 找不到 Java 25（老版本 Ubuntu），添加 PPA 源
#    这种情况在老镜像里常见，新建个用户目录级 Java 更省事：
#    先删除 ❷ 的命令，改用以下方案（不依赖 apt）：
mkdir -p /opt/java && cd /opt/java
#    下载 Temurin 25 binary（根据你的 CPU 架构选择）
#    大多数云服务器是 x64：
wget https://github.com/adoptium/temurin25-binaries/releases/download/jdk-25.0.0%2B11/OpenJDK25U-jre_x64_linux_hotspot_25.0.0_11.tar.gz
#    解压
tar -xzf OpenJDK25U-jre_x64_linux_hotspot_25.0.0_11.tar.gz
#    设置环境变量
echo 'export JAVA_HOME=/opt/java/jdk-25.0.0+11-jre' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### B. CentOS / RHEL / Fedora（企业发行版）

```bash
# CentOS 8+ / Fedora
# 用 dnf（CentOS 7 用 yum）
sudo dnf install -y java-25-openjdk java-25-openjdk-devel

# 如果找不到包（CentOS 仓库同步慢），改用上面 ❸ 的 PPA/手动方案
```

### C. Windows 用户（5 分钟流程）

```
❶ 打开浏览器访问 https://adoptium.net/

❷ 页面上操作：
   Version: 选 25（或最新的 LTS）
   Operating System: Windows
   Architecture: x64（绝大多数电脑都是这个）
   Package Type: JDK 或 JRE 都行（新手装 JDK 更省事）
   Download: 点 .msi 文件下载

❸ 打开下载的 .msi 文件 → 一路点 Next（默认设置即可）

❹ 验证装没装对：
   按 Win+R → 输入 cmd → 回车 → 输入：
```

```cmd
java -version
```

```
❺ 如果提示「java 不是内部或外部命令」：
   说明 PATH 没配好。搜索「Windows 设置 JAVA_HOME」，按教程配一下。
   具体步骤：
   右键「此电脑」→ 属性 → 高级系统设置 → 环境变量 → 
   新建 变量名=JAVA_HOME 变量值=C:\Program Files\Eclipse Adoptium\jdk-25.x.x
   编辑 Path → 新增 → 填 %JAVA_HOME%\bin
```

### ✅ 第 1 步验证

```bash
java -version
```

预期输出（类似以下任意格式）：

```
# Temurin 风格
openjdk version "25.0.0" 2026-03-17
OpenJDK Runtime Environment Temurin-25.0.0+11
OpenJDK 64-Bit Server VM Temurin-25.0.0+11

# 官方 Oracle 风格
java version "25.0.0" 2026-03-17
Java(TM) SE Runtime Environment (build 25.0.0+11)
Java HotSpot(TM) 64-Bit Server VM (mixed mode)
```

**关键看第一行**：`version "25"` 或 `version "21"` 即成功。如果是 `version "1.8"` 或 `version "11"` 说明你装的是老版本，需要卸载重装。

### ❓ 常见问题

**Q：系统里装了多个 Java 怎么选？**

Ubuntu / Debian 用：
```bash
sudo update-alternatives --config java
# 在新窗口里输入对应的数字编号，选 Java 25 那项
```

Windows 用：确认 `JAVA_HOME` 路径指向你想要的 Java 25 的目录。

**Q：装 Java 和装 JRE 和装 JDK 有区别？**

| 缩写 | 全称 | 解释 | 服主要装哪个？ |
|------|------|------|---------------|
| JRE | Java Runtime Environment | 只能**运行** Java 程序 | ✅ 够用，体积小 |
| JDK | Java Development Kit | 开发 + 运行（含 javac 编译器等） | ✅ 推荐装，多 30MB 但调试更方便 |
| JVM | Java Virtual Machine | Java 虚拟机（JRE 的一部分） | 你不用装这个 |

---

## 第 2 步：建目录 + 下载核心（2 分钟）

> 别把服务端扔桌面——桌面路径带中文（`C:\Users\张三\Desktop`）会让 Java 出诡异的编码错误。

### A. Linux 操作

```bash
# ❶ 创建专用目录
#    ~/ = 你的用户目录（/home/用户名/）
#    mcserver = 文件夹名，可以改成你喜欢的名字（但不能有中文）
mkdir -p ~/mcserver && cd ~/mcserver

# ❷ 创建启动脚本（先建好，后面往里填内容）
touch start.sh && chmod +x start.sh

# ❸ 下载 Paper 26.x
#    先去 https://papermc.io/downloads 看最新版本号
#    假设最新版是 26.3，构建号是 177：
wget -O server.jar https://api.papermc.io/v2/projects/paper/versions/26.3/builds/177/downloads/paper-26.3-177.jar
#    ├─ -O server.jar = 把下载的文件重命名成 server.jar（方便后面引用）
#    └─ 如果下载失败或出现 JSON 页，说明版本号错了，去官网再确认

# 备选方案：如果你不知道构建号，直接用链接去官网复制下载链接
# 打开 https://papermc.io/downloads → 选版本 → 点 Download → 复制下载链接 → 把链接贴到 wget 里
```

### B. Windows 操作

```
❶ 在 D 盘或 E 盘新建文件夹，名字不要有中文和空格
   例：D:\MCServer（好）  D:\我的服 或 D:\My Server（不好）

❷ 去 Paper 官网下载最新版 .jar 文件
   把文件复制到 D:\MCServer\ 里

❸ 重命名成 server.jar（如果你的浏览器没自动改名）

❹ 在 D:\MCServer\ 里新建文本文件，命名为 start.bat（不是 start.txt！）
   右键 → 新建 → 文本文档 → 改后缀（需先开启文件扩展名显示）
   开启方法：文件资源管理器 → 查看 → 显示 → 文件扩展名
```

### ✅ 第 2 步验证

```bash
# Linux：确认 server.jar 存在
ls -lh ~/mcserver/server.jar
# 输出类似：-rw-r--r-- 1 user user 45M Sep 24 15:30 server.jar
# 45MB 左右是 Paper 核心正常大小（太小说明下载失败，只有几百 KB 就是下载了错误页面）
```

```
Windows：打开 D:\MCServer\ 目录，确认能看到 server.jar（文件图标是 Java 的咖啡杯）
```

### ❓ 常见问题

**Q：下载失败了，wget 输出一堆 HTML？**

说明链接错了。正确链接格式是：
```
https://api.papermc.io/v2/projects/paper/versions/<VERSION>/builds/<BUILD>/downloads/paper-<VERSION>-<BUILD>.jar
```
请去 https://papermc.io/downloads 看最新的版本号和构建编号。

---

## 第 3 步：首次启动 + 同意 EULA（2 分钟）

### A. Linux 操作

```bash
# ❶ 首次启动（让它生成配置文件）
cd ~/mcserver
java -Xms4G -Xmx4G -jar server.jar --nogui
#    参数解释（详细版见[性能调优](#/guide/performance-tuning)第 1 层）：
#    └─ -Xms4G  初始堆内存 4GB
#    └─ -Xmx4G  最大堆内存 4GB
#    └─ --nogui 不打开 Paper 自带的 GUI 控制台（省内存）

# ❷ 启动 5 秒后会自动退出，这是正常的！
#    目录下会多了几个文件，最关键是 eula.txt

# ❸ 编辑 eula.txt
nano eula.txt
#    nano 是 Linux 最简单的文本编辑器
#    操作：用方向键移动光标 → 把 false 改成 true → Ctrl+O 回车保存 → Ctrl+X 退出
#    改完应该是：
eula=true

# 不用 nano 的话，用 sed 一行搞定：
sed -i 's/eula=false/eula=true/' eula.txt
```

### B. Windows 操作

打开第 2 步创建的 `start.bat`，写入以下内容：

```bat
@echo off
REM ❶ @echo off = 关闭命令本身的回显（不让控制台显示每一行执行的命令）
REM ❷ "Java 路径" java.exe 启动文件
REM    如果你的 Java 装在默认位置，直接写 java 就行
REM    如果装了多个 Java，要写完整路径（见下方）

java -Xms4G -Xmx4G -jar server.jar --nogui

REM pause = 脚本执行完毕后暂停窗口（让你能看到输出）
pause
```

保存 `start.bat`，双击运行：

```
❶ 弹出一个黑框，显示一堆日志滚动
❷ 几秒后黑框消失或显示「按任意键继续」——这是正常的！
❸ 在 D:\MCServer\ 里多了个 eula.txt

❹ 打开 eula.txt → 把 eula=false 改成 eula=true → 保存

❺ 再双击 start.bat 启动一次
```

### ✅ 第 3 步验证

启动后观察控制台，最终出现：

```
[Server thread/INFO]: Done (12.345s)! For help, type "help"
```

这句话的意思是：服务器启动成功，耗时 12.345 秒。如果你看到这行，恭喜——服务端跑起来了！

如果没有这句话，反而看到类似：

```
Failed to load eula.txt
```
→ 说明 EULA 没改对，检查 `eula.txt` 里是不是 `eula=true`

```
Failed to bind to port
```→ 说明 25565 端口被占用（MC 客户端开着？之前的服没彻底关掉？）

```
java.lang.UnsupportedClassVersionError
```
→ 说明 Java 版本太低（见 [FAQ](#/guide/faq) 报错章节）

### ❓ 为什么必须关 gui？

`--nogui` 参数让服务器不启动自带的 GUI 控制台窗口。原因：

```
❌ 不传 --nogui：服务器启动 GUI 窗口 + 控制台输出。GUI 占用 50-100MB 内存，服务器在后台跑 GUI 是浪费资源。
✅ 传 --nogui：只有日志输出，纯命令行模式。Linux 服务器没有屏幕，GUI 反而会报错。
```

---

## 第 4 步：改 server.properties（3 分钟）

> server.properties 是服务器的「基本属性」配置文件。第一次启动后自动生成，改了以后需要重启生效（或以 `/reload confirm` 部分热更新）。

### 完整 server.properties 逐项解释

```properties
# ════════════════════════════════════════════
#  Minecraft server.properties
#  本页只列新手需要改的项（共 9 项）
#  其他项默认就行，改反而不容易出错
# ════════════════════════════════════════════

# ❶ 服务器标语（MOTD）— 玩家在服务器列表看到的描述文字
#    支持颜色代码（§ 或 & 前缀），最多两行
#    默认值：A Minecraft Server
#    推荐值：你想写任何不超过 59 字符的标语
motd=&a欢迎 &b来到 &6\ &d我的新服务器

# ❷ 服务器端口 — 玩家连接用的网络端口
#    默认值 25565 几乎不改
#    除非你有特殊原因（如一台机器开多个服）才改为 25566 / 25567 等
server-port=25565

# ❸ 最大玩家数 — 服务器同时在线人数上限
#    这不是「注册人数」，而是「同时在线人数」
#    设太高浪费内存（每人连接占用约 50MB 堆内存）
#    推荐：实际玩家数 + 5（留缓冲）
max-players=20

# ❹ online-mode — 正版验证开关
#    true = 只允许正版账号登录（通过 Mojang 服务器验证）
#    false = 允许离线账号（盗版服）
#    新手推荐：true
#    如果你需要开盗版服 → 必须装 AuthMe 插件 + 配合白名单
online-mode=true

# ❺ view-distance — 视距（每个玩家看到多远的区块）
#    设置为 N → 玩家周围 N×N 区块被加载并同步
#    这是性能杀手！每个 +1 意味着约 15% 的额外 CPU/内存开销
#    默认值：10（对新手来说太高了）
#    推荐值：6（10 人服）或 8（20 人服）或 10（高性能机 + 30 人+）
view-distance=8

# ❻ simulation-distance — 模拟距离（多远的实体/TNT 被完全模拟）
#    低于 view-distance，因为「看得到」≠「需要完整模拟」
#    推荐值：4（小服）或 6（大服）
simulation-distance=6

# ❼ spawn-protection — 出生点保护半径（方块）
#    非 OP 玩家无法在这个半径内破坏/放置方块
#    默认值：16
#    推荐值：16（中规中矩）或 0（如果你装了 WorldGuard 就别用了）
spawn-protection=16

# ❽ pvp — 玩家间伤害开关
#    true = 玩家可以互相攻击
#    false = 玩家无法互相伤害（适合和平服 / 创造服）
pvp=true

# ❾ difficulty — 游戏难度
#    peaceful / easy / normal / hard
#    peaceful = 没有敌对怪物（适合建筑服）
#    hard = 怪物伤害最高、饥饿掉血（挑战服）
difficulty=normal
```

### ✅ 第 4 步验证

改完保存文件，然后：

- **控制台直接输命令热更新**：
  ```
  reload confirm
  ```
  输出 `[Server thread/INFO]: Reloading server` 说明热更新成功。

- 或者**重启**更彻底（新手推荐重启）：
  ```
  stop
  ```
  等 5 秒后重新执行第 3 步的启动命令。

### ❓ 常见问题

**Q：改了 server.properties 但没生效？**

常见问题：

1. 文件编码不是 UTF-8（Windows 记事本默认 ANSI，中文会乱码）→ 用 VS Code / Notepad++ 保存为 UTF-8
2. 文件里有中文标点（句号、逗号）→ 改成英文标点
3. 参数名拼写错了（如 `maxplayer` 少了 `s`）→ 仔细对照检查

---

## 第 5 步：让朋友进来（3 分钟）

这是最容易出问题的环节，三选一：

### A. 你有公网 IP（云服务器 / 家宽有公网）

```bash
# ❶ 在服务器上查你的内网 IP（Linux）
hostname -I
# 输出类似：172.17.0.2   这个不是给你的朋友的！

# ❷ 查你的公网 IP
curl ifconfig.me
# 输出类似：123.45.67.89 ← 把这个给朋友！

# ❸ 云服务器需要做两件事：
#    第一件：在云控制台 / 安全组里开放 TCP 25565
#            （阿里云叫「安全组规则」，腾讯云叫「安全组」，AWS 叫「Inbound Rules」）
#    第二件：如果服务器本身有 iptables/ufw，也要放行：
sudo ufw allow 25565/tcp
#     └─ 或者关闭 ufw（小服可以，大服不建议）
#     └─ sudo ufw disable
```

```
朋友在 Minecraft 客户端 → 多人游戏 → 添加服务器 →
服务器地址栏填：123.45.67.89:25565
```

### B. 家里没有公网 IP（大部分国内家庭）

你需要「内网穿透」把外部请求转发到你的家用电脑。

**推荐方案对比：**

| 方案 | 免费额度 | 速度 | 适合什么人 |
|------|---------|------|-----------|
| SakuraFrp | 每月 1GB 流量（可签到扩容） | ⭐⭐⭐⭐ | 国内玩家，懒得买服务器 |
| OpenFrp | 永久不限流量 | ⭐⭐⭐⭐ | 国内玩家，流量需求大 |
| frp 自建 | 自用服务器费用 | ⭐⭐⭐⭐⭐ | 有独立服务器的进阶用户 |
| Cloudflare Tunnel | 免费（小流量） | ⭐⭐⭐ 走 Cloudflare 网络 | 企业/技术用户 |

**SakuraFrp 使用流程（最常见新手方案）：**

```
❶ 去 https://www.natfrp.com/ 注册账号
❷ 下载他们的客户端（SakuraFrp 客户端）
❸ 登录客户端 → 创建隧道 → 选节点（国内推荐「上海」「杭州」）
❹ 选「Minecraft」类型 → 端口填 localhost:25565
❸ 启动隧道 → 客户端会给你一个域名：xxx.natfrp.cloud:YYYYY
❹ 把这个域名 + 端口发给朋友 → 朋友连上就能进服
```

### C. 只和局域网里的朋友联机

适用范围：同一个 WiFi / 同一个办公室

```
❶ 在服务器电脑上查内网 IP
   Linux：hostname -I
   Windows：ipconfig → 看 IPv4 地址（一般是 192.168.x.x）

❷ 把这个 IP + 端口发给朋友
   朋友直填：192.168.x.x:25565
```

### ✅ 第 5 步验证

```
❶ 服务器这边：看控制台有没有 "玩家名 joined the game" 的日志
❷ 朋友视角：点「加入服务器」→ 不是「正在连接...」转圈就进不去，而是能看到加载进度条 + 最终进服
```

| 错误现象 | 原因 | 解决 |
|----------|------|------|
| `Connection refused: no further information` | 服务器没开 / 端口没转发 | 检查启动状态 + 安全组 |
| `Connection timed out` | 防火墙挡住 / 内网穿透没跑 | 检查 ufw/iptables + frp 隧道状态 |
| `io.netty.channel.AbstractChannel...` | 版本不一致 | 看 [FAQ](#/guide/faq) 版本对照 |

---

## 第 6 步：装第一批插件（5 分钟）

现在你的服务器是一个「裸奔」状态——没有基础命令、没有权限管理，OP 手动管理一切。按以下顺序安装基础**必装**插件：

### 插件安装顺序为什么重要？

```
❌ 先装保护插件 → 装完发现没有 Vault → 保护插件无法读取权限和金钱，报错

✅ 先装 LuckPerms + Vault → 它们提供 API → 其他插件才能「读到」权限和经济数据
```

### 按这个顺序装（含版本选择指引）

#### ❶ EssentialsX（生存服半条命）

```
什么是它？
  家、传送、经济基础、更多基础命令（/warp、/tpa、/hat 等）
  它是「没有其他插件也能完整生存」的兜底。

去哪下？
  https://essentialsx.net/downloads.html
  或搜索「EssentialsX SpigotMC」最新版

装好后：
  首次启动会自动生成 plugins/EssentialsX/ 目录
  里面有很多配置文件（config.yml、worth.yml 等）
  新手阶段用默认值就行。

汉化见：[本站 EssentialsX 教程](/plugin/essentialsx)
```

#### ❷ LuckPerms（权限分组）

```
什么是它？
  决定谁能用什么命令、不能用、属于哪个组（default / VIP / admin）

去哪下？
  https://luckperms.net/downloads
  注意下载对应核心的版本：
  Paper / Spigot → 下载「Bukkit」版
  Folia → 下载「Folia」版（2026 年后 LuckPerms 分开发布了）

装好后：
  启动服务器 → 马上提升权限生效
  去控制台输入：
  lp creategroup admin
  lp group admin permission set * true
  lp user 你的游戏名 parent add admin

汉化：LuckPerms 自带简体中文！运行命令：
  lp editor
  （会生成一个网页编辑器链接，中文界面）
```

#### ❸ Vault（桥接 API）

```
什么是它？
  不是功能插件，而是「桥梁插件」。
  让经济插件（EssentialsX Economy）能和权限插件（LuckPerms）互通。

  比喻：Vault 就像编程里的「接口(interface)」—— 不实现任何功能，但让其他插件通过它互相交谈。

去哪下？
  https://www.spigotmc.org/resources/vault.34315/

装好后：
  无配置，纯粹是 API 提供层。
  装了它之后装的经济插件才能读取权限信息（让你知道哪个玩家是 VIP）。
```

#### ❹ WorldGuard + WorldEdit（区域保护 + 建造）

```
WorldEdit 是前置，先装它。

WorldEdit：
  选区 → 复制/粘贴建筑 → 批量替换方块。
  建筑师必备工具。
  https://enginehub.org/worldedit#downloads

WorldGuard：
  WorldEdit 的扩展 + 区域保护系统。
  帮你圈定「谁能在这个区域里建/拆方块」。
  https://enginehub.org/worldguard#downloads

装好后：
  WorldGuard 最常用命令：
  /rg define 区域名    → 把选了区的区域定义为「区域名」
  /rg flag 区域名 build deny  → 禁止非成员建造
  /rg addmember 区域名 玩家名 → 给某玩家建造权限
```

### 安装方法（通用）

通用步骤，都这样装：

```bash
# ❶ 下载对应插件的 .jar 文件（必须选对你的核心版本的！）
# ❷ 用 scp / 文件管理器 把 .jar 复制到 plugins/ 目录
# ❸ 控制台输入：restart  或  stop 后重新启动
```

```
Windows 版同样的流程，直接用文件管理器拖就行。
```

### ✅ 第 6 步验证

启动后：

```
控制台看输出：
  [Server] [Essentials] Loading Essentials 2.x.x
  [Server] [LuckPerms] Loading LuckPerms v5.x.x
  [Server] [Vault] Loading Vault x.x.x
  [Server] [WorldGuard] Loading WorldGuard 7.x.x
  
游戏内命令：
  
  ❶ /plugins    → 列表里所有插件名字是绿色（不是红色！），说明加载成功
  
  ❷ /lp user <你的游戏名> info  → 看到你的权限信息
  
  ❸ /gamemode creative  → 如果能切创造模式 → WorldEdit 工作正常
```

```
红色名字 = 插件加载失败 → 看控制台红色报错行，去 [FAQ](#/guide/faq) 搜关键词
黄色警告 = 小事，可以忽略（通常是配置警告）
```

---

## 总结：你现在有什么

从零开始，经过 6 步你现在拥有了一个：

```
✅ Minecraft 26.x 服务器，内网 + 外网都能连
✅ 4 个基础插件：EssentialsX（基础命令） + LuckPerms（权限）+ Vault（桥接）+ WorldGuard（保护）
✅ 完整的 server.properties 配置 + 正版验证
✅ Java 25 运行时环境
```

这已经是一个**跑得起来的 Minecraft 服务器**了！接下来就是——

## 根据你的阶段，下一步去哪里

| 你已经… | 下一步 | 去哪里 |
|---------|--------|--------|
| 刚看完本教程，还没动手 | 跟着做一遍就完了 | 从头再来一遍加深印象 |
| 做了但有步骤失败了 | 定位报错 → 搜 FAQ | [避坑与排错](#/guide/faq) |
| 做完了，想加更多玩法 | 按类型抄清单 | [插件组合方案](#/guide/plugin-combos) |
| 做完了，感觉卡 | 调优 JVM 参数 + 核心配置 | [性能调优从入门到精通](#/guide/performance-tuning) |
| 做完了，担心安全 | 加反作弊 + 备份 + 防熊 | [安全加固：从裸奔到站穩](#/guide/security-hardening) |
| 做完了，想学日常运维 | 备份 + 监控 + 日志 | [服务器日常运维手册](#/guide/server-maintenance) |

**最重要的是：先让服务器跑起来，再慢慢打磨。很多新手教程受害者就是倒在了「还没跑通就想完美」这一步。**

---

## 附录：15 分钟速查表

如果已经理解了整个流程，这张表能陪你重开下一台服务器时 15 分钟搞定：

```
┌──────────────────────────────────────────────────────────┐
│  时间轴      操作                                           │
├──────────────────────────────────────────────────────────┤
│  0:00 │ sudo apt install -y openjdk-25-jre-headless       │
│  1:00 │ java -version  ← 确认输出版本号                    │
│  2:00 │ mkdir ~/mcserver && cd ~/mcserver                  │
│  3:00 │ wget -O server.jar <paper下载链接>                  │
│  4:00 │ java -Xms4G -Xmx4G -jar server.jar --nogui       │
│  5:00 │ sed -i 's/false/true/' eula.txt（改 eula=false） │
│  6:00 │ 再次执行 java ... 启动命令                          │
│  7:00 │ 看到 "Done (xx.xxxs)!"                             │
│  8:00 │ nano server.properties  ← 改 motd/view-distance  │
│  10:00│ 确定 IP/IP 穿透就绪                                 │
│  11:00│ 朋友连入 → 验证通过                                 │
│  12:00│ 依次装 EssentialsX / LuckPerms / Vault / WG+WE   │
│  14:00│ /plugins  ← 全部绿色                              │
│  15:00│ 完成 🎉                                           │
└──────────────────────────────────────────────────────────┘
```