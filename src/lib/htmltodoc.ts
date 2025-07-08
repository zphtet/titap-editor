import { generateJSON } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Variable from '@/components/extensions/variables'

export const htmlToDoc = (html: string) => {
  const doc = generateJSON(html, [StarterKit])

  const VARIABLE_REGEX = /<<([\w\d_]+)>>/g

  const replace = (node: any) => {
    if (node.type === 'text') {
      const parts = node.text.split(VARIABLE_REGEX)
      if (parts.length === 1) return node

      const newNodes = []
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0 && parts[i]) {
          newNodes.push({ type: 'text', text: parts[i] })
        } else if (i % 2 === 1) {
          newNodes.push({
            type: 'variable',
            attrs: { name: parts[i] },
            content: [{ type: 'text', text: '' }]
          })
        }
      }
      return newNodes
    }

    if (node.content) {
      const newContent = []
      node.content.forEach((child: any) => {
        const replaced = replace(child)
        if (Array.isArray(replaced)) {
          newContent.push(...replaced)
        } else {
          newContent.push(replaced)
        }
      })
      return { ...node, content: newContent }
    }

    return node
  }

  const replacedDoc = replace(doc)

  // ✅ Force return shape: always { type: 'doc', content: [...] }
  return {
    type: 'doc',
    content: replacedDoc.content || []
  }
}

export default htmlToDoc
