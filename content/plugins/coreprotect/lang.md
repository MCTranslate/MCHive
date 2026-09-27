# CoreProtect 官方已支持简体中文 — 一行配置即可切换

**结论先说：CoreProtect 24.1 自带官方简体中文支持，不需要下载任何语言文件。**

`config.yml` 里有 `language` 选项（默认 `en`），官方注释写明：*"If modified, will automatically attempt to translate languages phrases."* 改成简体中文的语言码即可：

```yaml
language: zh-CN
```

改完执行 `/co reload`（或重启服务器）生效。官方语言码总表在 <https://coreprotect.net/languages/>，其中简体中文是 `zh-CN` 或 `zh`，繁体中文是 `zh-TW`。

## 翻译是怎么来的

CoreProtect 的翻译不是机翻占位，而是**由社区译者提交、随项目维护的人工翻译**。以简体中文为例，翻译文件位于官方仓库的 [`lang/zh-cn.yml`](https://github.com/PlayPro/CoreProtect/blob/master/lang/zh-cn.yml)，文件头会标注译者：

```yaml
# CoreProtect Language File (zh-CN)
# Origin: Intelli, Translator: DreamVoid, StarWishsama, YuanYuanOwO, Halogly
```

## 覆盖进度（诚实说明）

英文短语共 **189** 条，`zh-cn.yml` 已翻译 **169** 条，覆盖率约 **89%**。剩下 20 条大多是较新的**数据库异常诊断类**消息（如 `DATABASE_RECOVERY_*`、`PATCH_TABLE_*`、`USING_DATABASE`），这些消息只在数据库出问题时才出现，会**回退显示英文**。日常使用（查询、回滚、清理、权限提示）的中文是完整的。

## 想改某个词？用 language.yml 逐条覆盖

如果只想把某句话改成自己的说法（比如加上服务器名字），不要去改翻译源文件，而是编辑插件目录下的 `language.yml`：

1. 首次启动后，`plugins/CoreProtect/` 下会自动生成 **`language.yml`**
2. 文件里列出了**全部短语键**，每行形如 `KEY: "原文"`，未翻译的键自动填入英文原文
3. 把任意一行改成你要的文字即可，例如：

```yaml
NO_PERMISSION: "你没有权限执行此操作，请联系管理员。"
```

4. `/co reload` 生效

> `plugins/CoreProtect/.language` 是翻译缓存文件（文件名以点开头），**不要手工编辑**——它会被自动重建。

**改文案时必须保留占位符**，否则消息会出错或不显示数值：

| 写法 | 含义 | 例子 |
|------|------|------|
| `{0}` `{1}` | 按序号填入的变量 | `LOOKUP_ROWS_FOUND: "{0} {row\|rows} found."` |
| `{a\|b}` | 按上下文二选一的形式 | `INSPECTOR_TOGGLED: "Inspector now {enabled\|disabled}."` |

对应到中文官方译法就是 `LOOKUP_ROWS_FOUND: "{0} {行|行}已找到。"`、`INSPECTOR_TOGGLED: "检查器已{启用|禁用}。"`

## 常用反馈对照（取自官方语言文件原文）

下表左边的英文是**真实字符串**（取自官方 `lang/en.yml`），排查问题时可以照着比对：

| 英文原文（en.yml 键名） | 中文含义 | 官方中文译法 |
|--------------------------|----------|--------------|
| `Inspector now {enabled\|disabled}.`（INSPECTOR_TOGGLED） | 查询模式已开启/关闭 | 检查器已{启用\|禁用}。 |
| `Lookup searching. Please wait...`（LOOKUP_SEARCHING） | 查询执行中 | 正在搜索，请稍候... |
| `{0} {row\|rows} found.`（LOOKUP_ROWS_FOUND） | 查到 N 条记录 | N 行已找到。 |
| `{0} Lookup Results`（LOOKUP_HEADER） | 查询结果标题 | XXX 查询结果 |
| `{0} {placed\|broke} {1}.`（LOOKUP_BLOCK） | 某人放置/破坏了某方块 | 某人 放置/破坏了 某方块。 |
| `No {data\|transactions\|interactions\|messages} found at this location.`（NO_DATA_LOCATION） | 此处没有对应记录 | 此位置找不到任何{数据\|存取\|交互\|消息}记录。 |
| `You do not have permission to do that.`（NO_PERMISSION） | 没有权限（给管理组 `coreprotect.*`） | 你没有权限执行此操作。 |
| `No {pending\|previous} rollback/restore found.`（NO_ROLLBACK） | 没有可撤销的回滚 | 未找到{待处理的\|上一个}回滚/恢复。 |
| `The maximum {lookup\|rollback\|restore} radius is {0}.`（MAXIMUM_RADIUS） | 超出 `max-radius` 上限 | 超出最大半径限制。 |
| `You can only purge data older than {0} {days\|hours}.`（PURGE_MINIMUM_TIME） | 清理时间下限保护 | 你只能清除 N 天/小时之前的数据。 |
| `{Rollback\|Restore\|Preview} completed for "{0}".`（ROLLBACK_COMPLETED） | 回滚/恢复/预览完成 | 回滚/恢复/预览已完成。 |
| `Use "{0}" to do a global {rollback\|restore}`（GLOBAL_ROLLBACK） | 提示用 `r:#global` 做全服操作 | 使用 "r:#global" 执行全服操作 |

## 特殊用户名（记录里的操作者）

破坏记录的操作者位置可能出现 `#` 开头的「非玩家用户」，这些名字是真实的：

| 特殊用户 | 意味着 |
|----------|--------|
| `#tnt` | TNT 爆炸造成的破坏（用 `u:#tnt` 可查，点火的玩家需另行查询） |
| `#creeper` | 苦力怕爆炸 |
| `#fire` | 火焰 |
| `#explosion` | 其他爆炸 |
| `#hopper` | 漏斗转移了物品（箱子少东西先怀疑它） |
| `#dispenser` | 发射器操作 |
| `#piston` | 活塞推动 |
| `#water` / `#lava` | 水 / 岩浆流动造成的破坏 |

多个可以组合使用：`/co lookup u:#fire,#tnt,#creeper,#explosion t:24h r:#global`
