# 15 分钟极速开服

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（也兼容 1.21.x 流程）。

目标：从一台空白电脑到玩家输 IP 进服。每一步都给了验证方法，做完一步确认一步，不要跳。

> 本教程以 **Linux（Ubuntu/Debian）+ Paper 26.x** 为例。Windows 用户流程完全一样，只是命令格式不同，文中都会标注。

## 第 1 步：装 Java（3 分钟）

Paper 26.x 需要 **Java 21 或更高**（新版核心已支持 Java 25 LTS）。

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y openjdk-21-jre-headless

# CentOS / RHEL
sudo yum install -y java-21-openjdk java-21-openjdk-devel
```

Windows 用户去 [Adoptium](https://adoptium.net/) 下载 Temurin 21（或更新 LTS 版）的 MSI 安装包，一路下一步。

**验证：**

```bash
java -version
# 输出包含 "21" 即成功
```

> 常见坑：系统里装了多个 Java 版本时，用 `update-alternatives --config java`（Ubuntu）切换默认版本。Windows 下确认环境变量 JAVA_HOME 指向 Java 21。

## 第 2 步：下载核心并启动（2 分钟）

建一个专用目录（别把服务端扔桌面）：

```bash
mkdir ~/mcserver && cd ~/mcserver
```

去 [Paper 官网](https://papermc.io/downloads) 下载对应版本的 jar，重命名成 `server.jar` 放进来，然后首次启动：

```bash
java -Xms4G -Xmx4G -jar server.jar --nogui
```

- `-Xms4G -Xmx4G`：分配 4G 内存，两个值建议设成一样，避免动态扩容卡顿。服务器内存的一半左右比较合理。
- `--nogui`：不启动图形界面，省资源。

Windows 用户做一个 `start.bat`，双击启动：

```bat
@echo off
java -Xms4G -Xmx4G -jar server.jar --nogui
pause
```

**预期结果：** 启动会**失败并退出**，这是正常的——因为还没同意 EULA。

## 第 3 步：同意 EULA（1 分钟）

目录下多了个 `eula.txt`，把 `eula=false` 改成 `eula=true`。

这表示你同意 Minecraft 的最终用户许可协议（EULA），不开这个服务器跑不起来。

再次执行启动命令。这次会正常跑起来，最后看到：

```
[Server thread/INFO]: Done (xx.xxxs)! For help, type "help"
```

**本机验证：** 打开 Minecraft 客户端，添加服务器地址填 `localhost`，能看到服务器出现在列表里。

## 第 4 步：改服务器基本信息（2 分钟）

编辑 `server.properties`，改这几项：

```properties
motd=欢迎来到我的服务器        # 玩家在服务器列表看到的标语
max-players=20                # 最大玩家数
online-mode=true              # 正版验证（见下方说明）
view-distance=8               # 视野距离，性能不行就调小
spawn-protection=16           # 出生点保护半径
```

> **关于 `online-mode`**：`true` 只允许正版玩家进入。国内情况复杂，如果你确定要关闭正版验证（`false`），请同时装上登录插件（如 AuthMe）防止冒名顶替，并配合白名单使用。本站不鼓励盗版，但会告诉你真实世界的做法。

改完在控制台输入 `reload confirm` 或重启生效。

## 第 5 步：让朋友进来（3 分钟）

朋友能不能连上，取决于你的网络环境，三选一：

### A. 你有公网 IP（云服务器 / 家宽有公网）

直接把服务器 IP 发给朋友。云服务器记得在安全组放行 **TCP 25565** 端口。

### B. 家里没有公网 IP（大部分国内家庭）

用内网穿透，常见选择：

- **SakuraFrp / 花生壳**：国内速度快，免费额度有限
- **frp 自建**：有一台云服务器就能自己搭，最稳

### C. 只想和朋友局域网联机

同一 WiFi 下，朋友填你的**内网 IP**（`ipconfig` 查看，一般是 192.168.x.x）。

**验证：** 朋友用 `服务器IP:25565` 加入。

## 第 6 步：装第一批插件（4 分钟）

现在服务器是「裸奔」状态。按这个顺序装上基础插件，每个的详细配置看本站插件库对应页面：

1. **EssentialsX** — 家、传送、经济基础（[教程](#/plugin/essentialsx)）
2. **LuckPerms** — 权限管理（[教程](#/plugin/luckperms)）
3. **Vault** — 经济权限桥梁
4. **WorldGuard + WorldEdit** — 区域保护（[教程](#/plugin/worldguard)）

下载 jar 丢进 `plugins/` 目录 → 控制台输入 `stop` → 重新启动 → 完成。

**验证：** 游戏内输入 `/plugins`，列表里全部绿色。

## 下一步

- 想知道这四个插件之外还需要什么？看 [插件组合方案](#/guide/plugin-combos)
- 遇到报错？看 [避坑与排错](#/guide/faq)
- 想给插件上中文？每个插件页面底部都有汉化下载
