import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

interface ValidationError {
  file: string
  errors: string[]
}

const VALID_IMPACTS = ['CRITICAL', 'HIGH', 'MEDIUM-HIGH', 'MEDIUM', 'LOW-MEDIUM', 'LOW']
const VALID_PREFIXES = ['async', 'bundle', 'server', 'client', 'reactivity', 'rendering', 'vue2', 'vue3', 'js', 'advanced']

function validateRule(filename: string, content: string): string[] {
  const errors: string[] = []

  // 检查是否有 frontmatter
  if (!content.startsWith('---\n')) {
    errors.push('缺少 frontmatter')
    return errors
  }

  const match = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/)
  if (!match) {
    errors.push('frontmatter 格式错误')
    return errors
  }

  const [, frontmatter, body] = match

  // 解析 frontmatter
  const meta: any = {}
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length) {
      meta[key.trim()] = valueParts.join(':').trim()
    }
  })

  // 检查必需字段
  if (!meta.title) {
    errors.push('缺少 title 字段')
  }

  if (!meta.impact) {
    errors.push('缺少 impact 字段')
  } else if (!VALID_IMPACTS.includes(meta.impact)) {
    errors.push(`无效的 impact 值: ${meta.impact}`)
  }

  // 检查文件名前缀
  const prefix = filename.split('-')[0].replace('.md', '')
  if (!VALID_PREFIXES.includes(prefix)) {
    errors.push(`无效的文件名前缀: ${prefix}`)
  }

  // 检查内容是否包含示例
  if (!body.includes('错误示例') && !body.includes('Incorrect')) {
    errors.push('缺少错误示例')
  }

  if (!body.includes('正确示例') && !body.includes('Correct')) {
    errors.push('缺少正确示例')
  }

  // 检查代码块
  const codeBlocks = body.match(/```/g)
  if (!codeBlocks || codeBlocks.length < 2) {
    errors.push('至少需要 2 个代码块（错误和正确示例）')
  } else if (codeBlocks.length % 2 !== 0) {
    errors.push('代码块未正确闭合')
  }

  return errors
}

async function validate() {
  console.log('🔍 开始验证规则文件...\n')

  const rulesDir = join(process.cwd(), 'rules')
  const files = readdirSync(rulesDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))

  const validationErrors: ValidationError[] = []
  let validCount = 0

  files.forEach(filename => {
    const content = readFileSync(join(rulesDir, filename), 'utf-8')
    const errors = validateRule(filename, content)

    if (errors.length > 0) {
      validationErrors.push({ file: filename, errors })
    } else {
      validCount++
    }
  })

  // 输出结果
  if (validationErrors.length === 0) {
    console.log(`✅ 所有 ${validCount} 个规则文件验证通过！\n`)
    return true
  } else {
    console.log(`❌ 发现 ${validationErrors.length} 个文件存在问题：\n`)

    validationErrors.forEach(({ file, errors }) => {
      console.log(`📄 ${file}:`)
      errors.forEach(error => {
        console.log(`   - ${error}`)
      })
      console.log('')
    })

    console.log(`✅ ${validCount} 个文件验证通过`)
    console.log(`❌ ${validationErrors.length} 个文件需要修复\n`)

    process.exit(1)
  }
}

validate().catch(console.error)
