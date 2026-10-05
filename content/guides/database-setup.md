---
id: database-setup
title: 数据库部署与插件接入：从 SQLite/H2 到 MySQL/MariaDB
description: 单服用插件的内嵌库就够，什么时候才值得上 MySQL/MariaDB？附版本核实、可直接复制的落地流程、CoreProtect / LuckPerms / EssentialsX 三个插件的真实接入差异，以及备份与常见坑。
icon: 🗄️
tags: [数据库, MySQL, MariaDB, 备份, 安全]
order: 14
---

# 数据库部署与插件接入

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.x）。文中版本号、配置键、命令均已下载官方产物或查阅官方文档核实，出处随文标注。

绝大多数「开服教程」一上来就让你装 MySQL，却没人先回答最关键的问题：**你到底需不需要它？**

答案是——**大多数服并不需要**。本站推荐的三个核心插件里，CoreProtect 自带内嵌 SQLite、LuckPerms 自带内嵌 H2、EssentialsX 干脆只写文件。单台服务器、几十个玩家，这套默认组合跑一整年都不会有数据库问题。

数据库真正的价值出现在三个场景：**多台子服要共享同一份数据**、**数据量涨到内嵌库查询开始拖累主线程**、**你需要用专业工具做异地备份与面板查看**。本文就按这个顺序讲：先判断要不要，再讲选哪个、怎么装、怎么接进插件、怎么备份、以及最常踩的坑。

## 一、先判断：你到底需不需要数据库

### 三个插件的默认存储

