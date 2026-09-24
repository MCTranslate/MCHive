---
id: server-maintenance
title: 服务器日常运维手册
description: 备份、更新、日志与监控 — 把「服务器炸了没备份」的噩梦变成「有问题我能回滚」的安心。
icon: 🔧
tags: [运维, 备份, 监控, 维护]
order: 6
---

# 服务器日常运维手册

> 本教程更新于 2026 年 9 月，涵盖 Paper 26.x 通用流程。所有内容均为平台无关（Linux / Windows 均适用），差异处会单独标注。

开服的成就感只能维持三天，接下来的日子都是运维。这篇文章把「炸服」的概率降到最低——不靠运气体系，靠可执行的 Checklist。

## 第一件事：备份体系

> **不备份的服务器，就是在每次玩家熊图的时候赌运气。**

### 备份策略：3-2-1 原则

| 数字 | 含义 |
|------|------|
| 3 | 至少保留 3 份副本 |
| 2 | 2 种不同存储介质（本地 + 云端） |
| 1 | 1 份异地（不在机房/家里） |

### 别这样做备份

- ❌ 手动复制整个世界文件夹到别的目录（压缩过程硬盘 IO 爆炸，几分钟内卡服）
- ❌ 把备份和服务器放在同一块硬盘上（硬盘挂了备份也完蛋）
- ❌ 不验证恢复流程直接信任备份（70% 的人恢复时发现备份是坏的）

### 推荐方案 A：rsync 增量备份（Linux）

创建 `/opt/scripts/backup.sh`：

```bash
#!/bin/bash
# Minecraft 增量备份脚本
SERVER_DIR="/opt/mcserver"
BACKUP_DIR="/mnt/backup/minecraft"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# 确认服务器已执行完整保存（避免备份损坏状态）
tmux send-keys -t mc:0 "save-all flush" Enter
sleep 5
tmux send-keys -t mc:0 "save-off" Enter

# 执行增量备份
rsync -a --delete \
  --exclude='logs' \
  --exclude='crash-reports' \
  --exclude='plugins/dynmap/web' \
  "$SERVER_DIR" "$BACKUP_DIR/$DATE/"

# 写成 tar 存档（占地更小，恢复更快）
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR/$DATE" .

# 恢复写入
tmux send-keys -t mc:0 "save-on" Enter

# 清理超过保留天数的旧备份
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "[Backup] $DATE done. Size: $(du -sh "$BACKUP_DIR/backup_$DATE.tar.gz" | cut -f1)"
```

设置定时任务：

```bash
crontab -e
# 每天凌晨 4:30 备份（错开玩家活跃时段）
30 4 * * * bash /opt/scripts/backup.sh >> /var/log/mc-backup.log 2>&1
```

### 推荐方案 B：Windows 版备份脚本

创建 `backup.ps1`：

```powershell
$ServerDir = "D:\MCServer"
$BackupDir = "E:\Backups"
$Date = Get-Date -Format "yyyyMMdd_HHmmss"
$RetentionDays = 7

# 通知服务器执行保存
java -jar "D:\MCServer\rcon-cli.jar" -a localhost:25575 -p yourpassword "save-all flush"
Start-Sleep -Seconds 5

# 增量压缩
$Dest = "$BackupDir\backup_$Date.zip"
Compress-Archive -Path "$ServerDir\*" -DestinationPath $Dest -Force

# 清理旧备份
Get-ChildItem "$BackupDir\backup_*.zip" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } | Remove-Item
```

任务计划程序 → 设置每日定时触发。**不要用 PowerShell 跑有窗口的服务端**，脚本和游戏服务端要分开运行。

### 推送到云（防物理损坏）

本地备份还不够，上传到对象存储：

```bash
# A. 阿里云 OSS（ossutil 命令行工具）
ossutil cp -r /mnt/backup oss://your-bucket/mc-backups/

# B. rclone（通用方案，支持 Google Drive / OneDrive / S3）
rclone copy /mnt/backup gdrive:mc-backups --transfers 4

# C. 最省事：直接 rsync 到另一台机器
rsync -az /mnt/backup/ user@另一台服务器:/backup/mc/
```

> **不要上传到网盘客户端同步的文件夹**（如同坚果云），随机生成的大量小文件会把同步搞崩。用命令行工具或专用程序。

### 恢复备份（你总有一天会用上的步骤）

```bash
# 1. 关闭服务器
# 2. 删除当前损坏的世界文件
rm -rf ~/mcserver/world ~/mcserver/world_nether ~/mcserver/world_the_end

# 3. 解压备份
tar -xzf /mnt/backup/backup_20260924_043000.tar.gz

# 4. 启动
java ... -jar server.jar --nogui
```

