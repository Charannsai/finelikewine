"use client";
/**
 * Chat · finelikewine
 * React + Tailwind, no other dependencies. Colors come from the theme tokens in app/globals.css.
 * Fills its container's height.
 */
import React, { useEffect, useRef, useState } from "react";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
type Msg = { me: boolean; text: string; at: string };

const REPLIES = ["Nice. Send it over when you can.", "Agreed, let’s ship it Friday.", "Ha, fair point.", "On it, give me ten minutes.", "Looks good to me."];
const START: Msg[] = [
  { me: false, text: "Did the new empty states land?", at: "10:02" },
  { me: true, text: "Yes, merged an hour ago.", at: "10:03" },
  { me: false, text: "Dark mode too?", at: "10:03" },
];
const clock = () => new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false });

export default function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>(START);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const turn = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => { const el = scroller.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }, [msgs, typing]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setMsgs(m => [...m, { me: true, text: body, at: clock() }]);
    setText("");
    const reply = REPLIES[turn.current++ % REPLIES.length];
    timers.current.push(
      setTimeout(() => setTyping(true), 600),
      setTimeout(() => { setTyping(false); setMsgs(m => [...m, { me: false, text: reply, at: clock() }]); }, 2000),
    );
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center py-3">
      <style>{`@keyframes chat-in { from { opacity: 0; filter: blur(6px); transform: translateY(6px) } to { opacity: 1; filter: none; transform: none } }
@keyframes chat-dot { 0%,80%,100% { opacity: .25; transform: translateY(0) } 40% { opacity: 1; transform: translateY(-3px) } }`}</style>
      <div className="flex h-full w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-line2 bg-surface">
        <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#7d9bd8] text-[11px] font-semibold text-white">
            JR<span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green ring-2 ring-surface" />
          </span>
          <div><div className="text-[13px] font-medium">Jon Reyes</div><div className="text-[11px] text-ink3">{typing ? "typing…" : "online"}</div></div>
        </div>

        <div ref={scroller} className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3.5 py-3">
          <div className="mb-1 self-center text-[11px] text-ink3">Today</div>
          {msgs.map((m, i) => (
            <div key={i} className={cx("group flex max-w-[80%] flex-col", m.me ? "items-end self-end" : "items-start self-start")} style={{ animation: "chat-in .6s cubic-bezier(.16,1,.3,1)" }}>
              <div className={cx("rounded-2xl px-3 py-2 text-[13px] leading-snug", m.me ? "rounded-br-md bg-ink text-onink" : "rounded-bl-md bg-surface2 text-ink")}>{m.text}</div>
              <span className="mt-0.5 h-3.5 font-mono text-[10px] text-ink3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">{m.at}</span>
            </div>
          ))}
          {typing && (
            <div className="flex gap-1 self-start rounded-2xl rounded-bl-md bg-surface2 px-3 py-2.5" style={{ animation: "chat-in .5s ease" }}>
              {[0, 1, 2].map(i => <i key={i} className="h-1.5 w-1.5 rounded-full bg-ink3" style={{ animation: `chat-dot 1.1s ${i * 0.15}s infinite` }} />)}
            </div>
          )}
        </div>

        <form onSubmit={send} className="flex gap-1.5 border-t border-line p-2">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message" aria-label="Message"
            className="h-9 flex-1 rounded-lg bg-surface2 px-3 text-[13px] placeholder:text-ink3 focus:outline-none focus:ring-2 focus:ring-wine/30" />
          <button type="submit" disabled={!text.trim()} aria-label="Send" className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-onink transition-opacity duration-300 disabled:opacity-35">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
