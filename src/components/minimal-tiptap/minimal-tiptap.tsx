import * as React from "react";
import "./styles/index.css";

import type { Content, Editor } from "@tiptap/react";
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap";
import { EditorContent } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SectionOne } from "./components/section/one";
import { SectionTwo } from "./components/section/two";
import { SectionThree } from "./components/section/three";
import { SectionFour } from "./components/section/four";
import { SectionFive } from "./components/section/five";
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap";
import { MeasuredContainer } from "./components/measured-container";
import { Markdown } from "tiptap-markdown";
import StarterKit from "@tiptap/starter-kit";
import { useTheme } from "@/hooks/useTheme";

export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
  editorRef?: React.MutableRefObject<Editor | null>;
  disabled?: boolean;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionTwo
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "clearFormatting",
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      />
    </div>
  </div>
);

export const MinimalTiptapEditor = React.forwardRef<
  HTMLDivElement,
  MinimalTiptapProps
>(
  (
    {
      value,
      onChange,
      className,
      editorContentClassName,
      editorRef,
      disabled,
      ...props
    },
    ref,
  ) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: () => onChange?.(editor?.storage.markdown.getMarkdown()),
      extensions: [StarterKit, Markdown],
      ...props,
    });
    const { isDark } = useTheme();

    React.useEffect(() => {
      if (editorRef) {
        editorRef.current = editor;
      }
    }, [editor, editorRef]);

    if (!editor) {
      return null;
    }

    return (
      <div className={cn(isDark && "dark", "h-full")}>
        <MeasuredContainer
          as="div"
          name="editor"
          ref={ref}
          className={cn(
            "flex h-full min-h-72 w-full flex-col bg-accent text-foreground shadow-sm focus-within:border-primary",
            className,
          )}
        >
          {/* <Toolbar editor={editor} /> */}
          <EditorContent
            editor={editor}
            className={cn(
              "minimal-tiptap-editor flex-1 overflow-hidden",
              editorContentClassName,
            )}
            onClick={() => editor.chain().focus().run()}
            disabled={disabled}
          />
          <LinkBubbleMenu editor={editor} />
        </MeasuredContainer>
      </div>
    );
  },
);

MinimalTiptapEditor.displayName = "MinimalTiptapEditor";

export default MinimalTiptapEditor;
