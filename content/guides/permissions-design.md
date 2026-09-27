---
id: permissions-design
title: 权限系统设计：别让权限越用越乱
description: 从分组模型到排查思路 — 教新手服主设计一套能长期维护的 LuckPerms 权限体系，而不是每次来需求就临时加一条权限。
icon: 🎚️
tags: [权限, LuckPerms, 分组, 继承, 管理]
order: 6
---

# 权限系统设计：别让权限越用越乱

> 本教程更新于 2026 年 9 月，面向 Paper 26.x / MC 26.3 环境，权限插件以 LuckPerms 5.5.85 为准。
>
> 本文讲的是**设计**，不是命令手册。命令都能在网上查到，但「怎么分组、给谁什么」这件事没人替你决定。

刚开服的时候，权限看起来是个小问题：给管理员 OP，给普通玩家不就行了？

半年后你发现：

- `/plugins` 里有 20 多个插件，每个插件几十个权限节点，没人知道哪个该给谁；
- 有人要「加个飞行」，你给玩家自己加了一条权限；第二天又有 5 个人来要；
- 想让 VIP 多几个家，你挨个给 VIP 玩家单独加权限，加完发现漏了两个；
- 服务器里出现了一个谁都不认识的组，没人敢删，怕删了有人不能用命令。

这些都不是命令用错了，是**一开始没设计模型**。本文按「先想模型 → 再找节点 → 再动手 → 最后排查」的顺序，帮你搭一套能用一年以上的权限体系。

---

## 一、先定模型：为什么不要给每个人单独配权限

### 反例：给每个玩家单独加权限

新手最容易掉进的坑，是「谁提需求就给谁加一条权限」：

```bash
# ❌ 反面教材：逐个给玩家加
/lp user 玩家A permission set essentials.fly true
/lp user 玩家B permission set essentials.fly true
/lp user 玩家C permission set essentials.sethome.multiple.vip true
/lp user 玩家B permission set essentials.sethome.multiple.vip true
```

这样做的问题：

| 问题 | 后果 |
|------|------|
| 无法复用 | 同样需求要重复 N 次 |
| 无法批量调整 | 想给「所有 VIP」加权限，得先知道谁是 VIP |
| 新玩家无法继承 | 每个新人进服都要手动配一遍 |
| 改规则成本极高 | 一旦需求变化，你要逐个玩家去改 |
| 审计困难 | 出了问题根本不知道谁有什么 |

**权限系统里唯一值得单独配置的是「例外」**，绝大多数需求都应该落到「组」上。

### default 组的特殊地位

LuckPerms 有一个别的组没有的特殊组：`default`。

- **所有玩家自动属于 `default` 组**。你可以把默认组理解成「基础层」——你不必给任何玩家单独加它，他们天然就在里面。
- 因此 `default` 组的权限要**最小、最保守**。它决定了「一个完全陌生的新玩家进服后能做什么」。
- `default` 组**删不掉**。LuckPerms 内部会拒绝删除它（插件里对删除默认组有专门的保护），所以你不用担心手滑把它删了——但也别指望用「删了重建」来清空它。

