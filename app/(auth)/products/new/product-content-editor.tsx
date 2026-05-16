"use client";

import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useCallback } from "react";
import { useEditorState } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  content: string;
  onContentUpdate: (content: string) => void;
};

export function ProductContentEditor({ content, onContentUpdate }: Props) {
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
      Link.configure({
        openOnClick: false,
        enableClickSelection: true,
      
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],

        isAllowedUri: (url: string, ctx: { defaultProtocol: any; defaultValidate: (arg0: string) => any; protocols: any[]; }) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme,
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url: string) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
    ],

    content: content,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-40 outline-none [&_a]:text-blue-600 [&_a]:underline",
      },
    },

    onUpdate: ({ editor }: { editor: Editor }) => {
      onContentUpdate(editor.getHTML());
    },
  });

const setLink = useCallback(() => {
  if (!editor) return;

  const selectedText = editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to,
    " "
  );

  if (!selectedText) return;

  editor
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({
      href: selectedText,
    })
    .run();
}, [editor]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor?.isActive("link") ?? false,
    }),
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="control-group">
        <div className="button-group">
          <Button
            type="button"
                      

            onClick={setLink}
            className={cn( editorState.isLink ? "is-active" : "","bg-blue-500", "text-xs")}
          >
            Link
          </Button>
          <Button
            type="button"
            className={cn("bg-blue-500","text-xs")}
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editorState.isLink}
          >
            Unlink
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} className="min-h-12 outline-none border rounded-md p-3 border-zinc-300 text-sm focus:outline-none"
    />
    </>
  );
}
