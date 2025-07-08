import * as React from "react"
import { Editor } from "@tiptap/react"
import { Button } from "@/components/tiptap-ui-primitive/button"

interface TableButtonProps {
  editor: Editor | null
}

export function TableButton({ editor }: TableButtonProps) {
  if (!editor) {
    return null
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
  }

  return (
    <Button
      data-style="ghost"
      onClick={insertTable}
      title="Insert table"
      aria-label="Insert table"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="tiptap-button-icon"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    </Button>
  )
} 