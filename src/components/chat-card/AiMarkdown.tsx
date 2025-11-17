import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";

const CodeBlock = ({ node, className, children, ...props }: any) => {
  const isBlock = /language-/.test(className || "");
  const language = className?.replace("language-", "") || "text";
  const codeRef = useRef<HTMLPreElement | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!codeRef.current) return;

    const text = codeRef.current.innerText;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // инлайн-код
  if (!isBlock) {
    return (
      <code
        className="px-1.5 py-0.5 text-xs font-medium text-primary bg-primary/10 rounded-md font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  // блочный код
  return (
    <div className="relative group mb-5 mt-3">
      <div
        className="
          sticky top-0 z-10
          flex items-center justify-between
          px-3 py-1.5
          bg-muted
          border border-border border-b-0
        "
      >
        <span className="uppercase text-xs font-medium text-muted-foreground">
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="p-1 rounded-md hover:bg-muted/60 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <div className="flex gap-2">
              <Check className="w-3.5 h-3.5" />
              <span className="text-muted-foreground text-xs">Скопированно</span>
            </div>
          ) : (
            <div className="flex gap-2 cursor-pointer">
              <Copy className="w-3.5 h-3.5" />
              <span className="text-muted-foreground text-xs">Копировать код</span>
            </div>
          )}
        </button>
      </div>

      <div className="overflow-x-auto border border-border border-t-0 bg-muted">
        <pre className="min-w-max px-4 py-3.5 text-sm font-mono text-foreground" ref={codeRef}>
          <code className="block" {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};


const components: Components = {
  h1: props => <h1 className="text-2xl text-foreground/90 pb-4" {...props} />,
  h2: props => <h2 className="text-xl text-foreground/90 pb-3" {...props} />,
  h3: props => <h3 className="text-lg text-foreground/90 pb-2" {...props} />,
  p: props => <p className="text-foreground/90 text-sm pb-2" {...props} />,
  strong: props => <strong className="text-lg text-foreground/90 font-medium text-sm pb-2" {...props} />,
  ul: props => <ul className="list-disc text-sm text-foreground/90 pb-3 pl-4" {...props} />,
  ol: props => <ol className="list-decimal text-sm text-foreground/90 pb-3 pl-4" {...props} />,
  hr: props => <hr className="text-accent mt-2 mb-4" {...props} />,
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  code: CodeBlock,
};

export const AiMarkdown = ({ content, id }: { content: string; id: string }) => {
  return (
    <ReactMarkdown
      key={`${id}-${content.length}`}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}