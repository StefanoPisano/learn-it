import i18n from '../i18n'

export interface ParsedLearningPath {
  title: string
  description: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  author: string
  language: string
  link?: string
  date?: string
  version?: string
  sections: ParsedSection[]
}

export interface ParsedSection {
  type: 'concept' | 'exercise' | 'quiz' | 'reference'
  variant?: 'single' | 'multiple'
  content: string
  completed: boolean
  questions?: ParsedQuizQuestion[]
  links?: ParsedReferenceLink[]
}

export interface ParsedQuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

export interface ParsedReferenceLink {
  title: string
  url: string
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

function splitYamlBlocks(text: string): string[] {
  const rawBlocks: string[] = []
  let current = ''
  let inCodeBlock = false
  const lines = text.split('\n')

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      current += line + '\n'
      continue
    }

    if (inCodeBlock) {
      current += line + '\n'
      continue
    }

    if (line.trim() === '---') {
      if (current.trim()) {
        rawBlocks.push(current.trim())
      }
      current = ''
    } else {
      current += line + '\n'
    }
  }

  const remaining = current.trim()
  if (remaining) {
    rawBlocks.push(remaining)
  }

  if (rawBlocks.length === 0) {
    return []
  }

  const blocks: string[] = [rawBlocks[0]]

  for (let i = 1; i < rawBlocks.length; i += 2) {
    const metadata = rawBlocks[i]
    const content = i + 1 < rawBlocks.length ? rawBlocks[i + 1] : ''
    blocks.push(metadata + '\n\n' + content)
  }

  return blocks
}

function parseGlobalMetadata(yamlText: string): {
  title: string
  description: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  author: string
  language: string
  link?: string
  date?: string
  version?: string
} {
  const title = extractValue(yamlText, 'title')
  const description = extractValue(yamlText, 'description')
  const tags = extractList(yamlText, 'tags')
  const difficulty = extractValue(yamlText, 'difficulty')
  const author = extractValue(yamlText, 'author')
  const language = extractValue(yamlText, 'language')
  const link = extractValue(yamlText, 'link') || undefined
  const date = extractValue(yamlText, 'date') || undefined
  const version = extractValue(yamlText, 'version') || undefined

  if (!title) throw new ParseError(i18n.t('parser.titleRequired'))
  if (!description) throw new ParseError(i18n.t('parser.descriptionRequired'))
  if (!tags || tags.length === 0) throw new ParseError(i18n.t('parser.tagsRequired'))
  if (!difficulty) throw new ParseError(i18n.t('parser.difficultyRequired'))
  if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
    throw new ParseError(i18n.t('parser.difficultyInvalid', { difficulty }))
  }
  if (!author) throw new ParseError(i18n.t('parser.authorRequired'))
  if (!language) throw new ParseError(i18n.t('parser.languageRequired'))

  return { title, description, tags, difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced', author, language, link, date, version } as const
}

function parseSectionMetadata(yamlText: string): { type: string; variant?: string } {
  const type = extractValue(yamlText, 'type')
  const variant = extractValue(yamlText, 'variant') || undefined

  if (!type) throw new ParseError(i18n.t('parser.typeRequired'))
  if (!['concept', 'exercise', 'quiz', 'reference'].includes(type)) {
    throw new ParseError(i18n.t('parser.typeInvalid', { type }))
  }
  if (type === 'quiz') {
    if (!variant) throw new ParseError(i18n.t('parser.variantRequired'))
    if (!['single', 'multiple'].includes(variant)) {
      throw new ParseError(i18n.t('parser.variantInvalid', { variant }))
    }
  }

  return { type, variant }
}

function parseQuizQuestions(content: string): ParsedQuizQuestion[] {
  const lines = content.split('\n')
  const questions: ParsedQuizQuestion[] = []
  let currentQuestion = ''
  let currentOptions: string[] = []
  let currentCorrectIndex = -1

  for (const line of lines) {
    const headingMatch = line.match(/^###\s+(.+)/)
    if (headingMatch) {
      if (currentQuestion) {
        if (currentOptions.length === 0) {
          throw new ParseError(i18n.t('parser.questionNoOptions', { question: currentQuestion }))
        }
        if (currentCorrectIndex === -1) {
          throw new ParseError(i18n.t('parser.questionNoCorrect', { question: currentQuestion }))
        }
        questions.push({ question: currentQuestion, options: [...currentOptions], correctIndex: currentCorrectIndex })
      }
      currentQuestion = headingMatch[1].trim()
      currentOptions = []
      currentCorrectIndex = -1
    }

    const optionMatch = line.match(/^-\s+\[([ x])\]\s+(.+)/)
    if (optionMatch) {
      const isCorrect = optionMatch[1] === 'x'
      currentOptions.push(optionMatch[2].trim())
      if (isCorrect) {
        currentCorrectIndex = currentOptions.length - 1
      }
    }
  }

  if (currentQuestion) {
    if (currentOptions.length === 0) {
      throw new ParseError(i18n.t('parser.questionNoOptions', { question: currentQuestion }))
    }
    if (currentCorrectIndex === -1) {
      throw new ParseError(i18n.t('parser.questionNoCorrect', { question: currentQuestion }))
    }
    questions.push({ question: currentQuestion, options: currentOptions, correctIndex: currentCorrectIndex })
  }

  return questions
}

function parseReferenceLinks(content: string): ParsedReferenceLink[] {
  const links: ParsedReferenceLink[] = []
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({ title: match[1].trim(), url: match[2].trim() })
  }

  return links
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
    const keyMatch = line.match(new RegExp(`^${key}:`))
    if (keyMatch) {
      inList = true
      continue
    }
    if (inList) {
      const listMatch = line.match(/^\s+-\s+(.+)/)
      if (listMatch) {
        items.push(listMatch[1].trim())
      } else if (line.trim() !== '' && !line.startsWith(' ')) {
        break
      }
    }
  }

  return items
}

export function parseMarkdown(markdown: string): ParsedLearningPath {
  const blocks = splitYamlBlocks(markdown)

  if (blocks.length < 2) {
    throw new ParseError(i18n.t('parser.fileInvalid'))
  }

  const yamlBlock = blocks[0]
  const global = parseGlobalMetadata(yamlBlock)

  const sections: ParsedSection[] = []

  for (let i = 1; i < blocks.length; i++) {
    const blockContent = blocks[i]
    const yamlEnd = blockContent.indexOf('\n\n')
    const sectionYaml = yamlEnd === -1 ? blockContent : blockContent.substring(0, yamlEnd).trim()
    const sectionBody = yamlEnd === -1 ? '' : blockContent.substring(yamlEnd + 2).trim()

    const type = extractValue(sectionYaml, 'type')
    if (!type) continue

    const meta = parseSectionMetadata(sectionYaml)

    const section: ParsedSection = {
      type: meta.type as ParsedSection['type'],
      variant: meta.type === 'quiz' ? (meta.variant as 'single' | 'multiple') : undefined,
      content: sectionBody,
      completed: false,
    }

    if (meta.type === 'quiz') {
      section.questions = parseQuizQuestions(sectionBody)
      if (section.questions.length === 0) {
        throw new ParseError(i18n.t('parser.quizNoQuestions'))
      }
    }

    if (meta.type === 'reference') {
      section.links = parseReferenceLinks(sectionBody)
    }

    sections.push(section)
  }

  return {
    title: global.title,
    description: global.description,
    tags: global.tags,
    difficulty: global.difficulty,
    author: global.author,
    language: global.language,
    link: global.link,
    date: global.date,
    version: global.version,
    sections,
  }
}
