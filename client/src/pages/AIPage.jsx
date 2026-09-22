import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { marked } from "marked";
import { useWeather } from "../context/WeatherContext";
import SkeletonLoader from "../components/SkeletonLoader";

const SUGGESTED_QUESTIONS = [
  "Should I carry an umbrella today?",
  "What should I wear for this weather?",
  "Is today good for outdoor running or cycling?",
  "Is it safe for highway driving and travel?",
  "Will it rain later today in the evening?",
  "What will the weather be like tomorrow?",
  "Is the air quality suitable for outdoor exercise?",
  "What is the best time window to go outside today?",
];

export default function AIPage() {
  const { weather, loading, theme, city, aiAdvice, aiLoading, aiChatHistory, askAI } = useWeather();
  const [inputText, setInputText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatBottomRef = useRef(null);

  const isLight = theme === "light";

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChatHistory, aiLoading]);

  if (loading) return <SkeletonLoader theme={theme} />;
  if (!weather) return null;

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || aiLoading) return;
    askAI(inputText.trim());
    setInputText("");
  };

  const handlePromptClick = (prompt) => {
    if (aiLoading) return;
    askAI(prompt);
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-16 pt-2 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-primary)] dark:text-[#8E8AFF] text-xs font-semibold uppercase tracking-wider mb-1">
            <Bot size={14} /> Cognitive Weather Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            WeatherVerse AI
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Meteorological reasoning assistant for {city}, powered by Google Gemini 3.1 Flash.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] dark:text-[#8E8AFF] flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#D9B77A]" /> Gemini 3.1 Flash
          </span>
        </div>
      </div>

      {/* Suggested Questions Marquee Chips */}
      <div className="apple-card p-4 sm:p-5">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2.5 sm:mb-3">
          <Zap size={13} className="text-[#D9B77A]" /> Suggested Questions
        </span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(q)}
              disabled={aiLoading}
              className="px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all text-left bg-[var(--surface-card)] border border-[var(--border-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-canvas-secondary)]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream View */}
      <div className="apple-card p-4 sm:p-6 md:p-8 flex flex-col min-h-[380px] sm:min-h-[460px] max-h-[620px] overflow-y-auto">
        {/* Initial Welcome Message if no history */}
        {aiChatHistory.length === 0 ? (
          <div className="space-y-4 sm:space-y-6 my-auto">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center shrink-0 text-[var(--accent-primary)] dark:text-[#8E8AFF]">
                <Bot size={20} />
              </div>
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-[var(--text-primary)]">WeatherVerse AI</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono truncate">Live Sync</span>
                </div>
                <div className="p-3.5 sm:p-5 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] text-xs sm:text-sm leading-relaxed overflow-x-hidden">
                  <p className="font-semibold text-[var(--accent-primary)] dark:text-[#8E8AFF] mb-2">
                    Atmospheric Intelligence Ready for {city}
                  </p>
                  <div
                    className="apple-markdown break-words"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(aiAdvice || "Synthesizing localized conditions..."),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {aiChatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 sm:gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center shrink-0 text-[var(--accent-primary)] dark:text-[#8E8AFF]">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative break-words ${
                    msg.role === "user"
                      ? isLight
                        ? "bg-[#7A4F35] text-[#FFF9F2] font-medium shadow-sm"
                        : "bg-[#5856D6] text-white font-medium shadow-sm"
                      : "bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div>
                      <div
                        className="apple-markdown break-words"
                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
                      />
                      <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex justify-end">
                        <button
                          onClick={() => copyToClipboard(msg.text, i)}
                          className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1 transition"
                        >
                          {copiedIndex === i ? (
                            <>
                              <CheckCircle2 size={12} className="text-[#8EAD91]" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
        )}

        {/* Loading Indicator */}
        {aiLoading && (
          <div className="flex items-center gap-2.5 mt-3 sm:mt-4 text-[var(--accent-primary)] dark:text-[#8E8AFF] text-xs font-semibold animate-pulse">
            <RefreshCw size={13} className="animate-spin" />
            Synthesizing weather data with Gemini 3.1 Flash...
          </div>
        )}
      </div>

      {/* Input Message Form */}
      <div className="apple-card p-2 sm:p-2.5">
        <form onSubmit={handleSend} className="flex items-center gap-1.5 sm:gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask AI about the weather in ${city}...`}
            className="flex-1 min-w-0 py-2.5 sm:py-3 px-3 sm:px-4 bg-transparent text-xs sm:text-base outline-none font-medium placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || aiLoading}
            className="apple-btn-primary px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium flex items-center gap-1.5 shrink-0"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
}