恢复后**立即进服检查**——验证比什么都重要。

---

## 更新？更像排雷

### 什么时候该升级

不是每个版本都要追。判断是否需要更新的标准：

| 情况 | 行动 |
|------|------|
| 新版修了你急需的安全漏洞 | 立刻升 |
| 新版玩家客户端都能进但插件不支持新版 API | 等插件作者适配后再升 |
| 新版只是加了几个新物品 | 可以缓 1-2 周 |
| 你的服务器在稳定运行且版本是 LTS | 别动 |

### 安全更新 Checklist

按这个顺序执行，任何一步失败都要停下回滚：

```
□ 1. 发公告（至少提前 30 分钟）：即将维护，请下线
□ 2. 踢出所有玩家：/kickall "服务器维护中"
□ 3. 手动触发一次完整备份
□ 4. 停服：stop
□ 5. 替换核心 jar（重命名保持一致，如 server.jar）
□ 6. 如果核心有架构大变动，先检查 plugins/ 目录
□ 7. 启动后看着控制台 15 分钟：没有 ERROR / FATAL 才能走
□ 8. 管理员自己先进去检查核心玩法：传送、村庄、末地巨龙
□ 9. 进服测试命令：/version、/plugins
□ 10. 公告通知玩家维护完成，客户端可能需要更新
```

### 跨大版本升级（如 26.2 → 26.3）

升级不会自动转换旧的世界数据格式，但 Paper 会在启动时做「数据迁移」。大版本改动可能改变：

- 世界高度（从原来的 Y=-64~320 调整）
- 生物群系 ID
- 方块状态格式

**升级前必读**：到核心 的 Discord/论坛 搜索「upgrade from X.Y to X.Z breaking changes」，社区会列出破坏性变化列表。找不到就别升级。

### 插件更新

插件更新频率远高于核心，大多数情况安全更新。但新手容易犯的错误是「见到就更新」：

```
❌ 看到插件有新版本 → 直接替换 → 启动 → 配置不兼容 → 数据损坏
```

正确做法：

```
✅ 读 Changelog → 看有没有「配置格式变更」或「数据库破坏」说明
→ 备份 plugins/插件名/ 目录
→ 替换 jar
→ 启动
→ 立刻检查插件数据文件（如 LuckPerms 的 .yml 或数据库是否正常）
```

### 版本对照表

| 服务器版本 | Java 版本 | 推荐核心版本 | 状态 |
|-----------|-----------|------------|------|
| 26.3 | 25+ | Paper 最新 | 主流（2026 年 9 月） |
| 26.2 | 21+ | Paper 最新 | 主流 |
| 1.21.4 | 21+ | Paper 1.21.4 | 稳定，生态最完整 |
| 1.20.4 | 17+ | Paper 1.20.4 | 已停止更新 |

> 查看最新版本请到对应核心官网：https://papermc.io/downloads

---

## 磁盘空间管理

### 什么东西最容易吃硬盘

| 来源 | 增长原因 | 控制方法 |
|------|----------|----------|
| 日志文件 | 运行一天能产出 500MB+ 的 `latest.log` | 配置 log4j2 轮转 |
| Dynmap 地图 | 每张高清图 50-100KB，跑过的区块永远存在 | 定期清理未探索区块 |
| 玩家数据 | 每个玩家 10-50KB，但上千玩家后就不是一个数目 | 离线超过 N 天的删档 |
| 崩溃报告 | `crash-reports/` 目录按月能肥到数 GB | 保留最近 30 天 |
| 插件数据 | 如 LuckPerms 历史记录、CoreProtect 数据库 | 定期清理历史 |

### 磁盘清理脚本

```bash
#!/bin/bash
SERVER_DIR="/opt/mcserver"

# 删除 7 天前的崩溃报告
find "$SERVER_DIR/crash-reports" -name "*.txt" -mtime +7 -delete

# 删除 30 天前的旧日志
find "$SERVER_DIR/logs" -name "*.gz" -mtime +30 -delete

# 清理 Dynmap 渲染缓存（需插件支持）
# papyus-terraform 可以用 /dynmap purgeworld

echo "[Cleanup] Disk freed: $(df -h /opt | tail -1 | awk '{print $4}') available"
```

---

## 日志：不会看日志的服主只能靠猜

### 日志位置

```
logs/
├── latest.log      # 最近一次启动的日志（覆盖）
├── 2026-09-24-1.log.gz  # 启动历史的压缩日志
└── ...
```

### 常见日志模式速查

