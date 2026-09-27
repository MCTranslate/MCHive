<script setup>
import { ref, computed } from 'vue'

// ═══════════ 输入状态 ═══════════

const jarName = ref('paper-26.3.jar')
const memoryGB = ref(8)
const javaVersion = ref(25)
const gcMode = ref('g1')
const useNogui = ref(true)
const copiedType = ref('')

const javaVersions = [
  { value: 25, label: 'Java 25（Paper 26.x 推荐）' },
  { value: 21, label: 'Java 21 LTS（Paper 1.21.x）' },
  { value: 17, label: 'Java 17 LTS（旧版服务端）' }
]

const gcModes = [
  {
    value: 'g1',
    label: 'G1GC（Aikar 参数）',
    desc: '最经过实战验证的 GC 方案，Aikar 参数专为 Minecraft 内存分配模式优化。推荐大多数服务器使用。'
  },
  {
    value: 'zgc',
    label: 'ZGC（分代模式）',
    desc: '更低停顿，适合 12GB+ 大内存服务器。Java 21+ 支持分代模式，Java 23+ 为默认。吞吐略低于 G1GC 但延迟更稳定。'
  },
  {
    value: 'shenandoah',
    label: 'Shenandoah',
    desc: '低停顿收集器，Red Hat 主导开发。与 ZGC 目标类似但实现不同。部分 JDK 发行版可能不包含。'
  }
]

// ═══════════ GC 模式标签 ═══════════

const gcLabel = computed(() => {
  const mode = gcModes.find(m => m.value === gcMode.value)
  return mode ? mode.label : gcMode.value
})

// ═══════════ 参数生成 ═══════════

const memoryFlags = computed(() => [
  `-Xms${memoryGB.value}G`,
  `-Xmx${memoryGB.value}G`
])

const commonFlags = computed(() => [
  '-XX:+AlwaysPreTouch',
  '-XX:+DisableExplicitGC'
])

const gcFlags = computed(() => {
  const f = []
  const large = memoryGB.value >= 12

  if (gcMode.value === 'g1') {
    f.push('-XX:+UseG1GC')
    f.push('-XX:+ParallelRefProcEnabled')
    f.push('-XX:MaxGCPauseMillis=200')
    f.push('-XX:+UnlockExperimentalVMOptions')
    f.push(`-XX:G1NewSizePercent=${large ? 40 : 30}`)
    f.push(`-XX:G1MaxNewSizePercent=${large ? 50 : 40}`)
    f.push(`-XX:G1HeapRegionSize=${large ? '16M' : '8M'}`)
    f.push(`-XX:G1ReservePercent=${large ? 15 : 20}`)
    f.push('-XX:G1HeapWastePercent=5')
    f.push('-XX:G1MixedGCCountTarget=4')
    f.push('-XX:InitiatingHeapOccupancyPercent=15')
    f.push('-XX:G1MixedGCLiveThresholdPercent=90')
    f.push('-XX:G1RSetUpdatingPauseTimePercent=5')
    f.push('-XX:SurvivorRatio=32')
    f.push('-XX:+PerfDisableSharedMem')
    f.push('-XX:MaxTenuringThreshold=1')
    f.push('-Dusing.aikars.flags=https://mcflags.emc.gs')
    f.push('-Daikars.new.flags=true')
  } else if (gcMode.value === 'zgc') {
    f.push('-XX:+UseZGC')
    if (javaVersion.value >= 21 && javaVersion.value <= 22) {
      f.push('-XX:+ZGenerational')
    }
    f.push('-XX:+UnlockExperimentalVMOptions')
  } else if (gcMode.value === 'shenandoah') {
    f.push('-XX:+UseShenandoahGC')
    f.push('-XX:+UnlockExperimentalVMOptions')
  }

  return f
})

const allFlags = computed(() => [
  ...memoryFlags.value,
  ...commonFlags.value,
  ...gcFlags.value
])

// ═══════════ 脚本生成 ═══════════

const jarArg = computed(() => `-jar ${jarName.value || 'server.jar'}`)
const noguiArg = computed(() => useNogui.value ? ' --nogui' : '')

const batScript = computed(() => {
  const lines = [
    '@echo off',
    'title Minecraft Server',
    '',
    `rem ===== JVM 参数（由 MCHive 脚本生成器生成）=====`,
    `rem Java ${javaVersion.value} | GC: ${gcLabel.value} | 内存: ${memoryGB.value} GB`,
    '',
    'java ^',
    ...allFlags.value.map((f, i) => `  ${f} ^`),
    `  ${jarArg.value} ^`,
    `  --nogui`,
    '',
    'pause'
  ]
  return lines.join('\n')
})

