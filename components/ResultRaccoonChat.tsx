"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { AnalysisResult } from "@/lib/claim-analysis";

type Sender = "user" | "bot";

interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
}

interface ResultRaccoonChatProps {
  result: AnalysisResult;
}

export default function ResultRaccoonChat({ result }: ResultRaccoonChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "bot",
      text: `Detective Raccoon reporting. I am focused on ${result.productName} only. Ask me about score, ingredients, risks, or alternatives.`,
    },
  ]);

  const quickPrompts = useMemo(
    () => ["Why this score?", "Harmful ingredients?", "Any false claims?", "Best alternatives?"],
    []
  );

  const sendMessage = async (text: string) => {
    const cleaned = text.trim();
    if (!cleaned || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: cleaned,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setIsSending(true);
      const recentMessages = [...messages, userMessage].slice(-8).map((message) => ({
        role: message.sender === "bot" ? "assistant" : "user",
        text: message.text,
      }));

      const response = await fetch("/api/result-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: cleaned,
          result,
          recentMessages,
        }),
      });

      const payload = (await response.json()) as { answer?: string; error?: string; message?: string };
      const botText =
        response.ok && payload.answer
          ? payload.answer
          : payload.message || payload.error || "I could not respond right now. Please try again.";

      const botMessage: ChatMessage = {
        id: `b-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        sender: "bot",
        text: botText,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const botMessage: ChatMessage = {
        id: `b-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        sender: "bot",
        text: "I could not respond right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-200/50 bg-[#03133f] shadow-[0_12px_40px_rgba(3,19,63,0.65)] transition hover:scale-105"
        aria-label="Open Detective Raccoon chat"
      >
        <Image src="/logo_mascot.png" alt="Detective Raccoon" width={44} height={44} className="h-11 w-11 object-contain" />
      </button>

      {open ? (
        <div className="fixed bottom-26 right-6 z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-cyan-200/30 bg-[#061640]/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/15 px-4 py-3">
            <Image src="/logo_mascot.png" alt="Detective Raccoon" width={34} height={34} className="h-8 w-8 object-contain" />
            <div>
              <p className="text-sm font-semibold text-white">Detective Raccoon</p>
              <p className="text-xs text-cyan-100">Context locked: {result.productName}</p>
            </div>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-xl px-3 py-2 text-sm ${
                  message.sender === "bot"
                    ? "border border-cyan-300/30 bg-cyan-400/10 text-cyan-50"
                    : "border border-white/25 bg-white/10 text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-white/15 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  disabled={isSending}
                  className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100 transition hover:bg-cyan-400/20"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder="Ask about this scanned item"
                className="w-full rounded-xl border border-white/20 bg-[#031239] px-3 py-2 text-sm text-white outline-none placeholder:text-cyan-100/70"
              />
              <button
                type="button"
                onClick={() => void sendMessage(input)}
                disabled={isSending}
                className="rounded-xl bg-cyan-300 px-3 py-2 text-sm font-semibold text-[#05204f] transition hover:scale-[1.02] disabled:opacity-60"
              >
                {isSending ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
