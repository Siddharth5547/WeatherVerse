import { motion } from "framer-motion";
import { Bot, Sparkles, Copy, RefreshCw } from "lucide-react";

function AIAssistant({
  advice,
  loading,
  onRegenerate,
  theme,
}) {
  async function copyAdvice() {
    if (!advice) return;

    await navigator.clipboard.writeText(advice);
    alert("AI advice copied!");
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-8 rounded-3xl p-6 border backdrop-blur-xl
        ${
          theme === "dark"
            ? "bg-white/10 border-white/20"
            : "bg-white border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3 mb-5">
          <Bot className="text-cyan-400" size={28} />
          <h2 className="text-xl font-bold">
            AI Weather Assistant
          </h2>
        </div>

        <div className="space-y-4 animate-pulse">

          <div className="h-4 rounded bg-slate-500/30"></div>
          <div className="h-4 rounded w-11/12 bg-slate-500/30"></div>
          <div className="h-4 rounded w-9/12 bg-slate-500/30"></div>

          <div className="h-4 rounded mt-8 bg-slate-500/30"></div>
          <div className="h-4 rounded w-10/12 bg-slate-500/30"></div>

          <div className="h-4 rounded mt-8 bg-slate-500/30"></div>
          <div className="h-4 rounded w-8/12 bg-slate-500/30"></div>

        </div>
      </motion.div>
    );
  }

  if (!advice) return null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className={`mt-8 rounded-3xl border backdrop-blur-xl overflow-hidden
      ${
        theme === "dark"
          ? "bg-white/10 border-white/20"
          : "bg-white border-slate-300 shadow-xl"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="p-3 rounded-full bg-cyan-500">

            <Bot className="text-white" />

          </div>

          <div>

            <h2 className="text-xl font-bold">
              AI Weather Assistant
            </h2>

            <p className="text-sm opacity-70">
              Powered by Gemini 3.5 Flash
            </p>

          </div>

        </div>

        <Sparkles
          className="text-yellow-400"
          size={28}
        />

      </div>

      <div className="px-6 py-6 whitespace-pre-line leading-8">

        {advice}

      </div>

      <div className="flex gap-3 p-5">

        <button
          onClick={copyAdvice}
          className="flex-1 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition py-3 text-white flex items-center justify-center gap-2"
        >
          <Copy size={18} />
          Copy
        </button>

        <button
          onClick={onRegenerate}
          className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 transition py-3 text-white flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          Regenerate
        </button>

      </div>

    </motion.div>
  );
}

export default AIAssistant;