/** Клиентское скачивание текстового файла (Markdown/JSON). */
export function downloadTextFile(filename: string, content: string, mime: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // освобождаем URL с небольшой задержкой, чтобы клик успел обработаться
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
