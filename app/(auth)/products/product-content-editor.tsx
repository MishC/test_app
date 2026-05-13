import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

type Props={content:string; onContentUpdate:(content:string)=>void};

export const ProductContentEditor=({content}:Props) => {
  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography, Youtube.configure({controls:false, height:320, width:480})],
    content: `
    <p>
      Markdown shortcuts make it easy to format the text while typing.
    </p>
    `,
    immediatelyRender:false,
    editorProps:{ attributes:{class:"prose prose-sm max-w-full w-full outline-none"}}
  })

  return <EditorContent editor={editor} className="min-h-12 outline-none border rounded-md p-3 border-zinc-300 text-sm focus:outline-none"/>
}