import { readFile } from "node:fs/promises"
import path from "node:path"

/**
 * Hidden, link-only reader for the СОСПП expert analysis of the draft
 * Concept of the Investment Strategy of Sverdlovsk Oblast to 2035.
 *
 * Same opt-out philosophy as the `/p/` screenplay reader:
 *   - the analysis MARKDOWN itself lives OUTSIDE the repo, on the VM, at the
 *     directory given by env SOSPP_ANALYSIS_DIR (nothing confidential in git);
 *   - the URL token must equal env SOSPP_ANALYSIS_SLUG (the secret path never
 *     enters the repo either);
 *   - routes are noindex, excluded from sitemap and robots.txt, 404 otherwise.
 *
 * Safe to ship these files publicly: without both env vars set, every route 404s.
 */

export type AnalysisDoc = {
  /** URL slug under /r/<token>/<slug> */
  slug: string
  /** filename on disk inside SOSPP_ANALYSIS_DIR */
  file: string
  /** number badge for the overview grid */
  num: string
  title: string
  blurb: string
  group: "Обзор" | "Аудит" | "Сравнение и нормы" | "Доработка" | "Документы"
}

export const ANALYSIS_TITLE =
  "Экспертиза Концепции Инвестиционной стратегии Свердловской области до 2035 года"

export const ANALYSIS_INTRO =
  "Комплексная экспертиза трёх документов, представленных на заочное голосование экспертного совета СОСПП: инвентаризация, карта полноты, аудит промышленной и инвестиционной части, бенчмаркинг регионов, система KPI, нормативная проверка и план доработки."

export const DOCS: AnalysisDoc[] = [
  { slug: "rezume", num: "13", file: "13_Резюме_для_руководства.md", group: "Обзор",
    title: "Резюме для руководства", blurb: "Главное: 10 недостатков, 10 предложений, решение по голосованию." },
  { slug: "readme", num: "00", file: "00_README.md", group: "Обзор",
    title: "О работе и составе", blurb: "Что анализировалось, как извлекались данные, оговорки о достоверности." },
  { slug: "pasport", num: "01", file: "01_Паспорт_и_инвентаризация_документов.md", group: "Обзор",
    title: "Паспорт и инвентаризация", blurb: "Три документа, их назначение, взаимосвязь и степень готовности." },

  { slug: "polnota", num: "02", file: "02_Карта_полноты_документов.md", group: "Аудит",
    title: "Карта полноты документов", blurb: "Поструктурный аудит заполненности и перечень пробелов." },
  { slug: "promyshlennost", num: "03", file: "03_Аудит_промышленной_стратегии.md", group: "Аудит",
    title: "Аудит промышленной части", blurb: "Промышленный контур как объект инвестиционной политики." },
  { slug: "investicii", num: "04", file: "04_Аудит_инвестиционной_стратегии.md", group: "Аудит",
    title: "Аудит инвестиционной стратегии", blurb: "Позиционирование, портфель, путь инвестора, меры поддержки." },
  { slug: "soglasovannost", num: "05", file: "05_Согласованность_трёх_документов.md", group: "Аудит",
    title: "Согласованность документов", blurb: "Противоречия, дублирование и связь промышленной/инвестиционной политики." },

  { slug: "regiony", num: "06", file: "06_Сравнение_с_другими_регионами.md", group: "Сравнение и нормы",
    title: "Сравнение с регионами", blurb: "Бенчмаркинг: Татарстан, Калужская, Тюменская и др. Лучшие практики." },
  { slug: "normativ", num: "07", file: "07_Нормативная_проверка.md", group: "Сравнение и нормы",
    title: "Нормативная проверка", blurb: "Соответствие 172-ФЗ, наццелям, СПР РФ, инвестстандарту." },

  { slug: "zapolnenie", num: "08", file: "08_Рекомендации_по_заполнению.md", group: "Доработка",
    title: "Рекомендации по заполнению", blurb: "Что, откуда и в какой форме добавить по каждому слабому разделу." },
  { slug: "formulirovki", num: "09", file: "09_Проекты_готовых_формулировок.md", group: "Доработка",
    title: "Проекты готовых формулировок", blurb: "Готовый текст разделов в официально-деловом стиле." },
  { slug: "kpi", num: "10", file: "10_Система_KPI.md", group: "Доработка",
    title: "Система KPI и риски", blurb: "4-уровневая система показателей и матрица рисков." },
  { slug: "plan", num: "11", file: "11_План_доработки_документов.md", group: "Доработка",
    title: "План доработки", blurb: "Дорожная карта: приоритеты А/Б/В/Г, ответственные, сроки." },
  { slug: "struktura", num: "12", file: "12_Рекомендуемая_структура_итоговой_стратегии.md", group: "Доработка",
    title: "Структура итоговой стратегии", blurb: "Предлагаемое оглавление из 31 раздела со статусами." },

  { slug: "spravka", num: "★", file: "Справка_рекомендации_Министерству.md", group: "Документы",
    title: "Справка с рекомендациями Министерству", blurb: "Официальная сводная справка по итогам анализа." },
  { slug: "istochniki", num: "14", file: "14_Реестр_источников.md", group: "Документы",
    title: "Реестр источников", blurb: "Документы, статистика, нормативные акты, интернет-ссылки." },
]

export const GROUP_ORDER: AnalysisDoc["group"][] = [
  "Обзор", "Аудит", "Сравнение и нормы", "Доработка", "Документы",
]

export function getSlug(): string | null {
  return process.env.SOSPP_ANALYSIS_SLUG || null
}

function getDir(): string | null {
  return process.env.SOSPP_ANALYSIS_DIR || null
}

export function findDoc(slug: string): AnalysisDoc | undefined {
  return DOCS.find((d) => d.slug === slug)
}

/**
 * Rewrites intra-corpus markdown so links work inside the reader:
 *   - links to other analysis .md files → ./<slug> (sibling route)
 *   - links to original downloads (.xlsx/.docx/.html/.pdf) → plain bold text
 * External http(s) links are left intact (opened in a new tab by Markdown).
 */
function rewriteLinks(md: string): string {
  // [text](NN_Something.md) or (strategy_analysis_result/NN_Something.md[:line])
  let out = md.replace(
    /\]\((?:strategy_analysis_result\/)?([^()\s]+\.md)(?::\d+)?\)/g,
    (whole, fname: string) => {
      const base = decodeURIComponent(fname).split("/").pop() || fname
      const doc = DOCS.find((d) => d.file === base)
      return doc ? `](./${doc.slug})` : "]()"
    },
  )
  // Downloadable originals that don't live on the site → drop the link, keep label
  out = out.replace(
    /\[([^\]]+)\]\((?:strategy_analysis_result\/)?[^()\s]+\.(?:xlsx|docx|pdf|html)\)/gi,
    (_whole, label: string) => `**${label}**`,
  )
  return out
}

export async function readDoc(slug: string): Promise<string | null> {
  const dir = getDir()
  const doc = findDoc(slug)
  if (!dir || !doc) return null
  try {
    const raw = await readFile(path.join(dir, doc.file), "utf8")
    return rewriteLinks(raw)
  } catch {
    return null
  }
}
