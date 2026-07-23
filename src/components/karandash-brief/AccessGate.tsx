"use client";

import { useState, type FormEvent } from "react";
import { Lock } from "@/components/karandash-brief/icons";
import { Card, PrimaryButton, Eyebrow } from "./ui";

export function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/karandash-brief/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, website })
      });
      if (res.ok) {
        onUnlock();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setMessage(data.error || "Неверный код доступа");
    } catch {
      setStatus("error");
      setMessage("Не удалось проверить код. Проверьте соединение и попробуйте ещё раз.");
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-16">
      <Card className="w-full">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container">
          <Lock className="text-primary" size={22} aria-hidden />
        </div>
        <Eyebrow>Только для владельцев</Eyebrow>
        <h1 className="font-kbh text-2xl font-bold text-graphite">Бриф по новому сайту «Карандаш»</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Эта страница предназначена для владельцев компании. Введите код доступа, чтобы продолжить.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-graphite">Код доступа</span>
            <input
              type="password"
              autoComplete="off"
              className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-secondary-container"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-invalid={status === "error" || undefined}
              required
            />
          </label>
          {/* honeypot — скрыто от людей */}
          <div className="absolute h-0 w-0 overflow-hidden" aria-hidden>
            <label>
              Не заполняйте это поле
              <input
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>
          {status === "error" ? (
            <p className="text-sm font-medium text-redBrand" role="alert">
              {message}
            </p>
          ) : null}
          <PrimaryButton type="submit" className="w-full" disabled={status === "loading" || !code}>
            {status === "loading" ? "Проверяем…" : "Войти"}
          </PrimaryButton>
        </form>
      </Card>
    </main>
  );
}
