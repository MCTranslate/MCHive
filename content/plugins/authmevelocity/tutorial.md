---
id: authmevelocity
name: AuthMeVelocity
description: AuthMeReloaded 的 Velocity 代理端组件 — 让玩家在登录前不能执行命令或发言，跨服时不用反复登录，附带 FastLogin 自动登录支持。装在代理端，后端仍需装 AuthMe。
category: 安全管理
version: AuthMeVelocity（MC 1.8 - 3.4）
tags: [登录, 验证, AuthMe, Velocity, 代理端, 跨服]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
downloads: []
---

## AuthMeVelocity 安装教程

### 1. ⚠️ 先纠正一个常见误解

**AuthMeVelocity 不是「登录插件」。** 它自己不做任何认证。

| 组件 | 跑在哪 | 干什么 |
|------|--------|--------|
| **AuthMeReloaded** | 后端 Spigot / Paper / Folia | 真正的注册、登录、改密、找回密码 |
| **AuthMeVelocity** | **Velocity 代理端** + 后端 | 解决代理环境下 AuthMe 的一系列问题 |

分工搞清了，装的顺序就清楚了。

### 2. 它解决什么问题

单服 AuthMe 一切正常。**一旦上代理，问题就来了：**

| 问题 | 现象 | AuthMeVelocity 怎么解 |
|------|------|------------------|
| 登录前能执行命令 | 玩家还没 `/login` 就 `/op`、`/home`、任意插件命令 | 代理端直接拦下，未认证不转发命令 |
| 登录前能打字 | 未登录刷屏 | 拦截聊天输入 |
| 进错服 | 玩家直连到小游戏服，那服没装 AuthMe，直接免登录白嫖 | 强制首个进入的服必须是认证服 |
| 跨服重复登录 | 玩家登录后切服，被要求重新登录 | 代理端记住认证状态 |
| 原生切服登录有 bug | AuthMe 自带的「登录后送到某服」逻辑本身有问题 | 接管这个流程 |

> 最后一条是重点：**AuthMe 原生的跨服跳转功能自己带 bug**，AuthMeVelocity 的存在很大程度是为了绕开它。

### 3. ⚠️ 版本区间数据说明（重要）

本站记录的区间是 **MC 1.8 - 3.4**，但 **`3.4` 明显不是 Minecraft 版本**——它是 **Velocity 的版本要求**（`Velocity 3.4.0+`）。

真实的硬性要求以官方 README 为准：

| 项目 | 要求 |
|------|------|
| 代理端 | **Velocity 3.4.0+** |
| 后端 | **Paper / Folia 1.21.5+** |
| Java | **21+** |

**这个区间来自注册表元数据，可能不准确，以官方页面为准。**

⚠️ 注意这个组合比看起来挑：**「MC 1.8 起」和「后端 1.21.5+ / Java 21」是矛盾的**。低版本 MC 服务端跑不了 Java 21 + Paper 1.21.5 这一套。如果你真的要跑 1.8 后端，这个插件的当前版本大概率用不了。

### 4. 安装：两个 jar，别只装一个

插件有**两个构建**，各有用途，缺一不可：

```
代理端：AuthMeVelocity-Proxy  → Velocity 的 plugins/ 目录
后端端：AuthMeVelocity-Paper  → 每个装了 AuthMe 的 Paper 服务端的 plugins/ 目录
```

安装顺序：

1. 所有装了 AuthMe 的后端 Paper 装 **AuthMeVelocity-Paper**
2. Velocity 代理装 **AuthMeVelocity-Proxy**
3. **全部重启**（不是 /reload）
4. 启动 Velocity，按提示配置 `config.conf` 里的**认证服列表**

第 4 步不能跳：**`config.conf` 里的认证服列表决定了哪些服被当作「必须先登录」的服**。没配好就等于没生效。

官方发行页：Modrinth 搜 `authmevelocity`。

### 5. 附属能力

| 能力 | 说明 |
|------|------|
| AuthMe API | 代理端也能访问 AuthMe 的 API |
| FastLogin 兼容 | 配合 FastLogin 在代理端做自动登录（正版玩家免输密码） |
| MiniPlaceholders 兼容 | 两边互相提供占位符 |

**FastLogin 这条值得单独说**：如果你装了 FastLogin，正版玩家可以自动完成认证，AuthMeVelocity 负责在代理端正确处理这个流程。**只用 AuthMe 不用 FastLogin 的话，这条没用。**

**要不要上 FastLogin 是个安全权衡**：自动登录体验好，但它把认证责任往代理端挪了一步。只在受信任的代理后面开。

### 6. 常见问题

**装完还是能未登录执行命令**
检查三件事：认证服列表配了没；代理端 jar 是不是真放进了 Velocity 的 `plugins/`；是不是只 `/reload` 了。**必须完整重启。**

**玩家被反复要求登录**
认证服列表里的服和实际路由对不上。玩家进的服没被标记为认证服，或者列表里加了你已经下线的服。

**后端装了 AuthMeVelocity-Paper 但不生效**
确认后端 Paper 版本满足要求（1.21.5+），Java 21。**这个插件的版本要求比 AuthMe 本身高得多**。

**FastLogin 没起作用**
FastLogin 必须装在**代理端**。只在后端装没有效果。

**Velocity 版本不够装不上**
`Velocity 3.4.0+` 是硬要求。版本低就得升 Velocity。

**配置改完不生效**
`config.conf` 在代理端。改完重启代理。

### 7. 常见坑

> ⚠️ **版本要求是最容易踩的坑。** 官方要求 Java 21+、Velocity 3.4+、后端 Paper/Folia 1.21.5+。你现在的服如果还停在老版本、老 Java，**先升服务端，再考虑这个插件**。很多「装了不工作」其实是版本没到位。

> ⚠️ **别只在后端装。** 只装 AuthMeVelocity-Paper 而不装 Proxy 端，跨服跳转问题和未登录命令问题依然存在，而且现象会显得莫名其妙——单服测试完全正常，一上群组就出问题。

> ⚠️ **`config.conf` 的认证服列表是核心配置，不是可选装饰。** 这是它「强制首个服必须是认证服」这条能力的开关，漏了它等于放弃了一半功能。

### 8. 什么时候别用它

- **单服，没有代理** → 装 AuthMeReloaded 就够了，别加这个复杂度
- **服务端版本低于 1.21.5 或 Java 低于 21** → 当前版本用不了
- **没有多服切换需求** → 它解决的核心问题你可能一个都没有

### 9. 关于汉化

**没有核实到 AuthMeVelocity 的官方中文语言文件机制。**

这个插件的界面提示面很窄——它主要在后台拦命令，本来就没什么玩家可见文本。**汉化优先级很低。**

引导式排查：

1. 解压 jar 看 `resources/` 下有无语言资源
2. 启动后在代理 `plugins/` 下找它生成的目录里有没有语言相关文件
3. 玩家实际能看到什么文本，来源多半是**后端 AuthMe 的语言文件**，不是这个插件——要去汉化的话，方向应该是 AuthMe 那边

> 如果你的目标是汉化登录相关提示，**看错了插件**。该查的是 AuthMeReloaded。

## 下一步

- 登录之后怎么防小号 → [账号安全](#/guide/account-security)
- 代理端还有哪些能装的东西 → [Velocity 网络](#/guide/velocity-network)
- 权限节点怎么规划 → [权限系统设计](#/guide/permissions-design)