const shScript = computed(() => {
  const lines = [
    '#!/bin/bash',
    'cd "$(dirname "$0")"',
    '',
    `# ===== JVM 参数（由 MCHive 脚本生成器生成）=====`,
    `# Java ${javaVersion.value} | GC: ${gcLabel.value} | 内存: ${memoryGB.value} GB`,
    '',
    'java \\',
    ...allFlags.value.map(f => `  ${f} \\`),
    `  ${jarArg.value} \\`,
    `  --nogui`
  ]
  return lines.join('\n')
})

// ═══════════ 复制功能 ═══════════

async function copyScript(type) {
  const text = type === 'bat' ? batScript.value : shScript.value
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copiedType.value = type
  setTimeout(() => { copiedType.value = '' }, 1500)
}

// ═══════════ 参数说明数据 ═══════════

const flagExplanations = computed(() => {
  const base = [
    { flag: `-Xms${memoryGB.value}G`, desc: '初始堆内存。设为与 -Xmx 相同可避免运行时扩展' },
    { flag: `-Xmx${memoryGB.value}G`, desc: '最大堆内存。超过此值会触发 OutOfMemoryError' },
    { flag: '-XX:+AlwaysPreTouch', desc: '启动时预先触碰所有内存页，避免运行时缺页中断造成卡顿' },
    { flag: '-XX:+DisableExplicitGC', desc: '禁止插件调用 System.gc() 触发 Full GC' },
  ]

  if (gcMode.value === 'g1') {
    const large = memoryGB.value >= 12
    base.push(
      { flag: '-XX:+UseG1GC', desc: '使用 G1 垃圾回收器（Garbage First）' },
      { flag: '-XX:+ParallelRefProcEnabled', desc: '并行处理引用，减少 Reference 处理时间' },
      { flag: '-XX:MaxGCPauseMillis=200', desc: 'GC 停顿目标 200 毫秒' },
      { flag: `-XX:G1NewSizePercent=${large ? 40 : 30}`, desc: `新生代最小占比（${large ? '大堆模式' : '标准模式'}）` },
      { flag: `-XX:G1MaxNewSizePercent=${large ? 50 : 40}`, desc: `新生代最大占比` },
      { flag: `-XX:G1HeapRegionSize=${large ? '16M' : '8M'}`, desc: `G1 区域大小（${large ? '大堆用 16M 减少区域数量' : '标准 8M'}）` },
      { flag: `-XX:G1ReservePercent=${large ? 15 : 20}`, desc: '预留堆空间，防止晋升失败（to-space exhaustion）' },
      { flag: '-XX:G1MixedGCLiveThresholdPercent=90', desc: '存活对象超过 90% 的区域不参与 Mixed GC' },
      { flag: '-XX:InitiatingHeapOccupancyPercent=15', desc: '堆占用达 15% 时启动并发标记' },
      { flag: '-XX:MaxTenuringThreshold=1', desc: '对象存活 1 次 GC 后晋升老年代（MC 对象要么很快死亡要么长期存活）' },
      { flag: '-XX:+PerfDisableSharedMem', desc: '禁用共享内存性能数据（避免磁盘 I/O 开销）' },
    )
  } else if (gcMode.value === 'zgc') {
    base.push(
      { flag: '-XX:+UseZGC', desc: '使用 ZGC 垃圾回收器（低停顿，着色指针）' },
      { flag: '-XX:+ZGenerational', desc: '启用分代 ZGC（Java 21-22 需显式开启，Java 23+ 为默认）' },
    )
  } else if (gcMode.value === 'shenandoah') {
    base.push(
      { flag: '-XX:+UseShenandoahGC', desc: '使用 Shenandoah 垃圾回收器（低停顿，Brooks 转发指针）' },
    )
  }

  return base
})
</script>

