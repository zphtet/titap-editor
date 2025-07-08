import * as React from "react"
import { Editor } from "@tiptap/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/tiptap-ui-primitive/dropdown-menu"
import { Button } from "@/components/tiptap-ui-primitive/button"

interface TableDropdownMenuProps {
  editor: Editor | null
}

export function TableDropdownMenu({ editor }: TableDropdownMenuProps) {
  if (!editor) {
    return null
  }

  const isTableSelected = editor.isActive('table')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-style="ghost"
          title="Table operations"
          aria-label="Table operations"
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
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {!isTableSelected ? (
          <DropdownMenuItem
            onSelect={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            Insert table
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().addColumnBefore().run()}
              >
                Add column before
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().addColumnAfter().run()}
              >
                Add column after
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().deleteColumn().run()}
              >
                Delete column
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().addRowBefore().run()}
              >
                Add row before
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().addRowAfter().run()}
              >
                Add row after
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().deleteRow().run()}
              >
                Delete row
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().mergeCells().run()}
              >
                Merge cells
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().splitCell().run()}
              >
                Split cell
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().toggleHeaderRow().run()}
              >
                Toggle header row
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => editor.chain().focus().toggleHeaderColumn().run()}
              >
                Toggle header column
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() => editor.chain().focus().deleteTable().run()}
              data-variant="danger"
            >
              Delete table
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 