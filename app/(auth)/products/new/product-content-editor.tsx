"use client";

import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  content: string;
  onContentUpdate: (content: string) => void;
};

export function ProductContentEditor({
  content,
  onContentUpdate,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Youtube.configure({
        controls: false,
        height: 320,
        width: 480,
      }),
    ],

    content:content,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none min-h-40 outline-none [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:my-2 [&_iframe]:w-full [&_iframe]:h-[320px] [&_iframe]:rounded-lg`
      },
    },

  onUpdate: ({ editor }: { editor: Editor }) => {
  onContentUpdate(editor.getHTML());
}
  });

  return (
    <EditorContent
      editor={editor}
      className="min-h-12 outline-none border rounded-md p-3 border-zinc-300 text-sm focus:outline-none"
    />
  );
}