import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'variable',

  group: 'inline',
  inline: true,
  atom: true, // atomic: single entity; cannot contain inner content

  addAttributes() {
    return {
      name: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-variable]',
      },
    ]
  },

  renderHTML({ node }) {
    return [
      'span',
      mergeAttributes({
        'data-variable': node.attrs.name,
        style: `
          background: #d1fae5;
          padding: 2px 4px;
          border-radius: 4px;
          font-weight: 500;
          font-family: monospace;
        `,
      }),
      node.attrs.name, // show variable name as content
    ]
  },
})
