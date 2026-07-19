import type { LearningPath, Section } from '../store/learningPathStore'

const modules = import.meta.glob('/src/learning-paths/**/*.md', { as: 'raw', eager: true })

function slugFromPath(path: string): string {
  const filename = path.split('/').pop() ?? path
  return filename.replace(/\.md$/, '')
}

function parseSectionMetadata(yamlText: string): { type: string; variant?: string } {
  const type = extractValue(yamlText, 'type')
  const variant = extractValue(yamlText, 'variant') || undefined
  if (!type || !['concept', 'exercise', 'quiz', 'reference'].includes(type)) return { type: 'concept' }
  if (type === 'quiz' && (!variant || !['single', 'multiple'].includes(variant))) return { type, variant: 'single' }
  return { type, variant }
}

function extractValue(text: string, key: string): string | null {
  const regex = new RegExp(`^${key}:\\s*(.+)`, 'm')
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

function extractList(text: string, key: string): string[] {
  const lines = text.split('\n')
  const items: string[] = []
  let inList = false
  for (const line of lines) {
    if (line.match(new RegExp(`^${key}:`))) { inList = true; continue }
    if (inList) {
      const listMatch = line.match(/^\s+-\s+(.+)/)
      if (listMatch) items.push(listMatch[1].trim())
      else if (line.trim() !== '' && !line.startsWith(' ')) break
    }
  }
  return items
}

function parseQuizQuestions(content: string) {
  const questions: { question: string; options: string[]; correctIndex: number }[] = []
  let currentQuestion = ''
  let currentOptions: string[] = []
  let currentCorrectIndex = -1

  for (const line of content.split('\n')) {
    const headingMatch = line.match(/^###\s+(.+)/)
    if (headingMatch) {
      if (currentQuestion && currentOptions.length > 0 && currentCorrectIndex !== -1) {
        questions.push({ question: currentQuestion, options: [...currentOptions], correctIndex: currentCorrectIndex })
      }
      currentQuestion = headingMatch[1].trim()
      currentOptions = []
      currentCorrectIndex = -1
    }
    const optionMatch = line.match(/^-\s+\[([ x])\]\s+(.+)/)
    if (optionMatch) {
      currentOptions.push(optionMatch[2].trim())
      if (optionMatch[1] === 'x') currentCorrectIndex = currentOptions.length - 1
    }
  }
  if (currentQuestion && currentOptions.length > 0 && currentCorrectIndex !== -1) {
    questions.push({ question: currentQuestion, options: currentOptions, correctIndex: currentCorrectIndex })
  }
  return questions
}

function parseReferenceLinks(content: string) {
  const links: { title: string; url: string }[] = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    links.push({ title: match[1].trim(), url: match[2].trim() })
  }
  return links
}

function splitYamlBlocks(text: string): string[] {
  const rawBlocks: string[] = []
  let current = ''
  let inCodeBlock = false
  for (const line of text.split('\n')) {
    if (line.trim().startsWith('```')) { inCodeBlock = !inCodeBlock; current += line + '\n'; continue }
    if (inCodeBlock) { current += line + '\n'; continue }
    if (line.trim() === '---') { if (current.trim()) rawBlocks.push(current.trim()); current = '' }
    else { current += line + '\n' }
  }
  if (current.trim()) rawBlocks.push(current.trim())
  if (rawBlocks.length === 0) return []
  const blocks: string[] = [rawBlocks[0]]
  for (let i = 1; i < rawBlocks.length; i += 2) {
    const metadata = rawBlocks[i]
    const content = i + 1 < rawBlocks.length ? rawBlocks[i + 1] : ''
    blocks.push(metadata + '\n\n' + content)
  }
  return blocks
}

function parseMarkdown(markdown: string) {
  const blocks = splitYamlBlocks(markdown)
  if (blocks.length < 2) return null

  const yamlBlock = blocks[0]
  const title = extractValue(yamlBlock, 'title')
  const description = extractValue(yamlBlock, 'description')
  const tags = extractList(yamlBlock, 'tags')
  const difficulty = extractValue(yamlBlock, 'difficulty')
  const author = extractValue(yamlBlock, 'author')
  const language = extractValue(yamlBlock, 'language')
  const link = extractValue(yamlBlock, 'link') || undefined
  const date = extractValue(yamlBlock, 'date') || undefined
  const version = extractValue(yamlBlock, 'version') || undefined

  if (!title || !description || tags.length === 0 || !difficulty || !author || !language) return null
  if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) return null

  const sections: Section[] = []
  for (let i = 1; i < blocks.length; i++) {
    const blockContent = blocks[i]
    const yamlEnd = blockContent.indexOf('\n\n')
    const sectionYaml = yamlEnd === -1 ? blockContent : blockContent.substring(0, yamlEnd).trim()
    const sectionBody = yamlEnd === -1 ? '' : blockContent.substring(yamlEnd + 2).trim()
    const type = extractValue(sectionYaml, 'type')
    if (!type || !['concept', 'exercise', 'quiz', 'reference'].includes(type)) continue
    const meta = parseSectionMetadata(sectionYaml)
    const section: Section = { type: meta.type as Section['type'], content: sectionBody }
    if (meta.type === 'quiz' && meta.variant) {
      section.variant = meta.variant as 'single' | 'multiple'
      section.questions = parseQuizQuestions(sectionBody)
    }
    if (meta.type === 'reference') section.links = parseReferenceLinks(sectionBody)
    sections.push(section)
  }

  return {
    title, description, tags, difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
    author, language, link, date, version, sections,
  }
}

export interface BuiltinPath {
  slug: string
  data: Omit<LearningPath, 'id' | 'slug' | 'progress' | 'followed' | 'source'>
}

export function loadBuiltinPaths(): BuiltinPath[] {
  const paths: BuiltinPath[] = []
  for (const [filePath, content] of Object.entries(modules)) {
    const parsed = parseMarkdown(content as string)
    if (!parsed) continue
    paths.push({ slug: slugFromPath(filePath), data: parsed })
  }
  return paths
}
