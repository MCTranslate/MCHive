---
id: startup-script
title: 启动脚本与服务端目录：一次配好，以后不用管
description: bat/sh 脚本怎么写、内存参数怎么给、chcp 65001 防乱码、自动重启、eula 协议，以及每个文件夹到底放什么
icon: 🚀
tags: [入门, 启动脚本, 目录结构, 运维]
order: 2
---

# 启动脚本与服务端目录

> 启动脚本就是那个双击一下就能开服的文件。这篇把脚本写法、内存参数、乱码、eula 和目录结构一次讲清——这几个坑几乎人人都会踩一遍。

## 一、最简单的脚本

新建一个文件夹，把服务端核心 jar 丢进去，然后在这个文件夹里建一个 `start.bat`，内容就一行：

```
java -Xms2G -Xmx2G -jar paper.jar --nogui
```

`--nogui` 的意思是不要图形界面。对服务器来说**永远应该加上**——省内存，而且能防止有人误点关闭窗口直接把服关了。

Windows 另存为的时候，「保存类型」要选「所有文件」，否则会变成 `start.bat.txt`，双击根本没反应。看不到后缀名可以去「查看」里勾上「文件扩展名」。

### macOS / Linux

```
#!/bin/bash
java -Xms2G -Xmx2G -jar paper.jar --nogui
```

存成 `start.sh`，然后 `chmod +x start.sh`，之后 `./start.sh` 就能跑。

## 二、为什么 `-Xms` 和 `-Xmx` 要写一样的值

- `-Xms` 是**启动时**就占的内存
- `-Xmx` 是**最多**能占的内存

新手最常见的写法是 `-Xms1G -Xmx4G`：意思是「先要 1G，不够了自己涨到 4G」。问题在于 Java 堆内存是**向操作系统申请的**，而释放要等一次完整的 GC。运行中反复伸缩会让 GC 压力变大，TPS 更容易抖。

**`-Xms` 和 `-Xmx` 设成同一个值**，堆就固定了，GC 行为可预测。这是开服最省心的做法。

具体给多少？看你的**同时在线人数**和**是否装了大量插件**：

