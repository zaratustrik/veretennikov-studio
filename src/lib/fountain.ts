/**
 * Minimal Fountain screenplay parser — supports the subset our drafts use.
 * https://fountain.io/syntax
 *
 * Tokens emitted: titlePage, section, scene, action, character, parenthetical,
 * dialogue.
 *
 * Notes vs the spec:
 *  - Forced scene headings (`.INT.`, `.EXT.`) work for any language; the lead
 *    dot is required for non-Latin headings (our Russian drafts use it).
 *  - "Latin auto-detect" for `INT.`/`EXT.` also works.
 *  - Centered text `> text <`, notes `[[…]]`, transitions are unused so
 *    skipped.
 */

export type Token =
  | { kind: "section"; level: number; text: string }
  | { kind: "scene"; id: number; heading: string; location: "INT" | "EXT" | "OTHER" }
  | { kind: "action"; lines: string[] }
  | { kind: "character"; name: string; dualDialogue: boolean }
  | { kind: "parenthetical"; text: string }
  | { kind: "dialogue"; lines: string[] };

export interface Scene {
  id: number;
  heading: string;
  location: "INT" | "EXT" | "OTHER";
  tokens: Token[];
  /** Index of this scene's first token in the flat tokens stream. */
  startTokenIndex: number;
}

export interface Act {
  /** "АКТ 1", "АКТ 2", etc. */
  title: string;
  scenes: Scene[];
}

export interface ParsedScreenplay {
  titlePage: Record<string, string>;
  acts: Act[];
  /** Total scene count across acts. */
  sceneCount: number;
  /** Naïve word count (for runtime estimate). */
  wordCount: number;
  /** ~1 page = 1 min of screen time. Сценарная страница ≈ 150 слов (короткие
   *  строки слаглайнов/имён/реплик), не 250 как в прозе. */
  estimatedRuntimeMin: number;
}

/**
 * Russian plural form picker. `forms` = [one, few, many].
 *   ruPlural(1, ['сцена','сцены','сцен']) → 'сцена'
 *   ruPlural(3, ['акт','акта','актов']) → 'акта'
 *   ruPlural(33, [...]) → uses last-digit rule, not raw number
 */
export function ruPlural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return forms[2]
  if (last === 1) return forms[0]
  if (last >= 2 && last <= 4) return forms[1]
  return forms[2]
}

/* ─── helpers ──────────────────────────────────────────────────────── */

const SCENE_LATIN_RE = /^(INT\.|EXT\.|EST\.|INT\.\/EXT\.|I\/E\.)/i;

function isSceneHeading(line: string): boolean {
  if (line.startsWith(".") && !line.startsWith("..")) return true;
  return SCENE_LATIN_RE.test(line);
}

function sceneLocation(heading: string): "INT" | "EXT" | "OTHER" {
  const up = heading.toUpperCase();
  if (up.includes("INT.") || up.includes("ИНТ.")) return "INT";
  if (up.includes("EXT.") || up.includes("НАТ.")) return "EXT";
  return "OTHER";
}

function stripSceneDot(line: string): string {
  return line.startsWith(".") ? line.slice(1).trim() : line.trim();
}

/**
 * Character cue: an ALL-CAPS line followed (after no blank gap) by a non-empty
 * line. We accept Latin AND Cyrillic uppercase. Allow `(CONT'D)`, `(V.O.)`,
 * etc. in parentheses after the name.
 */
function isCharacterCue(line: string, nextLine?: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length === 0 || trimmed.length > 50) return false;
  if (!nextLine || nextLine.trim().length === 0) return false;
  // Strip trailing parenthetical extension like `(V.O.)` or `(CONT'D)`.
  const base = trimmed.replace(/\s*\([^)]+\)\s*$/, "");
  // Must contain at least one letter and be ALL UPPERCASE.
  if (!/[A-ZА-ЯЁ]/.test(base)) return false;
  // Must not contain LOWERCASE letters.
  if (/[a-zа-яё]/.test(base)) return false;
  return true;
}

function isParenthetical(line: string): boolean {
  const t = line.trim();
  return t.startsWith("(") && t.endsWith(")") && t.length > 2;
}

/* ─── parser ───────────────────────────────────────────────────────── */