<template>
  <div class="script-generator">
    <!-- 头部 -->
    <header class="sg-header">
      <span class="sg-kicker">TOOL / JVM STARTUP SCRIPT</span>
      <h1>JVM 启动脚本生成器</h1>
      <p>根据你的 Java 版本、内存大小和 GC 模式，自动生成 Windows 与 Linux 的优化启动脚本。所有参数均经官方文档核实。</p>
    </header>

    <div class="sg-layout">
      <!-- ═══ 配置面板 ═══ -->
      <section class="sg-form glass-card" aria-label="配置选项">
        <h2>配置</h2>

        <!-- JAR 文件名 -->
        <div class="sg-field">
          <label for="sg-jar">JAR 文件名</label>
          <input id="sg-jar" type="text" v-model="jarName" placeholder="server.jar" />
          <small>你下载的服务端 jar 文件名</small>
        </div>

        <!-- 内存 -->
        <div class="sg-field">
          <label for="sg-mem">内存分配</label>
          <div class="sg-mem-row">
            <input id="sg-mem" type="range" v-model.number="memoryGB" min="2" max="32" step="1" />
            <output class="sg-mem-value">{{ memoryGB }} GB</output>
          </div>
          <small>建议：10 人以内 4-6 GB，10-30 人 8-12 GB，30+ 人 12-16 GB</small>
        </div>

        <!-- Java 版本 -->
        <div class="sg-field">
          <label for="sg-java">Java 版本</label>
          <select id="sg-java" v-model.number="javaVersion">
            <option v-for="jv in javaVersions" :key="jv.value" :value="jv.value">{{ jv.label }}</option>
          </select>
          <small>Paper 26.x 需要 Java 25+；1.21.x 需要 Java 21+</small>
        </div>

        <!-- GC 模式 -->
        <div class="sg-field">
          <label>GC 模式</label>
          <div class="sg-gc-options" role="radiogroup" aria-label="GC 模式">
            <label v-for="mode in gcModes" :key="mode.value" class="sg-gc-option" :class="{ selected: gcMode === mode.value }">
              <input type="radio" v-model="gcMode" :value="mode.value" name="gc-mode" />
              <div>
                <b>{{ mode.label }}</b>
                <small>{{ mode.desc }}</small>
              </div>
            </label>
          </div>
        </div>

        <!-- nogui -->
        <div class="sg-field sg-field-inline">
          <label class="sg-checkbox">
            <input type="checkbox" v-model="useNogui" />
            <span>添加 <code>--nogui</code> 参数（不启动图形界面）</span>
          </label>
          <small>服务器/面板环境推荐勾选</small>
        </div>
      </section>

      <!-- ═══ 输出面板 ═══ -->
      <section class="sg-output" aria-label="生成的脚本">
        <!-- Windows -->
        <div class="sg-script-block">
          <div class="sg-script-head">
            <span class="sg-script-title">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/></svg>
              Windows · start.bat
            </span>
            <button class="sg-copy-btn" :class="{ copied: copiedType === 'bat' }" @click="copyScript('bat')" type="button">
              {{ copiedType === 'bat' ? '✓ 已复制' : '复制' }}
            </button>
          </div>
          <pre class="sg-code"><code>{{ batScript }}</code></pre>
        </div>

        <!-- Linux -->
        <div class="sg-script-block">
          <div class="sg-script-head">
            <span class="sg-script-title">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6M12 19h8"/></svg>
              Linux · start.sh
            </span>
            <button class="sg-copy-btn" :class="{ copied: copiedType === 'sh' }" @click="copyScript('sh')" type="button">
              {{ copiedType === 'sh' ? '✓ 已复制' : '复制' }}
            </button>
          </div>
          <pre class="sg-code"><code>{{ shScript }}</code></pre>
        </div>
      </section>
    </div>

    <!-- ═══ 参数说明 ═══ -->
    <section class="sg-explanations glass-card" aria-label="参数说明">
      <h2>参数说明</h2>
      <p>下面列出当前配置生成的每个参数及其含义。了解它们的作用有助于你根据服务器实际情况微调。</p>

      <div class="sg-flag-table">
        <div v-for="item in flagExplanations" :key="item.flag" class="sg-flag-row">
          <code class="sg-flag-name">{{ item.flag }}</code>
          <span class="sg-flag-desc">{{ item.desc }}</span>
        </div>
      </div>

      <div class="sg-notes">
        <h3>使用提示</h3>
        <ul>
          <li><b>-Xms 与 -Xmx 设为相同值</b>可避免运行时堆扩展造成的卡顿</li>
          <li>改完参数后需要<b>重启服务器</b>才能生效（JVM 参数只在启动时读取）</li>
          <li>使用 ZGC 时，<b>Java 23+ 默认启用分代模式</b>，无需额外添加 <code>-XX:+ZGenerational</code></li>
          <li>Shenandoah 在 <b>Oracle JDK 中不可用</b>，需要使用 OpenJDK 或 Temurin 等发行版</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.script-generator {
  width: min(1080px, calc(100% - 48px));
  margin: 0 auto;
  padding: 28px 0 72px;
}

/* ── 头部 ── */
.sg-header { margin-bottom: 28px; }
.sg-kicker { color: var(--accent-strong); font: 10px var(--font-mono); letter-spacing: 1.5px; text-transform: uppercase; }
.sg-header h1 { margin-top: 10px; font-size: clamp(24px, 4vw, 36px); font-weight: 700; letter-spacing: -.5px; color: var(--text-primary); }
.sg-header p { max-width: 680px; margin-top: 8px; color: var(--text-muted); font-size: 13px; line-height: 1.8; }

/* ── 布局 ── */
.sg-layout { display: grid; grid-template-columns: 340px 1fr; gap: 24px; align-items: start; }
@media (max-width: 860px) { .sg-layout { grid-template-columns: 1fr; } }