| 插件 | 默认存储 | 数据落在哪个文件 | 需要数据库吗 |
|------|----------|------------------|--------------|
| [CoreProtect](#/plugin/coreprotect) 24.1 | 内嵌 SQLite | `plugins/CoreProtect/database.db` | 中小服**不需要** |
| [LuckPerms](#/plugin/luckperms) 5.5.85 | 内嵌 H2 | `plugins/LuckPerms/luckperms-h2.mv.db` | 单服**不需要** |
| [EssentialsX](#/plugin/essentialsx) 2.22.0 | 纯文件 | `plugins/Essentials/userdata/<uuid>.yml` | **无法使用**数据库 |

> **这三个结论都经过官方可执行文件核实**：
>
> - CoreProtect 24.1 的 `config.yml` 默认 `use-mysql: false`，数据库文件固定叫 `database.db`（jar 内可见 `database.db` 与 `jdbc:sqlite:` 字符串）。
> - LuckPerms 5.5.85 的官方默认配置里 `storage-method: h2`，H2 数据文件名 `luckperms-h2.mv.db`。
> - EssentialsX 2.22.0 的 jar **完全不含** `jdbc` / `mysql` / `mariadb` / `database` 任何字符串；玩家数据由 `UserData` 类写入 `userdata/` 目录下的 `.yml` 文件（余额、家、邮件、昵称等字段都在 `UserConfigHolder` 里）。

### 什么时候「该」上数据库

满足下面任意一条，才值得动手；一条都不满足，请直接关掉本页去装插件。

| 信号 | 为什么内嵌库扛不住 |
|------|--------------------|
| **多台子服要共享同一位玩家的权限/经济** | H2、SQLite 都是**本地单文件库**，每个子服各存一份、互不相通；跨服同步物理上做不到 |
| **多台子服要共用一份方块记录** | CoreProtect 的 `database-lock` 默认开启，会**阻止两个服务端同时写同一个库**；共库必须换 MySQL 并关掉它 |
| **日志数据涨到单个文件好几个 GB** | 内嵌库的查询/清理会占用大量磁盘 I/O，而 I/O 会拖慢主线程 |
| **需要独立的数据库备份与面板工具** | SQLite/H2 是二进制单文件，只能整文件复制；MySQL/MariaDB 能用 `mariadb-dump` 做逻辑备份、用面板可视化查表 |
| **你已经有独立的数据库服务器/云数据库** | 现成的资源不用白不用，还能把 I/O 与游戏进程分离 |

> **反面提示**：如果你只是「听说大服都用 MySQL」，那不算理由。给 10 人服硬上一套 MySQL，带来的维护成本（安全、备份、时区、字符集）往往大于收益。**先跑起来，遇到上表里的信号再迁移**——而且下面会讲，迁移本身是有代价的。

## 二、选 MySQL 还是 MariaDB，用哪个版本

### 仍在维护的稳定版本（2026-09 核实）

**MariaDB**（出处：`mariadb.com/docs/release-notes/community-server`）：

| 系列 | 最新版本 | 状态 | 说明 |
|------|----------|------|------|
| **12.3** | 12.3.3（2026-08） | **LTS** | 官方文档称「最新长期稳定系列」，维护 3 年 |
| 11.8 | 11.8.9（2026-08） | LTS | 上一代长期支持线 |
| 11.4 | 11.4.13（2026-08） | LTS | |
| 10.11 | 10.11.19（2026-08） | LTS | 维护至 2028-02 |
| 10.6 | 10.6.28（2026-08） | LTS | 更老的长期支持线 |
| 13.0 | 13.0.2（2026-09） | Rolling（滚动） | **不是 LTS**，仅供尝鲜 |

**MySQL**（出处：`dev.mysql.com/doc/refman/9.7/en/mysql-releases.html` 及 Oracle 2026-07 发布公告）：

| 系列 | 最新版本 | 状态 | 说明 |
|------|----------|------|------|
| **9.7** | 9.7.2（2026-07） | **LTS** | 最后一个「顺序版本号」系列 |
| **8.4** | 8.4.11（2026-07） | **LTS** | 支持至 2032-04 |
| 26.7 | 26.7.0（2026-07） | Innovation | 此后改用日历版本号 `YY.M`（26.7 = 2026 年 7 月） |
| 8.0 | — | **已 EOL** | 2026-04 结束支持，**新装不要再选** |

> MySQL 从 2026 年起把版本号改成了 `年.月`（和本文目标环境 Paper 26.x 是同一种命名思路）。所以看到「MySQL 26.7」不要以为是笔误——它是 2026 年 7 月的 Innovation 版本。**LTS 选 9.7 或 8.4 即可，别用 Innovation 轨道**（它每个季度就被下一个版本取代）。

### 本项目推荐：**MariaDB LTS**（11.8 或 12.3 线）

理由三条，都可核对：

1. **插件生态的偏好是显式的**。LuckPerms 官方默认 `config.yml` 里，存储类型的注释原文写着 `MariaDB (preferred over MySQL)`——它自己就推荐 MariaDB。
2. **发行版默认**。Debian / Ubuntu 等主流 Linux 的软件源里，`mariadb-server` 就是标准的「MySQL 兼容数据库」包，一条 `apt install` 就能装到受维护的 LTS 版本，不用额外加第三方仓库。
3. **许可证与延续性**。MariaDB 由 MySQL 原班人马维护，GPLv2、承诺永久开源；对插件而言它与 MySQL 协议兼容，本站三个插件（以及绝大多数 Minecraft 生态插件）连它都没有区别。

> 如果你整套运维栈已经统一在 MySQL（监控、备份脚本、云数据库都是 MySQL），那就继续用 MySQL **9.7 LTS** 或 **8.4 LTS**，没必要为了「推荐」而折腾迁移。本文命令以 MariaDB 为主，MySQL 差异会单独标出。

## 三、一次完整的落地流程

下面是在 Linux 上从零到「插件能连上」的完整流程，命令可直接复制。Windows 的差异集中在最后说明。

### 第 1 步：安装

**Debian / Ubuntu（MariaDB）：**

```bash
sudo apt update
sudo apt install -y mariadb-server
sudo systemctl enable --now mariadb
```

**RHEL / Rocky / AlmaLinux（MariaDB）：**

```bash
sudo dnf install -y mariadb-server
sudo systemctl enable --now mariadb
```

**MySQL：** 官方提供 APT / YUM 仓库与压缩包，按 <https://dev.mysql.com/downloads/repo/> 的向导添加仓库后，再 `sudo apt install -y mysql-server`（或 `dnf`）。MySQL 的命令行工具与 MariaDB 基本同名（`mysql_secure_installation`、`mysql`、`mysqldump` 都是 MySQL 的原生名字）。

### 第 2 步：确认服务已启动

```bash
systemctl status mariadb
```

看到 `active (running)` 即可。**没起来时先看 `journalctl -u mariadb -n 50`**，八成是数据目录权限或端口被占用。

### 第 3 步：基础加固

```bash
sudo mariadb-secure-installation
# MySQL 用户：sudo mysql_secure_installation
```

> **名字来源**：MariaDB 从 10.4 起提供 `mariadb-secure-installation`，从 10.5 起把 MariaDB 命名作为主名、`mysql_*` 作为兼容软链接。两者功能完全一样，用哪个都行。同样地，`mariadb-dump` 与 `mysqldump` 等价。

脚本会依次问你几件事，**新手按下面选**：

| 提问 | 建议 | 原因 |
|------|------|------|
| 设置 root 密码 | 需要就设 | MariaDB 10.4+ 默认用 Unix socket 认证，`sudo mariadb` 即可登录，可跳过 |
| 移除匿名用户 | **Y** | 匿名账号允许任何人无账号登录 |
| 禁止 root 远程登录 | **Y** | root 只允许本机登录 |
| 删除 test 数据库 | **Y** | 测试库默认可被匿名访问 |

### 第 4 步：建专用库 + 专用账号（**不要用 root 给插件连**）

先用管理员身份登录：

```bash
sudo mariadb
# 如果你的 root 设了密码：sudo mariadb -u root -p
```

然后执行下面四条（把库名、用户名、密码换成你自己的）：

```sql
CREATE DATABASE mchive DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mc'@'127.0.0.1' IDENTIFIED BY '换成你自己的强密码';
GRANT ALL PRIVILEGES ON mchive.* TO 'mc'@'127.0.0.1';
FLUSH PRIVILEGES;
```

> **为什么不用 root**：
>
> - root 能操作**所有**库，插件一旦被利用就等于交出整台数据库。
> - `GRANT ... ON mchive.*` 只把**这一个库**的权限给 `mc`，出问题时影响面被限制在插件自己的数据里。
> - 「最小授权」不等于只给 SELECT/INSERT——插件启动时要自己建表，所以需要该库的建表权限。`ON mchive.*` 这种「单库全权」就是这里的合理最小集。

> **多台子服都要连怎么办？** 把 `'mc'@'127.0.0.1'` 换成允许的内网网段，例如 `'mc'@'10.0.0.%'`。**绝不要**图省事写成 `'mc'@'%'`——那等于允许全世界连你的库。

### 第 5 步：验证连接

用**插件将要使用的那个账号**去连，而不是 root：

```bash
mariadb -u mc -p -h 127.0.0.1 -P 3306 mchive -e "SELECT 1;"
# MySQL 用户：mysql -u mc -p -h 127.0.0.1 -P 3306 mchive -e "SELECT 1;"
```

输出一行 `1` 就算通了。这一步能提前暴露 90% 的问题（密码错、账号 host 不匹配、端口没开），比在插件里盲试高效得多。

### 第 6 步：填进插件配置并重启核对

按第四节的写法改好插件配置，**重启服务器**（数据库连接在启动时建立，`reload` 不一定会重连）。然后看两处：

- 控制台有没有连接失败报错；
- 用第 5 步同款命令查表：`SHOW TABLES;` 能看到插件自建的表（如 `co_block`、`luckperms_users`），说明写入正常。

## 四、填进插件配置：三个插件的接入差异

### CoreProtect（24.1）：可选 MySQL，切换**不会自动搬运**数据

**是否用数据库**：默认不用。`plugins/CoreProtect/config.yml` 里 `use-mysql` 默认为 `false`，用的是内嵌 SQLite。

**怎么接**：改下面这几项并重启：

```yaml
use-mysql: true
table-prefix: co_          # 多个服共库时，务必各服设成不同的前缀
mysql-host: 127.0.0.1
mysql-port: 3306
mysql-database: mchive
mysql-username: mc
mysql-password: '你的密码'
```

> **注意 24.1 的边界**：`database-type`、`duckdb-*`、`clickhouse-*` 这些键是 **25.x 才有的**，24.1 上不存在，写了也不认。24.1 只有 `use-mysql` 这一个开关。
>
> 另有几个数据库相关键（`enable-ssl`、`disable-wal`、`database-lock`、`maximum-pool-size`）在 24.1 的代码里有默认值，但**默认不会写进生成的 `config.yml`**；要改它们得自己手动补上这一行。

**切换后旧数据会怎样**：**不会自动搬运**。切换只是换了「写到哪里」，已有的 SQLite 记录留在 `plugins/CoreProtect/database.db` 里，不会跑到新库。要搬迁历史数据，官方给的是控制台命令：

```
/co migrate-db <sqlite|mysql>
```

但官方文档明确写着：**该功能仅限 23.0+ 的 Patreon（捐赠）版本**。社区版用户只能「切换后从零开始积累」，或保留旧库文件不删。

> **切库前务必**：停服 → 整个 `plugins/CoreProtect/` 目录打包备份。这是唯一的后悔药。

### LuckPerms（5.5.85）：切换存储后端，需要手动 export/import

**是否用数据库**：默认不用，`storage-method: h2`（内嵌单文件库）。官方明确建议：单机用 H2，远程数据库里 **MariaDB 优先于 MySQL**。

**怎么接**：改两处：

```yaml
storage-method: mysql      # 或 mariadb（官方更推荐）；可选值见下
data:
  address: 127.0.0.1       # 端口用默认值时就只写主机名；非默认端口才写 "host:port"
  database: mchive
  username: mc
  password: '你的密码'
  table-prefix: 'luckperms_'   # 多个服共库时改成各不相同
```

> `storage-method` 的完整可选项：远程为 `mysql` / `mariadb` / `postgresql` / `mongodb`，本地为 `h2` / `sqlite`，纯文本为 `yaml` / `json` / `hocon` / `toml`；任意一种都可以加 `-combined` 后缀把用户/组/轨道合并到一个文件。
>
> 共用一个 MySQL/MariaDB 时，默认的 `messaging-service: auto` 会自动启用 SQL 消息队列，实现**跨子服的权限即时同步**——这正是 [Velocity 群组服](#/guide/velocity-network) 里「权限不同步」问题的正解。

**切换后旧数据会怎样**：**不会自动搬运**。切换存储类型后，新后端是一张空表；你辛苦配好的组和权限不会自己飞过去。官方给定的迁移姿势是「导出 → 换后端 → 导入」：

```
1. /lp export backup        （文件落在 LuckPerms 数据目录，实际名为 backup.json.gz）
2. 完全停止服务器
3. 编辑 config.yml，把 storage-method 改成目标类型
4. 启动服务器，等新后端初始化完成
5. /lp import backup
```

`export` 会把当前数据转成「一串重建命令」，`import` 再逐条执行——所以它既能迁移，也能当**全量备份**手段。

### EssentialsX（2.22.0）：**不使用数据库**

**是否用数据库**：**否，且无法配置**。EssentialsX 的 jar 里没有任何 JDBC/MySQL/MariaDB 字符串，也没有 `storage-method` 之类的存储配置项。玩家数据（余额、家、邮件、昵称、powertool）以 `UserData` 写进：

```
plugins/Essentials/userdata/<uuid>.yml
```

部分全局数据（如 `kits.yml`、`warps.yml`）在插件根目录的 `.yml` 里。

> **推论**：EssentialsX 的经济**无法跨服共享**，无论你装不装 MySQL。想让多台子服的金钱同步，只能换用「支持共享数据库」的经济方案——见 [经济系统搭建](#/guide/economy-setup)。**把 EssentialsX 的数据「搬进数据库」这件事，官方从来没有提供过**，遇到相关教程请直接跳过。

### 三插件对照速查

| 插件 | 是否支持数据库 | 默认存储 | 切换后自动迁移？ | 迁移手段 |
|------|----------------|----------|------------------|----------|
| CoreProtect 24.1 | ✅ MySQL/MariaDB | SQLite | ❌ 不会 | `/co migrate-db`（**仅捐赠版**），否则只能重新开始 |
| LuckPerms 5.5.85 | ✅ MySQL/MariaDB/PG/Mongo | H2 | ❌ 不会 | `/lp export` → 改配置 → `/lp import` |
| EssentialsX 2.22.0 | ❌ 不支持 | 文件（`.yml`） | 不适用 | 不适用 |

> **一句话记忆**：本站三个插件切换数据库**没有一个会自动搬数据**。切换前先备份整个插件目录，是唯一稳妥的做法。

## 五、安全要点

| 项目 | 正确做法 | 后果（做错时） |
|------|----------|----------------|
| **监听地址** | `bind-address` 设为 `127.0.0.1`（只监听本机）；需要多台子服连时，改成内网 IP 并配合防火墙白名单 | 监听 `0.0.0.0` 等于把数据库直接暴露给全网扫描器 |
| **端口暴露** | **不要**对公网开放 3306。云服务器安全组里只放行内网/指定 IP | 3306 是全网被爆破最多的端口之一 |
| **账号授权** | 专用账号、`GRANT ... ON 你的库.*`，host 精确到 `127.0.0.1` 或内网网段 | 用 root 或 `'%'` 通配，一旦密码泄露就是整台库沦陷 |
| **密码强度** | 长随机密码，不要与游戏内密码、FTP 密码复用 | 弱口令是最常见的入侵入口 |
| **字符集** | 建库时显式指定 `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci` | 中文昵称、消息可能变问号或乱码 |
| **版本** | 只用 LTS，且保持安全补丁更新 | 停留在已 EOL 的 MySQL 8.0 会拿不到安全修复 |

`bind-address` 的配置文件位置**因发行版而异**，常见位置：

- Debian / Ubuntu：`/etc/mysql/mariadb.conf.d/50-server.cnf`
- RHEL 系：`/etc/my.cnf.d/mariadb-server.cnf`

改完用 `systemctl restart mariadb` 生效。不确定文件在哪时，用 `mariadbd --verbose --help 2>/dev/null | grep -A2 'Default options'` 看它实际加载了哪些配置。**改完务必用 `ss -tlnp | grep 3306` 确认监听地址符合预期。**

## 六、备份与恢复：上了数据库之后，策略要跟着变

**用了数据库后，备份不再是「打包一个文件夹」那么简单**——数据分散在「插件目录的文件」和「数据库的表」两处，必须两套都备。

**逻辑备份（推荐，可跨版本恢复）：**

```bash
# 停服后执行最稳妥；若必须在线备份，加 --single-transaction（InnoDB 一致性快照）
mariadb-dump -u mc -p --single-transaction --default-character-set=utf8mb4 mchive > /backup/mchive_$(date +%F).sql
# MySQL 用户：mysqldump ... 参数完全一致
```

**恢复：**

```bash
mariadb -u mc -p mchive < /backup/mchive_20260927.sql
# MySQL 用户：mysql -u mc -p mchive < /backup/mchive_20260927.sql
```

三点提醒：

1. **恢复前先停服**，避免插件在恢复中途写入。
2. **插件目录仍需单独备份**：CoreProtect 的 `config.yml`、LuckPerms 的 `config.yml`、EssentialsX 的整个 `userdata/` 都不会进数据库 dump。
3. **定期演练恢复**。备份文件能不能用，只有真正恢复过一次才知道——把备份放在服务器同一块磁盘上，等于没备份。完整的备份体系（3-2-1 原则、异地存储、自动脚本）见 [服务器日常运维手册](#/guide/server-maintenance)。

## 七、常见坑速查

| 症状 | 大概率原因 | 处理 |
|------|-----------|------|
| 插件报「Unable to connect to MySQL server」 | host/端口/账号/密码错，或账号的 host 不匹配 | 用第三节第 5 步的**同一账号**在命令行先连通，再回插件里填 |
| 本机能连，子服连不上 | `bind-address` 仍是 `127.0.0.1`，或防火墙/安全组没放行 | 改 `bind-address` 为内网 IP，放行子服 IP；**别开 0.0.0.0 上公网** |
| 中文变问号或乱码 | 库/表/连接字符集不是 `utf8mb4` | 建库时指定 `utf8mb4`；LuckPerms 的连接属性里 `characterEncoding: utf8` 保持默认 |
| 多台服共库后数据互相「串味」 | **表前缀没改**，两套数据写进了同一批表 | 每个服设不同的 `table-prefix`（CoreProtect 默认 `co_`、LuckPerms 默认 `luckperms_`） |
| 起了第二个服，第一个服的 CoreProtect 报「Database is already in use」 | `database-lock: true`（默认）在用一张锁表防止两个服务端同时写同一个库 | 这是**保护机制**。共库场景要在各服设 `database-lock: false`，但要清楚：官方警告这可能带来数据损坏风险 |
| 切了 MySQL，进游戏发现「数据全没了」 | 插件**不会自动搬运**旧数据，你只是连上了一张空库 | 别慌、别删旧文件：CoreProtect 把旧 `database.db` 放回去即可；LuckPerms 用 `/lp export`+`/lp import` 补齐 |
| 人多时插件报连接超时 | 数据库 `max_connections`（默认 151）或插件连接池被打满 | 先看是不是连接没释放；必要时调大连接池（CoreProtect `maximum-pool-size` 默认 10）与数据库 `max_connections` |
| `mariadb-dump` 找不到 | 发行版仍是旧命名 | 用 `mysqldump`（等价软链接），或确认 `mariadb-client` 已安装 |

## 下一步

- 多台子服要共享权限与数据？[用 Velocity 搭建群组服](#/guide/velocity-network) 的「跨服数据同步」一节讲了怎么把它们接到同一个库。
- 数据库备份只是备份体系的一半，[服务器日常运维手册](#/guide/server-maintenance) 有完整的 3-2-1 备份与灾难恢复流程。
- 数据库端口暴露、账号权限都是攻击面，[安全加固](#/guide/security-hardening) 的「网络层安全」会告诉你 3306 该怎么管。