export function parseFountain(raw: string): ParsedScreenplay {
  // Boneyard `/* … */` — заметки автора, по спецификации Fountain не входят в
  // сценарий. Вырезаем, чтобы журнал разработки не рендерился в читальне и не
  // раздувал счётчик хронометража.
  const text = raw
    .replace(/\r\n?/g, "\n")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  const lines = text.split("\n");

  /* Title page: collected until first blank line followed by `===` divider or
   * the first non-title-page block. Convention: key:value pairs, with values
   * possibly on continuation indented lines. */
  const titlePage: Record<string, string> = {};
  let i = 0;
  const titleEnd = lines.findIndex((l) => /^=+$/.test(l.trim()));
  const hasTitlePage =
    titleEnd > 0 && /^[A-Za-zА-Яа-яёЁ][^:]*:\s*\S/.test(lines[0] ?? "");
  if (hasTitlePage) {
    let lastKey: string | null = null;
    for (let j = 0; j < titleEnd; j++) {
      const ln = lines[j];
      const m = ln.match(/^([A-Za-zА-Яа-яёЁ][\w\s-]*?):\s*(.*)$/);
      if (m) {
        lastKey = m[1].trim();
        titlePage[lastKey] = m[2].trim();
      } else if (lastKey && ln.startsWith(" ")) {
        titlePage[lastKey] = (titlePage[lastKey] + " " + ln.trim()).trim();
      }
    }
    i = titleEnd + 1;
    while (i < lines.length && lines[i].trim() === "") i++;
  }

  /* Now tokenise the body. Walk line by line, building blocks. */
  const tokens: Token[] = [];
  let nextSceneId = 1;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();

    if (line.trim() === "") {
      i++;
      continue;
    }

    /* Section (# Heading) */
    if (line.startsWith("#")) {
      const m = line.match(/^(#+)\s*(.*)$/);
      if (m) {
        tokens.push({ kind: "section", level: m[1].length, text: m[2].trim() });
        i++;
        continue;
      }
    }

    /* Synopsis (= ...) and === divider — skip */
    if (line.startsWith("=")) {
      i++;
      continue;
    }

    /* Scene heading */
    if (isSceneHeading(line)) {
      const heading = stripSceneDot(line);
      tokens.push({
        kind: "scene",
        id: nextSceneId++,
        heading,
        location: sceneLocation(heading),
      });
      i++;
      continue;
    }

    /* Character cue + dialogue block */
    if (isCharacterCue(line, lines[i + 1])) {
      const trimmed = line.trim();
      const dualDialogue = trimmed.endsWith("^");
      const name = (dualDialogue ? trimmed.slice(0, -1) : trimmed).trim();
      tokens.push({ kind: "character", name, dualDialogue });
      i++;
      // Optional parenthetical right under the cue
      if (i < lines.length && isParenthetical(lines[i])) {
        tokens.push({
          kind: "parenthetical",
          text: lines[i].trim().slice(1, -1),
        });
        i++;
      }
      // Dialogue: collect lines until blank
      const dialogueLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "") {
        // Mid-dialogue parenthetical splits the dialogue
        if (isParenthetical(lines[i])) {
          if (dialogueLines.length > 0) {
            tokens.push({ kind: "dialogue", lines: dialogueLines.slice() });
            dialogueLines.length = 0;
          }
          tokens.push({
            kind: "parenthetical",
            text: lines[i].trim().slice(1, -1),
          });
          i++;
          continue;
        }
        dialogueLines.push(lines[i].trim());
        i++;
      }
      if (dialogueLines.length > 0) {
        tokens.push({ kind: "dialogue", lines: dialogueLines });
      }
      continue;
    }

    /* Action paragraph: collect contiguous non-empty lines */
    const actionLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "") {
      // Stop if the next line looks like a scene or section start
      const cur = lines[i].trimEnd();
      if (
        cur.startsWith("#") ||
        cur.startsWith("=") ||
        isSceneHeading(cur) ||
        (actionLines.length > 0 && isCharacterCue(cur, lines[i + 1]))
      ) {
        break;
      }
      actionLines.push(lines[i].trim());
      i++;
    }
    if (actionLines.length > 0) {
      tokens.push({ kind: "action", lines: actionLines });
    }
  }

  /* Group into acts + scenes. */
  const acts: Act[] = [];
  let currentAct: Act | null = null;
  let currentScene: Scene | null = null;

  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx];

    if (t.kind === "section" && t.level === 1) {
      // New act
      // "АКТ 1", "КОНЕЦ АКТА 1", "КОНЕЦ" — only start new act on patterns that
      // are NOT closures.
      const text = t.text.toUpperCase();
      if (text.startsWith("КОНЕЦ")) {
        currentAct = null;
        currentScene = null;
        continue;
      }
      currentAct = { title: t.text, scenes: [] };
      acts.push(currentAct);
      currentScene = null;
      continue;
    }

    if (t.kind === "scene") {
      // Auto-create a default act if the script forgot to open one
      if (!currentAct) {
        currentAct = { title: "АКТ", scenes: [] };
        acts.push(currentAct);
      }
      currentScene = {
        id: t.id,
        heading: t.heading,
        location: t.location,
        tokens: [],
        startTokenIndex: idx,
      };
      currentAct.scenes.push(currentScene);
      continue;
    }

    // Skip lower-level sections (unused)
    if (t.kind === "section") continue;

    if (currentScene) {
      currentScene.tokens.push(t);
    }
  }

  /* Stats */
  let wordCount = 0;
  const countWords = (s: string) => s.split(/\s+/).filter(Boolean).length;
  for (const act of acts) {
    for (const sc of act.scenes) {
      wordCount += countWords(sc.heading);
      for (const tok of sc.tokens) {
        // Считаем всё, что занимает место на странице: действие, реплики,
        // а также имена-cue и ремарки (в диалоговых сценах их много, и они
        // съедают страницу не хуже текста). Иначе счётчик занижает хронометраж
        // диалоговых сцен.
        if (tok.kind === "action" || tok.kind === "dialogue") {
          wordCount += countWords(tok.lines.join(" "));
        } else if (tok.kind === "character") {
          wordCount += countWords(tok.name);
        } else if (tok.kind === "parenthetical") {
          wordCount += countWords(tok.text);
        }
      }
    }
  }

  const sceneCount = acts.reduce((a, x) => a + x.scenes.length, 0);
  const estimatedRuntimeMin = Math.round(wordCount / 150);

  return { titlePage, acts, sceneCount, wordCount, estimatedRuntimeMin };
}