| 日志内容 | 含义 | 应该做什么 |
|----------|------|-----------|
| `ERROR`/`SEVERE` | 严重错误，通常有连锁反应 | 立即活，复制报错上下文搜 |
| `WARN` | 警告，可能继续运行 | 记录下来，批量处理 |
| `Done (xx.xxxs)!` | 启动完成 | ✅ 服务正常 |
| `Can't keep up! Is the server overloaded?` | 单 tick 执行超时 | 移步 [性能调优](#/guide/performance-tuning) |
| `UUID of player ...` | 玩家登录 | 正常情况下忽略 |
| `moved too quickly` | 玩家移动速度异常 | 可能是发包作弊或网络延迟 |
| `lost connection: Timed out` | 断开连接 | 网络问题，通常不是你的锅 |

### 看日志的正确姿势

```bash
# 实时跟踪最新日志（Linux）
tail -f logs/latest.log | grep -E "ERROR|WARN|SEVERE"

# 搜关键词
grep -r "NullPointerException" logs/

# 看启动耗时（Folia/高并发启动慢是常态）
grep -E "Done|Reloaded" logs/latest.log
```

### 该关掉的日志噪音

日志噪音主要在 `paper-global.yml` 控制：

```yaml
# paper-global.yml（根层级）
deobfuscate-stacktraces: true   # 反混淆堆栈跟踪（开发者调试用，普通服主不需要改）

# 是否记录玩家 IP 到日志中
log-player-ip-addresses: false   # 关闭后更安全，排查时再打开
```

这些信息不影响游戏运行，但能减少日志文件大小、提升隐私保护。

---

## 监控与自动恢复

### 最基本的：保证进程在线

别管「玩家说我进不去你才发现挂了」这种事。做一个看门狗脚本：

**Linux：systemd 服务**

```ini
# /etc/systemd/system/mcserver.service
[Unit]
Description=Minecraft Server
After=network.target

[Service]
User=mc
WorkingDirectory=/opt/mcserver
ExecStart=/usr/bin/java -Xms8G -Xmx8G -jar server.jar --nogui
ExecStop=/bin/bash -c "echo stop > /proc/$MAINPID/fd/0"
Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable mcserver    # 开机自启
sudo systemctl start mcserver     # 启动
sudo systemctl status mcserver    # 查看状态
```

**Windows：用 NSSM 注册为服务**

```
nssm install MCServer
Path: C:\Program Files\...\java.exe
Arguments: -Xms8G -Xmx8G -jar server.jar --nogui
Working directory: D:\MCServer
```

### 进阶：服务状态通知

让玩家管理员第一时间知道停机：

| 方式 | 免费 | 实现难度 |
|------|------|----------|
| Discord Webhook | ✅ | 简单 |
| Telegram Bot | ✅ | 简单 |
| 邮件通知 | ✅ | 中等 |
| 第三方监控（如 UptimeRobot） | 频控有限 | 最简单 |

Discord Webhook 示例（Python 脚本）：

```python
import requests
import time

WEBHOOK_URL = "https://discord.com/api/webhooks/your-webhook-id/token"

def notify(text):
    requests.post(WEBHOOK_URL, json={"content": text})

# 调用：服务启动/停止/崩溃时
notify("🟢 服务器启动于 2026-09-24 14:23:05 CST")
```

---

## 日常工作表（频率参考）

| 频率 | 任务 |
|------|------|
| 每天 | 看一眼日志（5 分钟搞定），磁盘剩余检查 |
| 每周 | 更新插件（读 changelog 后再换），手动触发一次额外备份 |
| 每月 | 跑 spark 性能分析一次，检查备份可恢复性（真恢复一遍!） |
| 每季度 | 重装系统 Java，检查硬件健康（SMART 风扇） |
| 按需 | 核心大版本更新（预估 1-2 小时维护窗口） |

---

## 灾难恢复（最坏情况的应对）

> **「服务器完全挂了，所有数据都丢了」—— 你只有一次机会恢复回来。**

### 数据完全丢失的应对

当服务器彻底损坏（如主机硬件故障）或勒索软件加密了所有数据：

```
❶ 先不要慌，冷静回忆最后一次备份是什么时候

❷ 如果备份策略做到了（3-2-1 原则你应该有异地备份）：
   ├── 确认异地备份源是否还在
   │   └── 在
   │       ├── 下载备份到新的服务器
   │       ├── 按照[备份恢复](#恢复备份) 流程恢复
   │       └── 验证：进服做 /list 看玩家 / 看出生点建筑
   │   └── 不在
   │       → 阿门
   └── 不在（没有异地备份）→ 阿门

❸ 如果最近备份是 1 天前的：
   └── 接受损失（1 天的玩家数据和建筑重建）
   
❹ 如果最近备份是 7 天前的：
   └── 发公告道歉，给所有玩家补偿
```

### 世界文件损坏（最经典的场景）

```
症状：服务器启动后立即崩溃，日志报：
    java.io.IOException: Chunk NBT tag is not valid
    or
    Exception loading structure data
    
原因：通常是服务器崩溃时正在写区块文件，写入一半就停了，导致区块数据不完整

排查步骤：

❶ 先看崩溃日志中的坐标，确认是哪个世界/哪个区块坏了
   日志样例：
   java.lang.RuntimeException: Server attempted to load a chunk that is missing or corrupt: [-32, 48]
   → 出问题的区块坐标是 X=-32, Z=48
   
❷ 定位到世界文件夹中的区块文件
   Linux：
   ls ~/mcserver/world/region/r.*.mca
   → 文件名格式 r.<区域X>.<区域Z>.mca
   → 每个 .mca 文件覆盖 32×32 区块
   → 区块 X=-32 → 区域文件 X=-1（-32/32 = -1，向下取整）
   → 区块 Z=48  → 区域文件 Z=1（48/32 = 1.5 → 1）
     要找的文件：world/region/r.-1.1.mca

❸ 删除损坏的区块文件（最激进但最直接的方案）
   # 只删损坏区域的那个文件
   rm ~/mcserver/world/region/r.-1.1.mca
   # 服务器会在该区域的区块被重新访问时自动重新生成（地形会丢，玩家建筑会丢）
   
❹ 如果玩家建筑很重要，先尝试 MCEdit / 外部工具修复
   - MCEdit（已停更但能用）: http://www.mcedit.net/
   - Amulet Editor: https://www.amuletmc.com/ （更现代）
   - 这些工具能加载世界并删除/修复损坏的区块
```

### LuckPerms 数据损坏

```
症状：启动报错 java.io.IOException: Permission denied
     或 /lp 命令全部不响应

原因：权限数据 yml 损坏（写入中途停止，文件格式被截断）

❶ 先备份 plugins/LuckPerms/
   cp -r plugins/LuckPerms/ /tmp/LuckPerms_corrupt_backup/

❷ 删掉当前的 metadata / 缓存文件
   rm plugins/LuckPerms/metadata.yml
   rm plugins/LuckPerms/actions.log

❳ 删掉权限数据文件（如果你是 YAML 存储模式）
   rm plugins/LuckPerms/users/*.yml
   rm plugins/LuckPerms/groups/*.yml
   → 玩家重新上线时会自动创建默认权限的空白用户

❹ 启动服务器 → 重新配置权限
   如果你有 MySQL 模式的数据 → 导出后用 phpMyAdmin 修复损坏的表
```

### Minecraft 版本不匹配的恢复

```
场景：服务端升级了，但玩家还是旧版本客户端，进不去
原因：服务端版本和客户端版本需要一致

临时让旧版玩家也能进（不推荐长期使用）：
❶ 在核心.yml 中设置「兼容模式」：
   某些核心（Purpur/Mohist）支持 acceptance=old 
   bungeecord 协议可以跨版本

❷ 服务器端装 ViaVersion / ViaBackwards
   这个插件让旧版客户端能连新版服务端
   安装：
   下载 ViaVersion-26.x.jar 和 ViaBackwards-26.x.jar
   放到 plugins/
   启动后检查是否绿色
   
   限制：
   - 某些新功能玩家体验不到
   - 性能略有下降（协议转换开销）
   - 与某些反作弊冲突

❸ 最佳方案：发布公告让玩家统一升级客户端版本
   用官方启动器 → 新建配置 → 选目标版本 → 启动
```

---

## 常见问题排查参考

> 这里只列运维相关的，游戏性能的排查见 [性能调优](#/guide/performance-tuning)

| 问题 | 排查思路 |
|------|----------|
| 备份文件 0 字节 | 备份脚本执行时磁盘满了 → 检查 `df -h` / 任务计划日志 |
| 定时备份没跑 | 检查 crontab（Linux）/ 任务计划（Windows）是否被禁用，用户权限是否正确 |
| 恢复备份后 /lp 失效 | LuckPerms 可能是 MySQL 模式 → 数据库连接信息需要从 config 同步 |
| 恢复备份后世界回档 | 备份不是最新的 → 确认备份时间戳；检查文件日期 |
| 服务器在但连不上 | 系统正常 → TCP 连接被防火墙挡掉 → `sudo ufw status` |

---

## 下一步

- 配置改了性能还是差？→ [性能调优从入门到精通](#/guide/performance-tuning)
- 被熊但找不到是谁干的？→ [避坑与排错](#/guide/faq) 的日志搜索章节
- 想让服务器自己修小毛病再通知你？→ 搜索引擎查「MC server watchdog 脚本」