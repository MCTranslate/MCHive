# CoreProtect 暂无官方中文 — 用这份对照注解看懂所有消息

CoreProtect **没有内置的简体中文语言包**，也不提供官方 lang.yml 下载：它的提示消息直接写在插件代码里，目前以英文为主。所以本页**不提供语言文件**，而是给一份逐项中文对照——记住下面这些词，CoreProtect 的所有输出你都能看懂。

## 命令反馈对照

| 英文反馈 | 中文含义 |
|----------|----------|
| CoreProtect enabled. | 插件已启用（启动日志） |
| Inspect enabled. / Inspect disabled. | 查询模式已开启 / 已关闭（/co i 的反馈） |
| No permission. | 没有对应权限（给管理组 coreprotect.* 权限） |
| Please wait while the lookup is performed. | 查询执行中，请稍候 |
| Found N item(s). | 查到 N 条记录 |
| Page N/N | 第 N 页 / 共 N 页（结果较多时分页显示） |
| That lookup doesn't support the given parameters. | 参数组合无效（比如 a:chat 配了 b:tnt） |
| Rolled back N block(s). | 已回滚 N 个方块 |
| Restored N block(s). | 已恢复 N 个方块 |
| Nothing to rollback. | 没找到可回滚的记录（检查用户名/时间/范围参数） |
| Purging data older than X. | 正在清理 X 之前的旧数据 |

## 查询结果逐段解读（重点）

`/co lookup` 的每条结果长这样：

```
Steve broke dirt (64, 70, -128) 3m ago
```

逐段注解：

| 片段 | 含义 | 注解 |
|------|------|------|
| Steve | 操作者 | 玩家名，熊人的元凶；也可能出现 #tnt、#creeper 等特殊用户名 |
| broke / placed | 破坏 / 放置 | 对方块而言；removed / picked up 用于物品类记录 |
| dirt | 方块种类 | 被操作的方块 |
| (64, 70, -128) | 坐标 | 事发位置，可以直接 tp 过去 |
| 3m ago | 3 分钟前 | m=分钟 h=小时 d=天 w=周 |

特殊用户名（以 # 开头）对照：

| 特殊用户 | 意味着 |
|----------|--------|
| #tnt | TNT 爆炸造成的破坏（继续用 u:#tnt 查是谁点的火） |
| #creeper | 苦力怕爆炸 |
| #fire | 火焰蔓延 |
| #wild | 自然因素（掉落、冲刷等） |
| #hopper | 漏斗转移了物品（箱子少东西先怀疑它） |

## 命令参数对照（已在上文教程展开）

| 参数 | 中文含义 |
|------|----------|
| u: | 用户（玩家名或 #特殊用户） |
| t: | 时间范围（10m / 24h / 7d） |
| r: | 范围（数字=半径，r:world=整世界，r:#global=全服） |
| a: | 行为（a:block / a:container / a:chat / a:command 等） |
| b: | 方块过滤（b:tnt） |

## 想要中文界面？

较新版本支持在 `plugins/CoreProtect/language/` 目录放自定义短语文件覆盖个别消息，但**社区中文翻译尚未随官方分发**，逐条手翻成本高、更新易失效。对管理员而言，本页的对照表 + 参数表已经覆盖日常 100% 的使用场景，不建议折腾。
