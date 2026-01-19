# Vue Best Practices

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Vue 性能优化最佳实践 - 为 AI Agents 和开发者优化的结构化知识库

受 [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) 启发，将多年 Vue 2/3 和 Nuxt 优化经验整理成结构化仓库，方便 AI Agents 和开发团队使用。

## 特性

- 📚 **系统化分类**：10 大性能类别，涵盖异步、Bundle、响应式、渲染等
- 🎯 **影响等级评估**：CRITICAL → LOW，帮助优先排序
- 💡 **实战案例**：每条规则都包含错误/正确示例对比
- 🔄 **Vue 2/3 兼容**：同时支持 Vue 2 和 Vue 3 的最佳实践
- 🤖 **AI 友好**：编译成 AGENTS.md 供 AI 编码助手使用
- 🚀 **Nuxt 优化**：包含 SSR/SSG 性能优化技巧

## 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 构建 AGENTS.md

```bash
npm run build
```

### 验证规则文件

```bash
npm run validate
```

### 提取测试用例

```bash
npm run extract-tests
```

## 项目结构

```
vue-best-practices/
├── rules/                    # 规则文件目录
│   ├── _sections.md          # 性能分类定义
│   ├── _template.md          # 规则模板
│   ├── async-*.md            # 异步/瀑布流优化
│   ├── bundle-*.md           # Bundle 大小优化
│   ├── server-*.md           # 服务端性能
│   ├── client-*.md           # 客户端数据获取
│   ├── reactivity-*.md       # 响应式优化
│   ├── rendering-*.md        # 渲染性能
│   ├── vue2-*.md             # Vue 2 特有
│   ├── vue3-*.md             # Vue 3 特有
│   ├── js-*.md               # JavaScript 性能
│   └── advanced-*.md         # 高级模式
├── src/                      # 构建脚本
│   ├── build.ts              # 编译规则到 AGENTS.md
│   ├── validate.ts           # 验证规则格式
│   └── extract-tests.ts      # 提取测试用例
├── metadata.json             # 项目元数据
├── AGENTS.md                 # 编译后的完整文档（生成）
├── test-cases.json           # 测试用例（生成）
└── README.md                 # 项目说明
```

## 性能分类

### 1. 消除异步瀑布流 (async-) 🔴 CRITICAL
避免串行异步操作，使用并行请求、预加载优化数据获取。

### 2. Bundle 大小优化 (bundle-) 🔴 CRITICAL
代码分割、Tree-shaking、动态导入减小 JavaScript 体积。

### 3. 服务端性能 (server-) 🟠 HIGH
SSR/SSG 优化、缓存策略、Nuxt 性能提升。

### 4. 客户端数据获取 (client-) 🟠 HIGH
API 调用优化、减少重复请求。

### 5. 响应式优化 (reactivity-) 🟡 MEDIUM-HIGH
Computed、Watch 的正确使用，避免不必要的响应式追踪。

### 6. 渲染性能 (rendering-) 🟡 MEDIUM
虚拟滚动、条件渲染、keep-alive、key 优化。

### 7. Vue 2 特有 (vue2-) 🟡 MEDIUM
Object.freeze、函数式组件等 Vue 2 优化技巧。

### 8. Vue 3 特有 (vue3-) 🟡 MEDIUM
Composition API、Teleport、Suspense 等新特性最佳实践。

### 9. JavaScript 性能 (js-) 🟢 LOW-MEDIUM
框架无关的 JS 优化：循环、正则、数据结构。

### 10. 高级模式 (advanced-) 🟢 LOW
复杂场景和性能关键路径的高级优化。

## 创建新规则

1. 复制模板文件：
```bash
cp rules/_template.md rules/area-description.md
```

2. 选择适当的前缀：
   - `async-` - 异步瀑布流
   - `bundle-` - Bundle 优化
   - `server-` - 服务端性能
   - `client-` - 客户端数据
   - `reactivity-` - 响应式优化
   - `rendering-` - 渲染性能
   - `vue2-` - Vue 2 特有
   - `vue3-` - Vue 3 特有
   - `js-` - JavaScript 性能
   - `advanced-` - 高级模式

3. 填写规则内容，包括：
   - 标题和影响等级
   - 错误示例
   - 正确示例
   - 影响分析
   - 参考资料

4. 运行构建：
```bash
npm run build
```

## 影响等级

- **CRITICAL** - 最高优先级，重大性能提升
- **HIGH** - 显著的性能改进
- **MEDIUM-HIGH** - 中等偏高的收益
- **MEDIUM** - 中等性能改进
- **LOW-MEDIUM** - 中等偏低的收益
- **LOW** - 增量改进

## 在 AI 编码助手中使用

### Claude Code / Cursor

将项目添加为 Agent Skill：

```bash
npx add-skill /path/to/vue-best-practices
```

或者直接使用编译后的 `AGENTS.md` 文件作为上下文。

### 手动集成

将 `AGENTS.md` 的内容复制到 AI 助手的自定义指令中。

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-rule`)
3. 添加或修改规则文件
4. 运行验证 (`npm run validate`)
5. 提交更改 (`git commit -m 'Add amazing rule'`)
6. 推送到分支 (`git push origin feature/amazing-rule`)
7. 创建 Pull Request

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 致谢

- 灵感来源：[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- Vue.js 团队的卓越工作
- 所有贡献者

## 相关资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vue 2 官方文档](https://v2.cn.vuejs.org/)
- [Nuxt 官方文档](https://nuxt.com/)
- [Vue 性能优化指南](https://cn.vuejs.org/guide/best-practices/performance.html)

---

如果这个项目对你有帮助，请给个 ⭐️！
