"use client";

import { useEffect, useRef, useState } from "react";

export default function ContentProtection() {
  const [message, setMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    const showNotice = (nextMessage: string) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setMessage(nextMessage);
      timerRef.current = window.setTimeout(() => setMessage(""), 2600);
    };

    const blockContentAction = (event: Event) => {
      event.preventDefault();
      showNotice("除简历下载外，本站内容不提供复制、保存或打印。");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const blockedShortcut =
        (event.ctrlKey || event.metaKey) && ["a", "c", "p", "s", "u", "x"].includes(key);

      if (blockedShortcut) blockContentAction(event);
      if (event.key === "PrintScreen") {
        event.preventDefault();
        showNotice("网页无法控制系统截图，页面内容已加入版权水印。");
      }
    };

    document.addEventListener("contextmenu", blockContentAction, true);
    document.addEventListener("copy", blockContentAction, true);
    document.addEventListener("cut", blockContentAction, true);
    document.addEventListener("dragstart", blockContentAction, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("contextmenu", blockContentAction, true);
      document.removeEventListener("copy", blockContentAction, true);
      document.removeEventListener("cut", blockContentAction, true);
      document.removeEventListener("dragstart", blockContentAction, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={`content-protection-notice${message ? " is-visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