/* ── 表单 ── */
.sg-form { padding: 20px 22px; border-radius: var(--radius); }
.sg-form h2 { margin: 0 0 16px; font-size: 15px; font-weight: 650; color: var(--text-primary); }
.sg-field { margin-bottom: 18px; }
.sg-field:last-child { margin-bottom: 0; }
.sg-field > label { display: block; margin-bottom: 6px; color: var(--text-secondary); font-size: 12px; font-weight: 600; }
.sg-field input[type="text"], .sg-field select {
  width: 100%; padding: 9px 12px;
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  background: var(--surface); color: var(--text-primary);
  font-size: 13px; outline: none; transition: border-color .2s;
}
.sg-field input[type="text"]:focus, .sg-field select:focus { border-color: var(--accent); }
.sg-field small { display: block; margin-top: 5px; color: var(--text-muted); font-size: 11px; line-height: 1.5; }
.sg-field-inline { display: flex; flex-direction: column; gap: 4px; }

/* 内存滑块 */
.sg-mem-row { display: flex; align-items: center; gap: 12px; }
.sg-mem-row input[type="range"] { flex: 1; accent-color: var(--accent); }
.sg-mem-value { min-width: 52px; text-align: right; font: 14px var(--font-mono); font-weight: 600; color: var(--accent); }

/* GC 选项 */
.sg-gc-options { display: flex; flex-direction: column; gap: 8px; }
.sg-gc-option {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm);
  background: var(--surface); cursor: pointer; transition: all .18s;
}
.sg-gc-option:hover { border-color: var(--accent); }
.sg-gc-option.selected { border-color: var(--accent); background: var(--accent-dim); }
.sg-gc-option input { margin-top: 3px; accent-color: var(--accent); }
.sg-gc-option b { display: block; color: var(--text-primary); font-size: 13px; }
.sg-gc-option small { display: block; margin-top: 3px; color: var(--text-muted); font-size: 11px; line-height: 1.5; }

/* 复选框 */
.sg-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.sg-checkbox input { accent-color: var(--accent); }
.sg-checkbox span { color: var(--text-secondary); font-size: 12px; }
.sg-checkbox code { padding: 1px 5px; border: 1px solid var(--border); border-radius: 4px; background: var(--surface); color: var(--accent-strong); font: 11px var(--font-mono); }

/* ── 输出面板 ── */
.sg-output { display: flex; flex-direction: column; gap: 16px; }
.sg-script-block {
  border: 1px solid var(--glass-border); border-radius: var(--radius);
  overflow: hidden; background: var(--bg-secondary);
  box-shadow: var(--shadow);
}
.sg-script-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.sg-script-title { display: flex; align-items: center; gap: 8px; color: var(--text-primary); font-size: 12px; font-weight: 600; }
.sg-script-title svg { color: var(--accent); }
.sg-copy-btn {
  padding: 4px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm);
  background: var(--surface-hover); color: var(--text-secondary);
  font-size: 11px; cursor: pointer; transition: all .15s;
}
.sg-copy-btn:hover { border-color: var(--accent); color: var(--accent); }
.sg-copy-btn.copied { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
.sg-code { margin: 0; padding: 14px 16px; overflow-x: auto; background: var(--bg-primary); }
.sg-code code { font: 12px/1.7 var(--font-mono); color: var(--text-primary); white-space: pre; }

/* ── 参数说明 ── */
.sg-explanations { margin-top: 32px; padding: 20px 22px; border-radius: var(--radius); }
.sg-explanations h2 { margin: 0 0 8px; font-size: 15px; font-weight: 650; color: var(--text-primary); }
.sg-explanations > p { margin: 0 0 16px; color: var(--text-muted); font-size: 12px; }
.sg-flag-table { display: flex; flex-direction: column; gap: 6px; }
.sg-flag-row {
  display: grid; grid-template-columns: 280px 1fr; gap: 12px;
  padding: 7px 10px; border-radius: var(--radius-sm); background: var(--surface);
}
.sg-flag-name { font: 12px var(--font-mono); color: var(--accent-strong); word-break: break-all; }
.sg-flag-desc { color: var(--text-secondary); font-size: 12px; line-height: 1.6; }
.sg-notes { margin-top: 16px; }
.sg-notes h3 { margin: 0 0 8px; font-size: 13px; font-weight: 650; color: var(--text-primary); }
.sg-notes ul { margin: 0; padding-left: 18px; color: var(--text-secondary); font-size: 12px; line-height: 1.9; }
.sg-notes code { padding: 1px 5px; border: 1px solid var(--border); border-radius: 4px; background: var(--surface); color: var(--accent-strong); font: 11px var(--font-mono); }

@media (max-width: 700px) {
  .sg-flag-row { grid-template-columns: 1fr; gap: 4px; }
  .sg-layout { gap: 16px; }
}
</style>
