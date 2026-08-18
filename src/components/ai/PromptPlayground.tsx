import { useEffect, useRef, useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TipButton } from "@/components/wallet/TipButton";
import { MintProofButton } from "@/components/wallet/MintProofButton";
import { cn } from "@/lib/utils";

const STYLES = [
  { id: "creative", label: "Creative" },
  { id: "concise", label: "Concise" },
  { id: "code", label: "Code Generation" },
] as const;

type StyleId = (typeof STYLES)[number]["id"];

function buildOptimized(prompt: string, style: StyleId) {
  const base = prompt.trim();
  if (style === "creative") {
    return [
      "Role: You are an award-winning creative director with a distinctive voice.",
      "",
      `Task: ${base}`,
      "",
      "Constraints:",
      "- Explore three distinct conceptual angles before committing to one.",
      "- Favor vivid, concrete imagery over abstractions.",
      "- Keep a confident, human tone; avoid clichés and filler.",
      "",
      "Output: A titled concept, the rationale in two sentences, then the final piece.",
    ].join("\n");
  }
  if (style === "concise") {
    return [
      "Role: You are a senior editor optimizing for signal density.",
      "",
      `Task: ${base}`,
      "",
      "Constraints:",
      "- Maximum 120 words total.",
      "- No preamble, no restating the question.",
      "- Bullet points only when they beat prose.",
      "",
      "Output: The answer, nothing else.",
    ].join("\n");
  }
  return [
    "Role: You are a staff-level engineer writing production-ready code.",
    "",
    `Task: ${base}`,
    "",
    "Constraints:",
    "- State assumptions explicitly before the implementation.",
    "- Provide typed, runnable code with error handling.",
    "- Note complexity and one alternative approach.",
    "",
    "Output: Assumptions, code block, then a short usage example.",
  ].join("\n");
}

export function PromptPlayground() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<StyleId>("creative");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Enter a prompt first");
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);

    const full = buildOptimized(prompt, style);
    setOutput("");
    setStreaming(true);

    let index = 0;
    timerRef.current = setInterval(() => {
      index += Math.max(1, Math.round(Math.random() * 4));
      setOutput(full.slice(0, index));
      if (index >= full.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setStreaming(false);
      }
    }, 16);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

  return (
    <section className="glass-card rounded-2xl p-6 sm:p-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
            Prompt Playground
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Draft a rough idea, pick a style, and get a structured, model-ready prompt.
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0">
          Optimizer v1
        </Badge>
      </div>

      <Textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="e.g. Write a launch announcement for a Solana-native prompt tool"
        className="mt-6 min-h-32 resize-y bg-background/40"
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {STYLES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStyle(item.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              style === item.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
        <Button
          onClick={handleGenerate}
          disabled={streaming}
          className="ml-auto gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {streaming ? "Generating..." : "Generate & Optimize"}
        </Button>
      </div>

      {(output || streaming) && (
        <div className="mt-6 rounded-xl border border-border bg-background/50 p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <span className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Optimized output
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!output || streaming}
              className="shrink-0 gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-foreground">
            {output}
            {streaming && <span className="animate-pulse">▍</span>}
          </pre>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <TipButton amount={0.01} label="Tip Developer" />
        <MintProofButton prompt={prompt} />
      </div>
    </section>
  );
}