> 坑：很多人装完 LuckPerms 后，因为「反正只有我玩」，给 `default` 组直接上了 `*`（全部权限）。等服务器人多起来，这就是把管理员钥匙复印给了所有玩家。见 [安全加固：从裸奔到站稳](#/guide/security-hardening)。

### 推荐的四层模型

对绝大多数生存 / 社区服来说，**四层就够**，不要一开始就设计十层：

| 层级 | 组名建议 | 定位 | 权限特征 |
|------|---------|------|---------|
| 第 1 层 | `default` | 所有新玩家的基础层 | 最小基础命令（家、传送、聊天） |
| 第 2 层 | `member` / `vip` | 正式成员 / 付费或活跃玩家 | 在基础层上「多一点」（多几个家、飞行等） |
| 第 3 层 | `staff` / `helper` | 管理员、审核、建筑师 | 查询、封禁、区域管理类权限 |
| 第 4 层 | `admin` | 你和核心管理员 | 几乎全部权限 |

继承链要**由下往上**画，也就是「高权限组继承低权限组的全部权限」：

```
admin  ──继承──▶  staff  ──继承──▶  member/vip  ──继承──▶  default
 (最高)             (管理)             (正式玩家)            (所有玩家)
```

这样组出来的效果是：

- 给 `default` 加一条基础权限，**所有玩家立刻都有**；
- 给 `member` 加权限，`staff` 和 `admin` 自动也有，不用重复；
- 每个组的权限**只写自己比下一层多出来的部分**。

> 记住一句话：**权限沿着继承链「向上累加」**。下级有的上级一定也有，所以只需要写「增量」。

### 为什么不建议「平铺」

另一个常见错误是「平铺式」：每个组都把全部权限重写一遍。

```
❌ 平铺（各写各的，重复且难维护）
default : 家、传送、聊天、经济
vip     : 家、传送、聊天、经济、飞行、5个家
staff   : 家、传送、聊天、经济、飞行、查询、封禁
admin   : 家、传送、聊天、经济、飞行、查询、封禁、区域管理

✅ 继承（只写增量）
default : 家、传送、聊天、经济
vip     : 继承 default，+飞行、+5个家
staff   : 继承 vip，+查询、+封禁
admin   : 继承 staff，+区域管理
```

平铺的问题：想给「所有人」加一条权限，你要改全部 4 个组；漏改一个就出现「越权组反而没有基础权限」的怪现象。

> 进阶：LuckPerms 还有「轨道（track）」概念，可以把一组组按顺序排队，让玩家用 `/lp user <玩家> promote` 逐级晋级、`demote` 逐级降级。轨道适合「会员等级」这种线性升级，但四层以内的小服用「组 + 继承」就够了，不必强上轨道。

---

## 二、权限节点从哪来

设计模型之后，下一步是「我要给这个组哪些节点」。这一节教你**自己查证**，而不是抄别人的清单。

### 命名规律：插件名.功能

Bukkit 系服务器的权限节点（permission node）几乎都遵循同一个规律：

```
<插件名>.<功能>.<更细的功能>

essentials.sethome            → EssentialsX 的 /sethome 命令
essentials.sethome.multiple   → 允许设置多个家
worldguard.region.define      → WorldGuard 的 /rg define 命令
coreprotect.lookup            → CoreProtect 的查询命令
luckperms.command             → LuckPerms 的命令权限前缀
```

记住这个规律，你就能**猜出**大部分节点的写法，再去插件里核实。

### 最权威的来源：插件自带的 plugin.yml

**每个 Bukkit 插件的 jar 里都有一个 `plugin.yml`，它声明了这个插件的全部命令和权限节点。** 这是最权威的一手资料，比任何教程都准。

以本站已核对的几个插件为例（数据来自各自 jar 内的 `plugin.yml`）：

| 插件 | 版本 | 声明命令数 | 声明权限节点数 |
|------|------|-----------|--------------|
| EssentialsX | 2.22.0 | 153 条 | 400 余个顶层节点 |
| CoreProtect | 24.1 | `/co`、`/core`、`/coreprotect` | 28 个节点 |
| WorldGuard | 7.0.19 | —（权限节点在官方文档中，见下） | — |

看插件 jar 里的 `plugin.yml`，你会看到这样的结构（CoreProtect 24.1 实测）：

```yaml
# CoreProtect/plugin.yml（节选，原文核对）
permissions:
    coreprotect.*:
        description: Gives access to all CoreProtect actions and commands
        default: op
        children:
            coreprotect.rollback: true
            coreprotect.inspect: true
            coreprotect.lookup: true
            coreprotect.lookup.near: true
            coreprotect.lookup.container: true
            # ...
```

这里透露了两个关键信息：

1. **`coreprotect.*` 是个「父节点」**，它下面挂着 `children`（子节点）。给玩家 `coreprotect.*` 等于给了它所有子节点。
2. 每个节点还有 `default`（默认权限），`default: op` 意思是「OP 默认就有」。这直接关系到后面讲的 OP 问题。

### 通配符为什么能生效：apply-wildcards

你可能已经发现，很多人给权限是这么写的：

```bash
/lp group staff permission set essentials.* true
/lp group staff permission set worldguard.* true
```

一个 `*` 就代表「所有子节点」。这并不是插件自己实现的，而是 **LuckPerms 在解析时把通配符展开**的，由配置项控制：

```yaml
# plugins/LuckPerms/config.yml（官方默认值，已核对）
apply-wildcards: true     # 是否解析并应用通配权限（如 essentials.*）
apply-regex: true         # 是否解析并应用正则权限（r= 开头）
apply-shorthand: true     # 是否展开简写权限节点
```

> 坑：通配符是「前缀匹配」，不是「模糊匹配」。`essentials.kit.*` 只会匹配以 `essentials.kit.` 开头的节点。而 EssentialsX 里「某个具体 kit」的节点其实叫 **`essentials.kits.<kit名字>`（是复数的 kits）**——`plugin.yml` 里明确写着 `essentials.kits.<kit-name>`。所以想给玩家开全部 kit，应该给 `essentials.kits.*`，而不是想当然的 `essentials.kit.*`。这类「差一个字母」的坑，**唯一的解法就是回插件 `plugin.yml` 对照**。

### 「放宽限制」类节点：把上限交出去

有一类节点不控制「能不能用某个命令」，而是控制「限制放宽到多少」。这类节点最能体现权限系统的威力。

**WorldGuard 的 `worldguard.region.unlimited`**：官方文档定义为「Bypass claiming limits」（绕过创建区域的数量限制）。给建筑师组这个节点，他们就能不受区域数量上限约束地建区域。

**WorldGuard 的 `worldguard.region.bypass.<世界名>`**：官方文档定义为「Bypass region protection for a given world, except for PvP deny flags」（在指定世界绕过区域保护，PvP 禁用标志除外）。注意它后面要**带世界名**——这正是 LuckPerms「上下文（context）」的用途：同一个权限，在不同世界可以给不同的值。

> ⚠️ 重要警告（来自 WorldGuard 官方文档）：**如果你是 OP 或拥有全部权限，你会隐式拥有这些绕过保护权限，看起来就像「区域保护失效了」。** 测试区域保护时，请用一个没有 OP、没有 `*` 权限的小号去试，否则你会以为保护没生效。

**EssentialsX 的多个家**：EssentialsX 的默认配置里写得很清楚：

```yaml
# EssentialsX config.yml（原文，已核对）
# In this example, someone with 'essentials.sethome.multiple' and
# 'essentials.sethome.multiple.vip' will have 5 homes.
# Remember, they must have BOTH permission nodes in order to be able to set
# multiple homes.
sethome-multiple:
  default: 3
  vip: 5
  staff: 10
```

也就是说：想要「5 个家」，玩家必须**同时**拥有 `essentials.sethome.multiple` 和 `essentials.sethome.multiple.vip` 两个节点。这也是一个很容易漏的点。

### 反查节点：`/lp verbose`

当你不知道「玩家点了这个命令，服务器到底在检查哪个权限」时，用 LuckPerms 的 verbose 模式实时捕捉：

```
/lp verbose on essentials
```

打开后，你面前会实时刷出「谁、在什么上下文、请求了哪个权限节点、结果是 true 还是 false」。玩家复现一次操作，你就能看到它检查的节点名。

```
/lp verbose off          # 关闭
/lp verbose record       # 把匹配到的检查记录到文件，适合事后分析
/lp verbose upload       # 把记录上传，生成可分享的分析链接
```

`/lp verbose <on|record|off|upload> [filter]` 就是它的完整用法（`filter` 只留包含该关键词的检查，能大幅减少刷屏）。

除此之外，还有一个更直接的方法：查某个插件**自己的文档/wiki**。但文档可能过期，**jar 里的 `plugin.yml` 永远是当前版本的真相**。

---

## 三、动手：从零搭一套

模型和节点都想清楚了，就可以落命令了。假设我们用第一节的四层模型：`default → member → vip → staff → admin`。

### 1. 创建组

```bash
/lp creategroup default     # 若已存在会提示；default 通常开箱自带
/lp creategroup member
/lp creategroup vip
/lp creategroup staff
/lp creategroup admin
```

### 2. 设置继承（parent add）

继承是「让上级组获得下级组的一切权限」：

```bash
/lp group member parent add default   # member 继承 default
/lp group vip    parent add member    # vip 继承 member（也间接继承 default）
/lp group staff  parent add vip
/lp group admin  parent add staff
```

画出来就是一条链：

```
admin → staff → vip → member → default
```

> 为什么让 `vip` 继承 `member`、而不是直接继承 `default`？因为这样你在 `member` 里加的任何权限，`vip` 都能自动获得，不用重复维护。

### 3. 设置权重（setweight）

权重（weight）有两个作用：

1. **决定「主组」（primary group）**。LuckPerms 默认配置 `primary-group-calculation: parents-by-weight`，意思是「取权重最高的父组作为主组」。很多聊天/前缀插件读的是主组。
2. **决定前缀/后缀的叠加顺序**。默认配置里前缀格式是 `highest`（见下节），会取权重最高的那个前缀。

```bash
/lp group default setweight 0
/lp group member  setweight 10
/lp group vip     setweight 50
/lp group staff   setweight 100
/lp group admin   setweight 1000
```

> 习惯上让「级别越高，数字越大」。数字本身没有单位，只看相对大小。

### 4. 设置前缀 / 后缀（meta setprefix / addsuffix）

`meta setprefix` 的第一个参数是**优先级（priority）**，它就是这个前缀的权重，用于多个前缀叠加时决定谁胜出：

```bash
/lp group default meta setprefix 10  "&7[玩家] "
/lp group vip     meta setprefix 50  "&6[VIP] "
/lp group staff   meta setprefix 100 "&a[管理] "
```

想同时显示多个前缀/后缀时，用 `addprefix` / `addsuffix` 追加：

```bash
/lp group vip meta addsuffix 50 " &b★"
```

前缀的叠加规则由 config.yml 的 `meta-formatting` 控制，官方默认是：

```yaml
meta-formatting:
  prefix:
    format:
      - "highest"        # 取权重最高的前缀
    duplicates: first-only
```

也就是说，默认情况下 **最终只会显示权重最高的那一个前缀**。想让多个前缀同时出现，需要把 `format` 改成包含多个条目（如 `["highest", "highest"]`）或改用 `addprefix` 系列。

另外还有 `setdisplayname`，它设置的是「组的显示名」，和聊天前缀是**两回事**（Vault 会读取它，聊天格式插件用的才是 prefix）：

```bash
/lp group vip setdisplayname "&6VIP"
```

### 5. 给组配权限（增量）

每个组只写「比下一层多出来的部分」：

```bash
# ── default：所有玩家（最小基础） ──
/lp group default permission set essentials.sethome true
/lp group default permission set essentials.home true
/lp group default permission set essentials.tpa true
/lp group default permission set essentials.tpaccept true
/lp group default permission set essentials.msg true
/lp group default permission set essentials.spawn true

# ── member：正式成员（+3 个家） ──
/lp group member permission set essentials.sethome.multiple true
/lp group member permission set essentials.sethome.multiple.default true

# ── vip：V（+飞行、+5 个家） ──
/lp group vip permission set essentials.fly true
/lp group vip permission set essentials.sethome.multiple.vip true

# ── staff：管理（+查询、+封禁、+区域管理） ──
/lp group staff permission set essentials.kick true
/lp group staff permission set essentials.mute true
/lp group staff permission set coreprotect.lookup true
/lp group staff permission set coreprotect.inspect true
/lp group staff permission set worldguard.region.list true

# ── admin：几乎全部 ──
/lp group admin permission set luckperms.* true
```

> 注意 `essentials.sethome.multiple.default` 与 `essentials.sethome.multiple.vip`：因为 `vip` 继承了 `member`，它会同时拥有 `default`（3）和 `vip`（5）两个节点，而 EssentialsX 取**上限值**，所以 VIP 最终是 5 个家。这正是继承 + 分级节点的组合效果。

### 6. 把自己放进 admin

```bash
/lp user <你的游戏名> parent add admin
```

### 7. 可视化编辑：`/lp editor`

命令敲累了？LuckPerms 提供了一个网页权限编辑器：

```
/lp editor
```

执行后聊天栏会打出一个**在线编辑器链接**（指向 `https://luckperms.net/editor/…`，由插件现场生成一个带权限的会话）。用浏览器打开，就能用图形界面拖拽式地编辑整个权限树。

- 编辑完成后在网页上点保存，改动会通过链路回传服务器；
- 如果网页和服务器断开了，会生成一个「编辑代码」，在游戏里执行 `/lp applyedits <代码>` 手动应用。

> 编辑器链接里带着访问凭证，**只发给你信任的管理员**，别往公开群聊里发。

---

## 四、排查与坑

权限系统出问题，90% 是下面这几种。先看症状表，再看逐条解释。

| 症状 | 最可能的原因 | 处理 |
|------|------------|------|
| 给了权限却不生效 | 玩家是 OP，或另有权限插件 | 见「OP 三开关」 |
| 命令里玩家名无效 | 玩家从未进过服，名字查不到 UUID | 改用 UUID，或开 uuid 缓存 |
| 改了配置不生效 | 改了 `config.yml` 却只改了数据 | 数据改动实时生效；配置改动才需 `/lp reloadconfig` |
| 上级组拿不到下级权限 | 继承方向写反了 | 确认是 `上级 parent add 下级` |
| 前缀显示的不是想要的那个 | 权重没设 / 有多个同权重前缀 | 调 `setweight` 或 `meta setprefix` 的优先级 |
| 区域保护「失效」 | 测试账号是 OP / 有 `*` | 换无 OP 小号测试 |

### `/lp verbose`：看权限到底从哪来

前面提过它的开启方式，这里讲怎么看结果。verbose 输出会明确告诉你：

- 玩家请求的是**哪个权限节点**；
- 这个结果是 `true` 还是 `false`；
- 这个结果**来自哪个组 / 哪条直接权限。**

当你遇到「我明明给了，怎么还是不行」，打开 verbose 复现一次，就能看到请求的节点名和实际结果——**常常是你给的节点名和插件要的节点名差了那么一点**（比如复数 `kits` 写成了 `kit`）。

### OP 三开关：玩家的权限为什么「比你以为的多」

很多人不理解为啥「给玩家加了受限权限，他还是能飞」。问题往往出在 OP 上。LuckPerms 有三个和 OP 有关的开关，含义完全不同：

| 配置项 | 默认值 | 真实含义 |
|--------|--------|---------|
| `enable-ops` | `true` | 「服务器里到底允不允许存在 OP」。设为 `false` 会**取消所有人的 OP** 并禁用 `/op`、`/deop` |
| `auto-op` | `false` | 设为 `true` 后，改为「拥有 `luckperms.autoop` 权限的人自动获得 OP」；**开启它同时会强制把 `enable-ops` 置为 false** |
| `commands-allow-op` | `true` | 「OP 是否默认能用全部 LuckPerms 命令」。设 `false` 则只有被授予 LP 命令权限的人才能用 |

关键点：

- **OP 会绕过很多权限检查**（Bukkit 会给 OP 授予那些 `default: op` 的权限），所以「测试账号是 OP」是排查权限问题时的头号假象。
- 安全建议：把 `auto-op` 设为 `true`，用 `luckperms.autoop` 权限节点来精确控制谁能有 OP，而不是随手 `/op`。官方配置注释里也明确推荐这个做法。
- 别忘了 `commands-allow-op: true` 意味着「任何 OP 都能用全部 LuckPerms 命令」——如果你不希望某个挂 OP 的玩家能改权限，把它设成 `false`。

### 用 UUID，而不是名字

LuckPerms 的数据是**按 UUID 存储**的。用名字操作时，服务器得先把「名字 → UUID」查出来。默认配置 `use-server-uuid-cache: false` 时，如果某个玩家**从没在你装了 LuckPerms 之后进过服**，命令里写他的名字就会失败。

解决方式：

- 让该玩家先进一次服（最省事）；
- 或者在命令里直接写他的 UUID；
- 或者把 `use-server-uuid-cache` 设为 `true`（会尝试用服务端缓存 / Mojang API 查名字）。

> 玩家的游戏名可以改，UUID 不会变。**长期运营的服务器，认 UUID 才不会因为改名「丢权限」。**

### 改完为什么不建议直接重启

LuckPerms 的权限数据改动是**实时生效**的——加一条权限、建一个组，立刻就对在线的玩家起作用，不需要 `/reload`，更不需要重启服务器。默认配置里 `auto-push-updates: true` 会让改动自动推送到所有连接的服务器。

真正需要「重载」的只有一种情况：你**手动编辑了 `config.yml`**。这时用：

```bash
/lp reloadconfig
```

> 常见误区：`/lp reload` 并不是 LuckPerms 的有效命令。想重载配置请用 `/lp reloadconfig`。（更早版本的教程里可能出现过别的写法。）

### `default` 组被误删了怎么办

好消息：**删不掉**。LuckPerms 对默认组有专门保护，执行删除时会直接报「Cannot delete the default group.」

但「不能删」不代表「不能改乱」。如果你把 `default` 组的权限改得一塌糊涂，可以这样善后：

```bash
# 查看 default 组当前有哪些权限
/lp group default permission info

# 清空 default 组的全部权限，再重新配
/lp group default permission clear

# 清空后再按第一节的清单重新加基础权限
/lp group default permission set essentials.sethome true
# ...
```

### 和 Vault 的关系

新手常问：「我装了 Vault，是不是就不用 LuckPerms 了？」不是。

- **LuckPerms 不依赖 Vault**。恰恰相反，它的 `plugin.yml` 里声明了 `loadbefore: [Vault]`，也就是**先于 Vault 加载**。官方注释解释了原因：这样所有依赖 Vault 的插件在启用时，才能拿到 LuckPerms 已经注册好的权限服务。
- Vault 本身**不提供权限**，它是一个「接口规范」。其他插件通过 Vault 这个统一接口去问「这个玩家有没有某权限」，而真正回答问题的还是 LuckPerms。
- 所以：**LuckPerms 管权限，Vault 只是转接插件的桥梁。** 两者是配合关系，不是替代关系。

> 由于 LuckPerms 先于 Vault 加载，如果你遇到「某插件读不到权限」，先检查是不是加载顺序被别的插件打乱了。

---

## 五、一页速查表：常见场景 → 命令

> 用 `<玩家>` / `<组>` 占位，实际执行时替换。控制台执行不需要前缀 `/`。

| 我想… | 命令 |
|------|------|
| 给某个玩家**单独**开飞行 | `/lp user <玩家> permission set essentials.fly true` |
| 撤销某个玩家的飞行 | `/lp user <玩家> permission unset essentials.fly true` |
| 把 `vip` 组的家上限提到 5 个 | `/lp group vip permission set essentials.sethome.multiple true` 然后 `/lp group vip permission set essentials.sethome.multiple.vip true` |
| 让 `staff` 组能列出所有区域 | `/lp group staff permission set worldguard.region.list true` |
| 让 `staff` 不受区域数量限制 | `/lp group staff permission set worldguard.region.unlimited true` |
| 让 `staff` 在 `world` 世界绕过区域保护 | `/lp group staff permission set worldguard.region.bypass.world true` |
| 让 `staff` 能查询 + 回滚方块记录 | `/lp group staff permission set coreprotect.lookup true` 及 `coreprotect.inspect`、`coreprotect.rollback` |
| 给某人临时 7 天 VIP | `/lp user <玩家> parent addtemp vip 7d` |
| 把某人移出某个组 | `/lp user <玩家> parent remove <组>` |
| 查看某玩家当前的全部权限 | `/lp user <玩家> info` |
| 检查某玩家是否有某权限 | `/lp user <玩家> permission check <权限节点>` |
| 查看整棵权限树 | `/lp tree` |
| 查看某个组有哪些成员 | `/lp group <组> listmembers` |
| 重载配置（改了 config.yml 后） | `/lp reloadconfig` |
| 手动推送改动到其他服务器 | `/lp networksync` |

> 临时权限（`addtemp` / `settemp`）支持时长格式，如 `7d`（7 天）、`12h`（12 小时）、`30m`（30 分钟）。

---

## 下一步

- 刚装好权限插件，想先跑通一遍完整流程？→ [插件组合：按服务器类型直接抄](#/guide/plugin-combos) 里有可直接复制的基础权限组模板
- 想把「权限最小化」和安全加固一起做？→ [安全加固：从裸奔到站稳](#/guide/security-hardening) 讲清了 OP、反向权限与高危节点
- 想深入 LuckPerms 的存储方式与多服务器同步？→ [LuckPerms 插件详情](#/plugin/luckperms) 有 5.5.85 的安装、汉化与配置说明