| 场景 | 建议内存 |
|------|----------|
| 空服 / 3-5 人原版生存 | 2G |
| 装 EssentialsX + LuckPerms + CoreProtect，10-20 人 | 4G |
| 20-50 人 + 一堆玩法插件 | 6-8G |
| 大型生电 / 高视距 / 百人在线 | 8G 起，且要单独调 GC（见 [性能调优从入门到精通](#/guide/performance-tuning)） |

**别给超了**。给太多内存不会让服务器更快，反而可能在内存不足时触发系统的 swap（虚拟内存），那才是真的卡。经验值是**别超过你机器物理内存的 70%**。

## 三、Windows 控制台中文乱码

日志里中文变成 `???` 或者问号方块，几乎都是编码问题。**在脚本第一行加 `chcp 65001`**：

```
chcp 65001
java -Xms2G -Xmx2G -jar paper.jar --nogui
pause
```

`chcp 65001` 把控制台代码页切成 UTF-8。这是必须加的一行。

末尾那个 `pause` 也建议加——否则黑窗口一闪而过，出错了你根本看不到报错信息。

> 如果加了 `chcp 65001` 还是乱码，检查系统区域设置：控制面板 → 区域 → 管理 → 更改系统区域设置 → 勾选「Beta: 使用 Unicode UTF-8 提供全球语言支持」。

## 四、自动重启

服崩了之后没人管，就一直挂着。用脚本包一层循环就行。

**Windows：**

```
@echo off
:start
chcp 65001
java -Xms4G -Xmx4G -jar paper.jar --nogui
echo 服务器已关闭，5 秒后重启...
timeout /t 5
goto start
```

**Linux（配 screen 用）：**

```
while true
do
  java -Xms4G -Xmx4G -jar paper.jar --nogui
  echo "服务器已关闭，5 秒后重启..."
  sleep 5
done
```

Linux 上更推荐用 `screen` 而不是无限循环，这样你能随时重新连回去看日志：

```
screen -S minecraft
# 进去后启动服务器
# 按 Ctrl+A 然后按 D 脱离（服务器继续跑）
# 回来：screen -r minecraft
```

## 五、eula.txt：那个必须改的 true

第一次启动会停住并提示：

```
You need to agree to the EULA in order to run the server. Go to eula.txt for more info.
```

用文本编辑器打开生成的 `eula.txt`，把 `eula=false` 改成 `eula=true`，保存，重新启动。

`eula` 就是 Minecraft 用户协议。**`eula=true` 代表你接受这份协议**——服务器对外运营就是你和玩家之间的约定，所以这一项由服主自己确认，不用问玩家。

看到 `Done (6.554s)! For help, type "help"` 就说明开起来了。

## 六、四个高频报错

### `Error: Unable to access jarfile xxx.jar`

大概率是文件后缀名被重复了。看一眼实际文件名是不是变成了 `paper.jar.jar`（Windows 默认隐藏扩展名，很容易中招）。解决办法：去资源管理器「查看」里勾上「文件扩展名」，把多出来的后缀删掉。

### `Invalid initial heap size: -Xms1024M`

参数写错了。**`-Xms` 和数值之间不能有空格**，正确写法是：

```
-Xms1024M -Xmx2048M
```

而不是：

```
-Xms 1024M -Xmx 2048M
```

### 卡在 `Downloading mojang_x.x.x.jar`

第一次启动要下载官方服务端 jar，网络不通就会卡住。换网络节点再试。

如果要用代理（比如你在用科学上网），**代理必须单独设给命令行窗口**，浏览器能用不代表 cmd 能用：

```
set http_proxy=http://127.0.0.1:7890
set https_proxy=http://127.0.0.1:7890
java -Xms2G -Xmx2G -jar paper.jar --nogui
```

端口换成你自己软件的实际端口。这两行只对当前这个窗口有效，关掉重开就没了。

### 中文变成 `锟斤拷` 之类

两种情况，处理方式不同：

- **看得出是「口字码」**（满屏小方块 `口`）：文件本身是 UTF-8，但被用 GBK 打开了。用 VS Code 右下角点一下 `UTF-8`，改成 GBK 重新打开就行。
- **满屏 `锟斤拷` 或带声调的拼音字母**：文件是 UTF-8 却被当 GBK 读了又存回去，已经损坏了，**只能重新下载一份**，转码救不回来。

完整对照表见 [避坑与排错速查](#/guide/faq)。

## 七、脚本模块化写法（可选）

行数多了以后，参数堆在一行不好维护。可以拆成变量：

```
@echo off
chcp 65001

set JAVA_OPTS=-Xms4G -Xmx4G -XX:+UseG1GC
set SERVER_JAR=paper-*.jar
set SERVER_ARGS=nogui

java %JAVA_OPTS% -jar %SERVER_JAR% %SERVER_ARGS%

pause
```

`SERVER_JAR=paper-*.jar` 用通配符的好处是**以后更新核心不用改脚本**，也不用改 jar 文件名。

> 顺带一提：`/restart` 命令能不能用，也取决于这里。Spigot 系核心的 `spigot.yml` 里有个 `restart-script: ""` 是空的，不填的话 `/restart` 只会关服不会重启，得你自己再手动起来。

## 八、服务端目录结构

以 Purpur 为例，开完服你会看到这些：

**根目录下的文件**

| 文件 | 作用 | 能不能删 |
|------|------|---------|
| `server.properties` | 服务端基础配置（端口、难度、种子） | 不能 |
| `spigot.yml` | Spigot 层配置（实体上限、动物上限等） | 不能 |
| `paper-world-defaults.yml` | 世界默认配置（Paper 26.x） | 不能 |
| `config/paper-global.yml` | Paper 全局配置 | 不能 |
| `eula.txt` | 协议同意标记 | 不能 |
| `ops.json` | OP 名单 | 能（但你会丢 OP） |
| `whitelist.json` | 白名单 | 能 |
| `banned-players.json` | 封禁名单 | 能（但会解封） |
| `usercache.json` | 玩家名 ↔ UUID 缓存 | 删了不影响 |
| `server.jar` | 你的服务端核心 | 不能 |
| `permissions.yml` | 权限定义 | 不能 |

**文件夹**

| 文件夹 | 装什么 |
|--------|--------|
| `plugins/` | 所有插件的 jar 和它们的配置 |
| `world/` | 主世界存档 |
| `world_nether/` | 下界 |
| `world_the_end/` | 末地 |
| `logs/` | 服务端日志，出问题第一个该看的地方 |
| `crash-reports/` | 崩溃报告，服崩了一定要看 |
| `config/` | Paper 26.x 的服务端配置目录 |
| `cache/` | 缓存，可删，会自动重建 |
| `assets/` | 资源文件，**别动** |
| `libraries/` | 依赖库，**别动** |

插件装多了以后还会冒出一堆文件夹（比如 QuickShop 有自己的数据库目录），这些不用管。

> ⚠️ **26.x 的变化**：Paper 26.1 起世界存储结构改了，下界/末地不再是根目录的独立文件夹，而是收进主世界里的 `dimensions/`。**升到 26.1 就无法降级了**，回退前一定要先完整备份。

## 九、一句话流程

```
下载核心 → 建 start.bat（记得 chcp 65001 + pause）→ 双击
→ 改 eula.txt → 再双击 → 看到 Done → 进 server.properties 调端口和人数
```

## 下一步

- [15 分钟极速开服](#/guide/quick-start) — 把整条流程压到 15 分钟
- [核心怎么选：决策树版](#/guide/choose-core) — 核心没定下来的先看这篇
- [服务器迁移与升级](#/guide/server-migration) — 换配置、搬数据、升版本
