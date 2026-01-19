import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

interface RuleMeta {
  title: string
  impact: string
  impactDescription?: string
  tags?: string
}

interface Section {
  name: string
  impact: string
  description: string
  prefix: string
}

// 解析 frontmatter
function parseFrontmatter(content: string): { meta: RuleMeta; body: string } {
  const match = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/)
  if (!match) {
    return { meta: {} as RuleMeta, body: content }
  }

  const [, frontmatter, body] = match
  const meta: any = {}

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim()
      meta[key.trim()] = value
    }
  })

  return { meta, body }
}

// 读取所有规则文件
function readRules(rulesDir: string): Map<string, { meta: RuleMeta; body: string; filename: string }[]> {
  const files = readdirSync(rulesDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))

  const rulesBySection = new Map<string, any[]>()

  files.forEach(filename => {
    const content = readFileSync(join(rulesDir, filename), 'utf-8')
    const { meta, body } = parseFrontmatter(content)

    // 从文件名提取分类前缀
    const prefix = filename.split('-')[0]

    if (!rulesBySection.has(prefix)) {
      rulesBySection.set(prefix, [])
    }

    rulesBySection.get(prefix)!.push({ meta, body, filename })
  })

  // 每个分类内部按标题排序
  rulesBySection.forEach(rules => {
    rules.sort((a, b) => a.meta.title.localeCompare(b.meta.title))
  })

  return rulesBySection
}

// 构建 AGENTS.md
async function build() {
  console.log('🔨 开始构建 AGENTS.md...')

  const rulesDir = join(process.cwd(), 'rules')
  const metadata = JSON.parse(readFileSync(join(process.cwd(), 'metadata.json'), 'utf-8'))

  let output = `# ${metadata.title}\n\n`
  output += `${metadata.abstract}\n\n`
  output += `**版本**: ${metadata.version}  \n`
  output += `**最后更新**: ${metadata.lastUpdated}\n\n`

  output += `---\n\n`

  // 读取所有规则
  const rulesBySection = readRules(rulesDir)

  // 分类顺序
  const sectionOrder = [
    'async',
    'bundle',
    'server',
    'client',
    'reactivity',
    'rendering',
    'vue2',
    'vue3',
    'js',
    'advanced'
  ]

  let ruleNumber = 0

  sectionOrder.forEach((prefix, sectionIndex) => {
    const rules = rulesBySection.get(prefix)
    if (!rules || rules.length === 0) return

    const category = metadata.categories[prefix]
    if (!category) return

    // 章节标题
    output += `## ${sectionIndex + 1}. ${category.name}\n\n`
    output += `**影响等级**: ${category.impact}  \n`
    output += `**描述**: ${category.description}\n\n`

    // 规则列表
    rules.forEach((rule, index) => {
      ruleNumber++
      const { meta, body } = rule

      output += `### ${sectionIndex + 1}.${index + 1} ${meta.title}\n\n`
      output += `**影响**: ${meta.impact}  \n`

      if (meta.impactDescription) {
        output += `**影响说明**: ${meta.impactDescription}  \n`
      }

      if (meta.tags) {
        output += `**标签**: ${meta.tags}\n`
      }

      output += `\n${body}\n\n`
      output += `---\n\n`
    })
  })

  // 写入文件
  const outputPath = join(process.cwd(), 'AGENTS.md')
  writeFileSync(outputPath, output)

  console.log(`✅ 构建完成！`)
  console.log(`   - 生成了 ${ruleNumber} 条规则`)
  console.log(`   - 输出文件: ${outputPath}`)
}

build().catch(console.error)
