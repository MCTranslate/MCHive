# PlaceholderAPI 没有语言文件 — 变量才是它的「文本」

PlaceholderAPI 不向玩家说任何话：它只做一件事——把 `%变量%` 替换成实际内容，玩家看到的所有文字都来自**使用变量的插件**和**变量本身的值**。因此它没有也不需要 lang.yml / 语言文件，本页不提供语言文件下载。

真正值得汉化注解的，是它体系下的**变量（占位符）**。下面这份速查表覆盖新手服 90% 的美化需求。

## 玩家信息类（player 扩展）

| 变量 | 显示内容 | 注解 |
|------|----------|------|
| %player_name% | 玩家名 | 最常用，如 Steve |
| %player_displayname% | 显示名 | 含昵称插件改过的名字和颜色 |
| %player_world% | 所在世界名 | 显示世界文件夹名，中文别名请配合 Multiverse 的变量 |
| %player_x% / %player_y% / %player_z% | 三轴坐标 | 常用于任务提示、导航全息 |
| %player_health% | 当前生命值 | 记分板血量显示 |
| %player_ping% | 延迟(ms) | Tab 列表显示延迟 |
| %player_online_time% | 在线时长 | 公益服活跃度展示 |

## 经济与权限类（vault / luckperms 扩展）

| 变量 | 显示内容 | 注解 |
|------|----------|------|
| %vault_balance% | 余额 | 数值原样显示，格式化用 %vault_balance_fixed% |
| %vault_rank% | 权限组名 | 显示主权限组的小写名（member / vip） |
| %luckperms_prefix% | 权限组前缀 | 聊天栏美化核心变量，需下载 luckperms 扩展 |
| %luckperms_suffix% | 权限组后缀 | 同上，显示称号后缀 |

## 服务器信息类（server 扩展）

| 变量 | 显示内容 | 注解 |
|------|----------|------|
| %server_online% | 当前在线人数 | 大厅欢迎语、公告常用 |
| %server_max_players% | 最大在线数 | 与 %server_online% 搭配成 "12/100" 样式 |
| %server_tps_1% | 1 分钟 TPS | 20 为满值，用于性能展示/巡检 |
| %server_uptime% | 运行时长 | 排查「服务器多久没重启」 |

## 排错三步法

1. **原样显示 `%xxx%`** → 扩展没装：`/papi ecloud download <对应扩展>` 后 `/papi reload`
2. **显示空白** → 变量当前无值（如玩家没进数据库），或插件不支持 PAPI
3. **怀疑变量拼写** → `/papi parse me <变量>` 实测替换结果，不用进游戏到处试

> 某个扩展支持哪些变量，直接查 [官方 Wiki](https://wiki.placeholderapi.com/) 的 Placeholders 页，按扩展名检索。
