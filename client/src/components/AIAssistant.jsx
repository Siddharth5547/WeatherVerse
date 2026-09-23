import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Bot,
  Copy,
  CheckCircle2,
  RefreshCw,
  Send,
  HelpCircle,
  Zap,
} from "lucide-react";
import { marked } from "marked";

const PROMPT_SUGGESTIONS = [
  "Should I carry an umbrella today?",
  "What should I wear for this weather?",
  "Is the air quality safe for a run?",
  "Is the weather suitable for outdoor sports?",
];

export default function AIAssistant({
  advice,
  loading,
  onRegenerate,
  onAskCustom,
  theme: _theme = "dark",
  cityName = "your city",
}) {
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const copyAdvice = async () => {
    if (!advice) return;
    try {
      await navigator.clipboard.writeText(advice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim() || loading) return;
    onAskCustom(customInput.trim());
    setCustomInput("");
  };

  // Safe markdown parse
  const parsedHtml = React.useMemo(() => {
    if (!advice) return "";
    try {
      return marked.parse(advice);
    } catch {
      return advice;
    }
  }, [advice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="apple-card relative overflow-hidden flex flex-col"
    >
      {/* AI Header Bar */}
      <div className="p-5 md:p-6 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl bg-[#5856D6]/10 border border-[#5856D6]/20 flex items-center justify-center text-[#5856D6] dark:text-[#8E8AFF]">
            <Bot className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-[#111111] dark:text-[#F5F5F7] tracking-tight">
                WeatherVerse AI Copilot
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5856D6]/10 text-[#5856D6] dark:text-[#8E8AFF] border border-[#5856D6]/20">
                Gemini 3.1 Flash
              </span>
            </div>
            <p className="text-xs text-[#515154] dark:text-[#AEAEB2]">
              Instant meteorological reasoning & lifestyle advisory for {cityName}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={copyAdvice}
            disabled={!advice || loading}
            className="apple-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            title="Copy Report"
          >
            {copied ? (
              <>
                <CheckCircle2 size={14} className="text-[#34C759]" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onRegenerate}
            disabled={loading}
            className="apple-btn-primary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            title="Regenerate Report"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="flex items-center gap-1 shrink-0 text-[#6E6E73] dark:text-[#8E8E93] text-[11px] font-semibold uppercase tracking-wider">
          <Zap size={11} className="text-[#FFCC00]" /> Ask AI:
        </span>
        {PROMPT_SUGGESTIONS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onAskCustom(prompt)}
            disabled={loading}
            className="shrink-0 px-3 py-1 rounded-full text-xs font-medium border border-[var(--border-subtle)] bg-black/5 dark:bg-white/5 text-[#515154] dark:text-[#AEAEB2] hover:text-[#111111] dark:hover:text-[#FFFFFF] hover:border-[#5856D6]/40 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Response Box */}
      <div className="p-5 md:p-6 min-h-[160px] flex-1">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="flex items-center gap-2 text-[#5856D6] dark:text-[#8E8AFF] text-xs font-semibold">
              <Sparkles size={14} className="animate-spin" />
              Synthesizing atmospheric conditions with Gemini AI...
            </div>
            <div className="h-4 bg-black/5 dark:bg-white/5 rounded-full w-11/12" />
            <div className="h-4 bg-black/5 dark:bg-white/5 rounded-full w-full" />
            <div className="h-4 bg-black/5 dark:bg-white/5 rounded-full w-4/5" />
          </div>
        ) : advice ? (
          <div
            className="apple-markdown text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
          />
        ) : (
          <div className="text-center py-8 text-[#515154] dark:text-[#AEAEB2] text-sm">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#5856D6] dark:text-[#8E8AFF]" />
            Select a quick prompt above or search a city to consult WeatherVerse AI.
          </div>
        )}
      </div>

      {/* Interactive Custom Question Input */}
      <div className="p-4 border-t border-[var(--border-subtle)] bg-black/5 dark:bg-white/5">
        <form onSubmit={handleSendCustom} className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder={`Ask anything about the weather in ${cityName}...`}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm outline-none border border-[var(--border-subtle)] bg-white dark:bg-[#1C1C1E] text-[#111111] dark:text-[#F5F5F7] placeholder:text-[#6E6E73] dark:placeholder:text-[#8E8E93] focus:border-[#5856D6]"
          />
          <button
            type="submit"
            disabled={!customInput.trim() || loading}
            className="apple-btn-primary px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </motion.div>
  );
}

