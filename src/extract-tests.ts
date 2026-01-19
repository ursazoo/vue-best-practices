import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

interface TestCase {
  id: string
  title: string
  category: string
  impact: string
  incorrectCode: string
  correctCode: string
}

function extractCodeBlocks(content: string): { incorrect: string[]; correct: string[] } {
  const incorrect: string[] = []
  const correct: string[] = []

  // 简单的代码块提取（可以改进）
  const sections = content.split(/\*\*错误示例|\*\*Incorrect/i)

  if (sections.length > 1) {
    const incorrectSection = sections[1].split(/\*\*正确示例|\*\*Correct/i)[0]
    const codeBlocks = incorrectSection.match(/```[\s\S]*?```/g)
    if (codeBlocks) {
      incorrect.push(...codeBlocks.map(b => b.replace(/```\w*\n?/g, '').trim()))
    }
  }

  const correctSection = content.split(/\*\*正确示例|\*\*Correct/i)[1]
  if (correctSection) {
    const codeBlocks = correctSection.match(/```[\s\S]*?```/g)
    if (codeBlocks) {
      correct.push(...codeBlocks.map(b => b.replace(/```\w*\n?/g, '').trim()))
    }
  }

  return { incorrect, correct }
}

async function extractTests() {
  console.log('📝 开始提取测试用例...\n')

  const rulesDir = join(process.cwd(), 'rules')
  const files = readdirSync(rulesDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))

  const testCases: TestCase[] = []

  files.forEach(filename => {
    const content = readFileSync(join(rulesDir, filename), 'utf-8')

    // 解析 frontmatter
    const match = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/)
    if (!match) return

    const [, frontmatter, body] = match

    const meta: any = {}
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length) {
        meta[key.trim()] = valueParts.join(':').trim()
      }
    })

    // 提取代码块
    const { incorrect, correct } = extractCodeBlocks(body)

    if (incorrect.length > 0 && correct.length > 0) {
      const prefix = filename.split('-')[0]

      testCases.push({
        id: filename.replace('.md', ''),
        title: meta.title,
        category: prefix,
        impact: meta.impact,
        incorrectCode: incorrect[0],
        correctCode: correct[0]
      })
    }
  })

  // 写入 JSON
  const outputPath = join(process.cwd(), 'test-cases.json')
  writeFileSync(outputPath, JSON.stringify(testCases, null, 2))

  console.log(`✅ 提取完成！`)
  console.log(`   - 提取了 ${testCases.length} 个测试用例`)
  console.log(`   - 输出文件: ${outputPath}\n`)
}

extractTests().catch(console.error)
