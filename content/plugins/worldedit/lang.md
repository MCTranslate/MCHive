# WorldEdit 自带中文，通常无需下载语言文件

WorldEdit 内置了多语言系统，**简体中文（`zh-CN`）随 jar 直接附带**，并且会**自动跟随每个玩家客户端的语言**显示：

- 玩家客户端语言是「简体中文」→ WorldEdit 的提示自动显示中文
- 玩家客户端是英文 → 自动显示英文，互不干扰

因此本页**不提供 lang.yml 下载**——WorldEdit 不认 `.yml` 语言文件，官方的翻译数据是打包在 jar 内 `lang/i18n.zip` 里的 JSON（当前版本内置 140 多种语言，`zh-CN/strings.json` 即简体中文）。

## 想改译文 / 补翻译怎么办

WorldEdit 支持加载用户自备的翻译，放在插件目录下即可，按下面的**优先级逐条字符串**覆盖（不必整份重写）：

1. `plugins/WorldEdit/lang/<语言代码>/strings.json`（例如 `plugins/WorldEdit/lang/zh-CN/strings.json`）
2. `plugins/WorldEdit/lang/i18n.zip` 内的 `<语言代码>/strings.json`
3. jar 内 `lang/i18n.zip` 的 `<语言代码>/strings.json`
4. jar 内 `lang/strings.json`（仅默认语言 en）

某一门语言缺某条字符串时，会先退化到更通用的语言（比如 `fr` 代替 `fr-CA`），最后回落到默认语言 `en`。

也就是说：想让中文提示改成你自己的说法，把**要覆盖的那几条**写进 `plugins/WorldEdit/lang/zh-CN/strings.json` 就行，其余仍用官方自带翻译。注意此机制主要用来**补空缺**，颜色等格式有限制，不适合整站魔改。

## 常见问题

- **游戏里还是英文？** 检查客户端「设置 → 语言」是否为简体中文，改完重进服务器即可
- **后台控制台一直是英文？** 控制台没有客户端语言概念，WorldEdit 使用服务端默认语言（跟随服务端系统 locale，一般是英文），不影响玩家
- **某些提示两种语言混着来？** 部分命令的描述文本受上游命令库限制暂时无法翻译；扩展功能（如 FAWE 新增的命令）的翻译进度也和主插件不同步，属于上游问题，不影响使用

## 游戏内提示词对照（注解速查）

汉化是自动的，但提示里的几个英文**术语**值得提前认识，看懂它们你才算会用 WorldEdit：

| 英文提示（原文） | 中文含义 | 注解 |
|------------------|----------|------|
| pos1 / pos2 | 第一 / 第二选点 | 用木斧左键、右键设置，两点确定长方体选区 |
| blocks affected | 受影响的方块数 | 每次操作完成后会显示这次改了多少方块，用于确认操作规模 |
| Max blocks change limit reached | 已达方块变更上限 | 配置里设置了操作上限时的报错提示，见下方 Config 汉化页 |
| Make a region selection first | 请先建立选区 | 还没设置 pos1/pos2 就执行了需要选区的命令 |
| Block name ... was not recognized | 无法识别的方块名称 | 方块 ID 拼写错误，新版本请用 `minecraft:grass_block` 这类完整 ID |
| Your clipboard is empty. Use //copy first | 剪贴板是空的 | `//paste` 之前没有先 `//copy`；复制后建筑暂存在内存的「剪贴板」里 |
| Block ... not allowed (see WorldEdit configuration) | 该方块被配置禁用 | 命中了 `limits.disallowed-blocks` 黑名单，见下方 Config 汉化页 |

## 想从源头改进译文？

WorldEdit 的翻译托管在上游 EngineHub 的 Crowdin 翻译平台，随版本更新自动合并进发行版。个人想大范围改进译文，可以到上游提交翻译；对新手服来说，自带的简体中文已经完全够用。
