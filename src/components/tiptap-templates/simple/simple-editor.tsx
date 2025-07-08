import * as React from "react"
import { EditorContent, EditorContext, useEditor, Editor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension"
import { Selection } from "@/components/tiptap-extension/selection-extension"
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/components/tiptap-node/table-node/table-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { TableDropdownMenu } from "@/components/tiptap-ui/table-dropdown-menu"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import content from "@/components/tiptap-templates/simple/data/content.json"

// TOC
import { ToC } from "@/components/toc"
import { getHierarchicalIndexes, TableOfContents } from '@tiptap/extension-table-of-contents'
import type { TableOfContentData } from '@tiptap/extension-table-of-contents'

// Image resize
import ImageResize from "tiptap-extension-resize-image"
const MemorizedToC = React.memo(ToC)


// Table 
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

// html to pdf
import html2pdf from 'html2pdf.js';
// import htmlDocx from 'html-docx-js/dist/html-docx';

import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";


const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  editor,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
  editor: Editor | null
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <BlockquoteButton />
        <CodeBlockButton />
        <TableDropdownMenu editor={editor} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor() {
  const isMobile = useMobile()
  const windowSize = useWindowSize()
  const [items, setItems] = React.useState<TableOfContentData[]>([])
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      ImageResize,
      Typography,
      Superscript,
      Subscript,

      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),

      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setItems(content)
        },
      }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate : ({editor})=>{
        console.log("When Updated : ", editor.getHTML())
    }
  })

  const bodyRect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const handleDownload = () => {
    const element = document.getElementById('t-editor');
    const options = {
      margin: [0.3, 0.3, 0.3, 0.3],  // 0.3 inch padding top, right, bottom, left
      filename: 'document.pdf',
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      html2canvas: { scale: 2 },
    };
  
    html2pdf()
      .set(options)
      .from(element)
      .save();
  };

  // const handleDownloadDOCX = () => {
  //   const html = editor?.getHTML(); // get HTML from Tiptap
  //   const docxBlob = htmlDocx.asBlob(html);

  //   // create download link
  //   const url = URL.createObjectURL(docxBlob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'document.docx';
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  // const handleExport = async () => {
  //   if (!editor) return;

  //   // Get HTML string from Tiptap
  //   const html = editor.getHTML();

  //   // Always wrap in full HTML so Word opens it properly
  //   const fullHtml = `
  //     <html>
  //       <head>
  //         <meta charset="utf-8">
  //         <title>Document</title>
  //       </head>
  //       <body>${html}</body>
  //     </html>`;

  //   // Dynamic import so Vite doesn't bundle html-docx-js
  //   const htmlDocx = await import('html-docx-js/dist/html-docx');
    
  //   // Convert HTML to docx blob
  //   const docxBlob = htmlDocx.asBlob(fullHtml);

  //   // Trigger download
  //   const url = URL.createObjectURL(docxBlob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'document.docx';
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  const handleExport = async () => {
    if (!editor) return;

    // Get plain text from Tiptap
    const text = editor.getText();

    // Build DOCX document
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph("📄 Exported from my Tiptap editor:"),
            new Paragraph(text),
          ],
        },
      ],
    });

    // Create Blob and trigger download
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "document.docx");
  };

  return (
    <EditorContext.Provider value={{ editor }}>
     
      <Toolbar
        ref={toolbarRef}
        style={
          isMobile
            ? {
                bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
              }
            : {}
        }
      >
        {mobileView === "main" ? (
          <MainToolbarContent
            onHighlighterClick={() => setMobileView("highlighter")}
            onLinkClick={() => setMobileView("link")}
            isMobile={isMobile}
            editor={editor}
          />
        ) : (
          <MobileToolbarContent
            type={mobileView === "highlighter" ? "highlighter" : "link"}
            onBack={() => setMobileView("main")}
          />
        )}
      </Toolbar>

      <div>
         <button onClick={handleDownload}>Export PDF</button>
         <button onClick={handleExport}>Export DOCX</button>
      </div>

      <div className="col-group">
      <div className="sidebar">
        <div className="sidebar-options">
          <div className="label-large">Table of contents</div>
          <div className="table-of-contents">
            <MemorizedToC editor={editor} items={items} />
          </div>
        </div>
      </div>
      <div className="main">
        <div id="t-editor">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />

        </div>
       
      </div>
     
      </div>

      
    </EditorContext.Provider>
  )
}
