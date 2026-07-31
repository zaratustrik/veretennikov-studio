# -*- coding: utf-8 -*-
"""Генератор данных закрытой страницы «Инвестклимат Свердловской области».
Источники: аналитический корпус _ANALIZ (см. docs/investment-climate-content-model.md).
Запуск: python scripts/build-invest-climate-data.py
Выход: src/data/investment-climate/*.json + отчёт валидации в stdout.
"""
import json, csv, re, sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

AN = Path(r"C:\Users\Home-PC\OneDrive\Документы\_ANALIZ")
CORPUS = AN / "sverdlovsk_investment_climate_corpus_2026"
FA = AN / "final_analysis"
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "investment-climate"
OUT.mkdir(parents=True, exist_ok=True)

rows = json.loads((CORPUS / "data/roadmap_rows.json").read_text(encoding="utf-8"))
pre = json.loads((CORPUS / "data/preliminary_assessments.json").read_text(encoding="utf-8"))
with open(FA / "07_revised_roadmap.csv", encoding="utf-8-sig", newline="") as f:
    revised = {int(r["row_id"]): r for r in csv.DictReader(f)}

# ---- парсинг карточек 05_roadmap_item_by_item.md ----
md = (FA / "05_roadmap_item_by_item.md").read_text(encoding="utf-8")
cards = {}
for m in re.finditer(r"### Строка (\d+)[^\n]*\n(.*?)(?=### Строк|## Показатель|# Сводная|\Z)", md, re.S):
    n, body = int(m.group(1)), m.group(2)
    def grab(label):
        mm = re.search(r"\*\*" + label + r":\*\*\s*(.*?)(?=\n\*\*|\n###|\Z)", body, re.S)
        return re.sub(r"\s+", " ", mm.group(1)).strip() if mm else ""
    cards[n] = {
        "why": grab("Почему") or grab("Обоснование"),
        "problem": grab("Подтвержденная проблема") or grab("Обоснование"),
        "causalGap": grab("Разрыв причинной цепочки") or grab("Разрыв цепочки"),
        "formalRisk": grab("Риск формального исполнения") or grab("Риск манипулирования") or grab("Риск"),
        "verdictLine": grab("Вердикт"),
    }

V_MAP = [
    (r"Сохранить", "keep"), (r"сохранить", "keep"),
    (r"Уточнить|уточнить|Довести", "improve"),
    (r"[Пп]ереработать|[Пп]ереписать|перепроектир|Конкретизировать|Автоматизировать|Отклонить", "rewrite"),
    (r"[Оо]бъединить", "merge"),
    (r"Исключить|Операционное|Вторичное|Маркетинговая", "remove"),
    (r"Проверить", "conditional"),
    (r"Заполнить", "fill-new"),
]
PRIORITY = {"Высокое": "critical", "Среднее": "high", "Низкое": "medium", "Очень низкое": "low", "Не доказано": "medium"}
IMPACT = {"Высокое": 3, "Среднее": 2, "Низкое": 1, "Очень низкое": 1, "Не доказано": 1}
DEFECTS = {8: "D-01", 21: "D-02", 24: "D-03", 27: "D-04", 33: "D-05", 34: "D-05", 35: "D-05", 36: "D-05", 43: "D-06"}
ISSUES_BY_ITEM = {  # problem-ids (см. problems ниже)
    1: ["formal-kpi"], 2: ["formal-kpi"], 3: ["no-investor-feedback"], 4: ["no-sla-monitoring"],
    5: ["no-sla-monitoring", "interagency-gap"], 6: ["no-sla-monitoring", "municipal-weak"],
    7: ["interagency-gap"], 8: ["digital-fragmentation", "formal-kpi"], 9: ["no-investor-feedback", "manual-comms"],
    10: ["municipal-weak", "formal-kpi"], 11: ["no-project-card", "no-sla-monitoring"], 12: ["manual-comms"],
    13: ["formal-kpi", "no-order-control"], 14: ["no-order-control", "formal-kpi"], 15: ["formal-kpi"],
    16: ["no-investor-feedback", "no-order-control"], 17: ["no-order-control"], 18: ["no-order-control"],
    19: ["interagency-gap"], 20: ["formal-kpi"], 21: ["formal-kpi", "no-order-control"], 22: ["formal-kpi"],
    23: ["no-investor-feedback"], 24: ["manual-comms"], 25: ["digital-fragmentation"], 26: ["formal-kpi"],
    27: ["no-order-control"], 28: ["formal-kpi"], 29: ["formal-kpi"], 30: ["stale-data"],
    31: ["digital-fragmentation", "no-sla-monitoring"], 32: ["interagency-gap"],
    33: ["no-project-card", "digital-fragmentation"], 34: ["no-project-card"], 35: ["no-sla-monitoring"],
    36: ["digital-fragmentation"], 37: ["formal-kpi"], 38: ["formal-kpi", "stale-data"],
    39: ["digital-fragmentation", "stale-data"], 40: ["formal-kpi"], 41: ["stale-data", "municipal-weak"],
    42: ["stale-data"], 43: ["no-project-card", "digital-fragmentation"],
}
BENCH_BY_ITEM = {
    1: ["intl-rw-charter", "intl-ca-fees"], 2: ["intl-ca-fees"], 3: ["intl-ae-mystery"],
    4: ["intl-kr-seumter", "intl-ge-permits", "ru-mo-css"], 5: ["intl-ge-utility", "ru-lo-green"],
    6: ["intl-uk-planning", "ru-rb-sheriffs"], 7: [], 8: ["ru-msk-lk", "ru-mo-uslugi"],
    9: ["ru-rb-sheriffs"], 10: ["ru-rb-sheriffs"], 11: ["ru-mo-css", "intl-lt-crm"],
    12: ["intl-sg-pep"], 13: ["intl-wb-sirm"], 14: ["intl-kr-ombudsman"], 15: [],
    16: ["intl-kr-ombudsman", "intl-ge-ombudsman", "intl-wb-sirm"], 17: ["intl-uk-planning"],
    18: ["intl-uk-planning"], 19: ["intl-wb-sirm"], 20: [], 21: [], 22: [],
    23: ["intl-sg-pep"], 24: ["intl-uk-datahub"], 25: ["intl-sg-pep"], 26: [], 27: ["ru-rb-sheriffs", "intl-kr-ombudsman"],
    28: [], 29: ["intl-lt-crm"], 30: ["intl-cz-sites", "intl-de-gtai", "ru-rt-map"],
    31: ["intl-ae-dewa", "intl-ge-utility"], 32: ["ru-mo-css", "intl-wb-sirm"],
    33: ["intl-rw-osc", "ru-msk-lk", "intl-nl-once"], 34: ["intl-kr-homedoc", "intl-ie-ida"],
    35: ["intl-ca-fees", "intl-rw-charter"], 36: ["ru-msk-lk"], 37: [], 38: [],
    39: ["ru-rt-map", "intl-nl-pdok", "ru-fed-map"], 40: [], 41: ["intl-pl-paih", "intl-nl-terug"],
    42: ["intl-nl-terug", "intl-cz-sites", "ru-fed-map"], 43: ["ru-rt-map", "intl-cz-sites"],
}
SOURCES_BY_ITEM = {i: ["DOCX"] for i in range(1, 44)}
for i, extra in {1: ["SRC-10"], 3: ["SRC-03"], 4: ["REG-12", "REG-13"], 5: ["REG-04", "REG-11"],
                 6: ["AUDIT-TP"], 8: ["AUDIT-LK"], 9: ["REG-09"], 10: ["AUDIT-TP"], 11: ["AUDIT-PORTAL", "SRC-03"],
                 12: ["REG-09"], 13: ["REG-04"], 14: ["REG-04"], 16: ["REG-05", "REG-06", "REG-07", "REG-08"],
                 17: ["REG-04"], 18: ["REG-04"], 21: ["FC"], 23: ["REG-09"], 24: ["FC", "REG-09"],
                 25: ["REG-09"], 27: ["FC", "GUB"], 29: ["REG-09"], 30: ["REG-09"], 31: ["AUDIT-LK", "AUDIT-TP", "REG-04"],
                 32: ["REG-04"], 33: ["AUDIT-LK"], 34: ["AUDIT-PORTAL"], 35: ["AUDIT-PORTAL"], 36: ["AUDIT-LK"],
                 37: ["AUDIT-MAP"], 38: ["AUDIT-MAP", "SRC-03"], 39: ["AUDIT-MAP", "SRC-03"],
                 41: ["SRC-03"], 42: ["SRC-03"], 43: ["FC", "SRC-03"]}.items():
    SOURCES_BY_ITEM[i] += extra

RESP_GROUP = lambda r: ("agency" if "Агентство" in r else "digital" if "цифрового" in r else "ministry" if r else "none")
CONF = {"A": "official", "A/B": "official", "B": "multi-source", "C": "analytical"}

items = []
for r in rows:
    i = r["row"]
    rv = revised[i]
    p = pre.get(str(i), ["", "Среднее", "", ""])
    infl = p[1] or "Среднее"
    card = cards.get(i, {})
    vlabel = rv["verdict"]
    verdict = next((v for pat, v in V_MAP if re.search(pat, vlabel)), "improve")
    vals = [x.strip() for x in r["values"].split("/")]
    grade = rv["confidence"]
    item = {
        "id": i,
        "indicatorCode": r["indicator"].split(" ")[0].rstrip("."),
        "indicatorName": r["indicator"].split(" ", 1)[1] if " " in r["indicator"] else r["indicator"],
        "baselineRating": vals[0] if vals else "",
        "targetRating": vals[1] if len(vals) > 1 else "",
        "criterion": r["criterion"],
        "originalActivity": r["activity"],
        "originalKpi": r["kpi"],
        "period": {"start": r["start"] or None, "end": r["end"] or None},
        "responsible": [x.strip() for x in r["responsible"].split(",")] if r["responsible"] else [],
        "responsibleGroup": RESP_GROUP(r["responsible"]),
        "verdict": verdict,
        "verdictLabel": vlabel,
        "influencePotential": {"Высокое": "high", "Среднее": "medium", "Низкое": "low",
                               "Очень низкое": "low", "Не доказано": "unproven"}.get(infl, "medium"),
        "ratingImpact": IMPACT.get(infl, 2),
        "investorImpact": IMPACT.get(infl, 2),
        "priority": PRIORITY.get(infl, "medium"),
        "issues": ISSUES_BY_ITEM.get(i, []),
        "defect": DEFECTS.get(i),
        "analysis": {
            "why": card.get("why", ""),
            "problem": card.get("problem", ""),
            "causalGap": card.get("causalGap", ""),
            "formalRisk": card.get("formalRisk", ""),
        },
        "proposed": {
            "activity": rv["revised_activity"],
            "kpiName": rv["outcome_kpi_name"],
            "baseline": rv["outcome_kpi_baseline"],
            "target": rv["outcome_kpi_target"],
            "formula": rv["outcome_kpi_formula"],
            "dataSource": rv["outcome_kpi_source"],
            "owner": rv["owner"],
            "stopCriterion": rv["stop_criterion"],
        },
        "benchmarkIds": BENCH_BY_ITEM.get(i, []),
        "sourceIds": SOURCES_BY_ITEM.get(i, ["DOCX"]),
        "confidence": CONF.get(grade, "analytical"),
        "evidenceGrade": grade,
    }
    item["searchText"] = " ".join([
        str(i), r["activity"], r["kpi"], r["criterion"], r["responsible"],
        vlabel, item["analysis"]["why"], item["proposed"]["activity"], item["proposed"]["kpiName"],
    ]).lower()
    items.append(item)

# ---- курируемые сущности (выжимки из final_analysis; полные тексты — в корпусе) ----
problems = [
    {"id": "formal-kpi", "title": "Формальные KPI", "description": "KPI измеряют документы и мероприятия (заключения, встречи, публикации, ТЗ, «100% содействия»), а не результат для инвестора."},
    {"id": "no-sla-monitoring", "title": "Нет контроля сроков и SLA", "description": "Нормативные сроки существуют, но фактические сроки процессов не измеряются транзакционными данными и не публикуются."},
    {"id": "interagency-gap", "title": "Межведомственные разрывы", "description": "Инвестор сам координирует органы; решения без фиксированного срока ответа ведомств."},
    {"id": "digital-fragmentation", "title": "Фрагментация цифровых сервисов", "description": "Два «личных кабинета», карта на отдельном домене, сервисы существуют, но не связаны в один путь (10 запросов мощности за всю историю)."},
    {"id": "stale-data", "title": "Неактуальные/непроверенные данные", "description": "Достоверность объектов карты проверяется по фото, а не по праву/сетям; возраст данных не контролируется."},
    {"id": "no-project-card", "title": "Нет сквозной карточки проекта", "description": "Проект существует отдельно в CRM, ВИС, ПОС и журнале комитета без единого идентификатора и видимого статуса."},
    {"id": "no-order-control", "title": "Слабый контроль исполнения поручений", "description": "«0 не исполнено» при 37 «на исполнении»: переносы сроков не учитываются, исполнение не подтверждает заявитель."},
    {"id": "no-investor-feedback", "title": "Нет подтверждения результата инвестором", "description": "Статус «решено» ставит исполнитель; повторные обращения и отказ от взаимодействия не отслеживаются."},
    {"id": "municipal-weak", "title": "Слабое муниципальное звено", "description": "Рейтинг МО смешивает работу с масштабом экономики; сроки согласований МО не публикуются."},
    {"id": "manual-comms", "title": "Ручные коммуникации и отчёты", "description": "Еженедельные ручные отчёты при наличии CRM; каналы обращений не дедуплицируются."},
]
for pr_ in problems:
    pr_["itemIds"] = [it["id"] for it in items if pr_["id"] in it["issues"]]

journey = [
    {"id": "interest", "title": "Первичный интерес", "services": ["Инвестпортал (RU/EN/CN)", "Презентация региона"], "gaps": ["Портал не ведёт к действию — нет явного첫 шага"], "itemIds": [37, 38], "proposals": ["Целевое продвижение после качества данных"]},
    {"id": "info", "title": "Поиск информации", "services": ["Портал, аналитика, справочник инвестора"], "gaps": ["Разрозненные разделы, дубли входов"], "itemIds": [8, 40], "proposals": ["Единая точка входа (ВИС)"]},
    {"id": "site", "title": "Подбор площадки", "services": ["Инвесткарта (map.invest-in-ural.ru)", "Подбор через АПИ"], "gaps": ["Карта недоступна/нестабильна; данные без паспорта достоверности"], "itemIds": [30, 39, 41, 42, 43], "proposals": ["Паспорт достоверности; подбор по карточке требований"]},
    {"id": "infra-check", "title": "Проверка инфраструктуры", "services": ["Сервис «Заявить о потребности в мощностях» (ВИС)", "Портал ТП: запрос ИОВП"], "gaps": ["10 запросов ИОВП за всю историю — сервис не работает как канал"], "itemIds": [5, 31], "proposals": ["SLA ответа РСО; интеграция ВИС ↔ портал ТП"]},
    {"id": "support-choice", "title": "Выбор мер поддержки", "services": ["Каталог ВИС (~25 услуг)", "Навигатор мер (витрина)"], "gaps": ["Нет персональной квалификации; карточки без НПА"], "itemIds": [8, 36], "proposals": ["Юридически проверяемый навигатор"]},
    {"id": "application", "title": "Подача заявки", "services": ["ВИС (ЕСИА)", "uslugi.egov66.ru (услуга 1076)", "Форма «одного окна»"], "gaps": ["Два разных ЛК; потери на авторизации не измерены"], "itemIds": [25, 33], "proposals": ["Один вход + редирект; замер потерь"]},
    {"id": "manager", "title": "Персональный менеджер", "services": ["Назначение по схеме АПИ (1 день, CRM)"], "gaps": ["Нет стандарта полномочий/замещения/портфеля"], "itemIds": [34, 11], "proposals": ["Стандарт менеджера (портфель 30–50)"]},
    {"id": "permits", "title": "Получение разрешений", "services": ["12 алгоритмов свода правил", "ГИСОГД"], "gaps": ["Фактические сроки не мониторятся; согласования последовательные"], "itemIds": [4, 6, 7], "proposals": ["Параллельные согласования; медиана/90-й процентиль"]},
    {"id": "utilities", "title": "Подключение к сетям", "services": ["Портал ТП (976 заявок)", "Алгоритм АПИ–РСО"], "gaps": ["Сроки по РСО не публикуются; неустойка ПП 861 не работает на практике"], "itemIds": [5, 31], "proposals": ["Дашборд сроков по РСО; помощь во взыскании"]},
    {"id": "build", "title": "Реализация проекта", "services": ["Сопровождение «одно окно» (CRM)", "Инвесткомитет"], "gaps": ["Статус кейса не виден инвестору; блокеры без SLA"], "itemIds": [11, 13, 32, 33], "proposals": ["Кабинет со статусами; учёт снятия блокеров"]},
    {"id": "launch", "title": "Запуск", "services": ["—"], "gaps": ["Запуск не фиксируется как событие воронки"], "itemIds": [11], "proposals": ["Медиана срока «обращение → запуск»"]},
    {"id": "aftercare", "title": "Постинвестиционное сопровождение", "services": ["Отсутствует как функция"], "gaps": ["~70% инвестиций у лидеров дают действующие инвесторы — резерв не используется"], "itemIds": [34], "proposals": ["Программа aftercare (Н1): портфельные менеджеры, health-checks"]},
]

summary = {
    "findings": [
        {"id": "f1", "thesis": "Карта измеряет активность, а не результат", "explanation": "Из 39 заполненных строк лишь ~6 имеют KPI результата для инвестора; остальные — документы, встречи, публикации.", "significance": "critical", "anchor": "#diagnostics"},
        {"id": "f2", "thesis": "Инфраструктура РИС уже есть — разрыв в связности и доказуемости", "explanation": "Декларация, комитет, CRM, ЛК, портал ТП работают; но два входа, нет сквозного ID, SLA не подтверждаются данными.", "significance": "critical", "anchor": "#journey"},
        {"id": "f3", "thesis": "Ключевые каналы не наполнены", "explanation": "Досудебный канал — 2 спора в год; цифровой запрос мощности — 10 раз за всю историю. Механизмы есть, потока нет.", "significance": "high", "anchor": "#items"},
        {"id": "f4", "thesis": "Худший показатель — Инвесткарта (4,31 против 4,57 по РФ)", "explanation": "При этом строки 37–43 — наименее результатные (SEO, посты, инструкции, ТЗ); сама карта нестабильно доступна.", "significance": "critical", "anchor": "#position"},
        {"id": "f5", "thesis": "4 критерия агентства пусты — несобранные баллы", "explanation": "Строки 33–36 (онлайн-статусы, менеджер, SLA услуг, информированность) не заполнены в проекте карты.", "significance": "high", "anchor": "#items"},
        {"id": "f6", "thesis": "Исполнение придётся на промышленный спад", "explanation": "ИПП 95,1% (2025) → 91,7% (I пол. 2026), инвестиции −7,2%. Опросные оценки будут под давлением фона; растёт ценность aftercare.", "significance": "high", "anchor": "#position"},
        {"id": "f7", "thesis": "Есть быстрые меры с высоким эффектом", "explanation": "Service Charter, 30-дневный срок ответа органов, реестр поручений, соглашения с РСО с данными — категория «организационные», без больших бюджетов.", "significance": "high", "anchor": "#proposals"},
    ],
    "priorities": [
        {"n": 1, "title": "Публичный каталог услуг с SLA (Service Charter АПИ)", "effect": "высокий", "term": "0–3 мес.", "cost": "орг."},
        {"n": 2, "title": "30-дневный срок ответа органов на решения комитета + эскалация Губернатору", "effect": "высокий", "term": "0–3 мес.", "cost": "орг."},
        {"n": 3, "title": "Машиночитаемый реестр поручений с учётом переносов", "effect": "высокий", "term": "0–3 мес.", "cost": "орг./ИТ-мин."},
        {"n": 4, "title": "Соглашения с РСО: SLA + передача транзакционных данных + дашборд", "effect": "высокий", "term": "3–6 мес.", "cost": "орг."},
        {"n": 5, "title": "Заполнить строки 33–36: кабинет, менеджер, SLA, навигатор", "effect": "критический", "term": "3–12 мес.", "cost": "ИТ-средн."},
        {"n": 6, "title": "Паспорт достоверности объектов Инвесткарты + решение по треку карты", "effect": "критический", "term": "3–6 мес.", "cost": "ИТ-средн."},
        {"n": 7, "title": "Перезапуск досудебного канала споров (triage из реестра обращений)", "effect": "высокий", "term": "0–6 мес.", "cost": "орг."},
    ],
}

new_roadmap = []
BLOCKS = {"A": "Декларация и обязательства", "Б": "Инвесткомитет и споры", "В": "Прямая и обратная связь", "Г": "Специализированная организация", "Д": "Инвестиционная карта"}
NR = [
    ("A1", "A", "Реестр обязательств декларации с SLA + публичный отчёт", [1, 2], "100% обязательств с проверяемым SLA", "0-3"),
    ("A2", "A", "Независимый ежеквартальный опрос получателей услуг", [3], "Индекс соблюдения; ≥4 системных изменения/год", "0-3"),
    ("A3", "A", "Реинжиниринг 3 алгоритмов + транзакционный мониторинг", [4], "Медиана срока −20%", "3-6"),
    ("A4", "A", "Соглашения с РСО: SLA и передача данных", [5], "90% подключений в нормативный срок", "3-6"),
    ("A5", "A", "Цифровое согласование ОМС в срок", [6], "95% в срок; хвост −30%", "3-6"),
    ("A6", "A", "End-to-end цифровые меры в едином ЛК", [8], "+10 мер; 70% заявок через ЛК", "6-12"),
    ("A7", "A", "Приемные как канал единого реестра", [9], "70→90% решено с подтверждением", "0-3"),
    ("A8", "A", "Индекс качества сопровождения МО + наставничество", [10], "Рост медианы индекса", "6-12"),
    ("Б1", "Б", "Фиксация блокеров; case-based оценка комитета", [13, 14], "90% блокеров снято в срок; 80% без переносов", "0-3"),
    ("Б2", "Б", "Перезапуск досудебного канала (triage + 30 дней + эскалация)", [16], "≥20 споров/год; урегулирование с подтверждением", "0-6"),
    ("Б3", "Б", "Машиночитаемый реестр поручений + дашборд просрочек", [15, 17, 18], "100% поручений; обновление ≤30 дней", "0-3"),
    ("Б4", "Б", "Двухстадийная маршрутизация предложений", [19], "Квалификация ≤10 дней; решение ≤90 дней", "3-6"),
    ("В1", "В", "Форум и встречи с реестром поручений", [20, 21, 22, 26], "≥80% поручений форума исполнено", "3-6"),
    ("В2", "В", "Разбор низких оценок с контактом заявителя", [23], "Повторы ≤5%; отказы <20%", "0-3"),
    ("В3", "В", "Дашборд обращений вместо ручных отчётов", [24], "100% каналов в реестре", "3-6"),
    ("В4", "В", "Простая форма с антиспамом и SLA", [25], "Первый ответ ≤3 дней", "3-6"),
    ("Г1", "Г", "Цифровая карта сопровождения с SLA этапов", [11], "85% этапов в SLA", "3-6"),
    ("Г2", "Г", "Единый учёт консультаций, FCR", [12], "FCR ≥60%; решение ≤10 дней", "3-6"),
    ("Г3", "Г", "Банк типовых решений в CRM", [28], "80% кейсов из шаблонов", "3-6"),
    ("Г4", "Г", "Воронка содействия финансированию", [29], "Конверсия в подачу ≥60%", "3-6"),
    ("Г5", "Г", "Подбор площадок по карточке требований", [30], "Пакет ≤10 дней; выбор ≥40%", "3-6"),
    ("Г6", "Г", "Цифровой запрос мощности с SLA ответа РСО", [31], "≥200 запросов/год", "6-12"),
    ("Г7", "Г", "Учёт снятия межведомственных барьеров", [32], "80% барьеров в срок", "3-6"),
    ("Г8", "Г", "Кабинет кейсов + стандарт менеджера + Service Charter + навигатор", [33, 34, 35, 36], "95% статусов ≤1 дня; ≥90% услуг в SLA; точность ≥95%", "3-12"),
    ("Д1", "Д", "Продуктовая модернизация карты (JTBD → релизы)", [39, 40], "Аптайм ≥99,5%; сценарий ≥80%", "6-12"),
    ("Д2", "Д", "Паспорт достоверности + система качества поставщиков", [41, 42], "100% с паспортом; расхождения ≤5%", "3-6"),
    ("Д3", "Д", "Заявка из карточки → кейс CRM", [43], "Заявки/мес; конверсия в сопровождение", "6-12"),
    ("Д4", "Д", "Целевое продвижение (после Д1–Д2)", [37, 38], "Стоимость квалифицированной заявки", "12-24"),
    ("У1", "Б", "Условно: трек строительства в комитете (вместо новой комиссии)", [7], "Срок межведомственного решения −30%", "3-6"),
    ("У2", "В", "Ежеквартальный «инвестчас» Губернатора", [27], "Исполнение поручений; снятые барьеры", "0-3"),
]
for rid, b, t, fr, kpi, hz in NR:
    new_roadmap.append({"id": rid, "block": b, "blockTitle": BLOCKS[b], "title": t, "fromItems": fr, "outcomeKpi": kpi, "horizon": hz})

meta = {
    "title": "Инвестиционный климат Свердловской области",
    "subtitle": "Доказательный аудит дорожной карты Национального рейтинга на 2026–2027 годы и предложения по новой редакции",
    "status": "Аналитический проект · рабочая версия · для обсуждения",
    "dataDate": "31.07.2026",
    "period": "октябрь 2026 — сентябрь 2027 (горизонт карты)",
    "counters": {"items": 43, "documents": 61, "ruPractices": 25, "intlPractices": 32, "proposals": 37},
    "rating": {"y2024": 11, "y2025": 10, "y2026": 14, "sources": ["asi.ru/news/200202", "asi.ru/news/204737", "asi.ru/news/207300"]},
    "indicators": [
        {"code": "3.1.1", "name": "Соблюдение Инвестиционной декларации", "so": 4.58, "soGroup": "D", "target": 4.71, "targetGroup": "C", "rfAvg": None, "rows": "1–12"},
        {"code": "3.4.1", "name": "Эффективность Инвестиционного комитета", "so": 4.69, "soGroup": "C", "target": 4.83, "targetGroup": "B", "rfAvg": 4.70, "rows": "13–19"},
        {"code": "3.4.2", "name": "Каналы прямой и обратной связи", "so": 4.78, "soGroup": "C", "target": 4.86, "targetGroup": "B", "rfAvg": None, "rows": "20–27"},
        {"code": "4.1.1", "name": "Эффективность спецорганизации (АПИ)", "so": 4.65, "soGroup": "D", "target": 4.72, "targetGroup": "C", "rfAvg": None, "rows": "28–36"},
        {"code": "4.1.3", "name": "Инвестиционная карта", "so": 4.31, "soGroup": "D", "target": 4.64, "targetGroup": "C", "rfAvg": 4.57, "rows": "37–43"},
    ],
    "dataCaveats": [
        "Оценки показателей — из проекта карты; порегиональная выгрузка АСИ запрошена (U-101)",
        "Недоступность Инвесткарты зафиксирована из тестовой среды; требуется проверка из РФ-сети (U-107)",
        "Стоимости — категории (орг./ИТ), не рубли — до данных закупок",
    ],
    "verdictStats": {"keep": 12, "rewrite": 15, "merge": 4, "remove": 4, "conditional": 1, "improve": 3, "fill-new": 4},
}

def dump(name, obj):
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"  {name}: {len(obj) if isinstance(obj, list) else 'ok'}")

print("Writing to", OUT)
dump("items.json", items)
dump("problems.json", problems)
dump("journey.json", journey)
dump("summary.json", summary)
dump("newRoadmap.json", new_roadmap)
dump("meta.json", meta)

# валидация
errs = []
if len(items) != 43: errs.append("items != 43")
for it in items:
    if it["id"] not in (33, 34, 35, 36):
        for f_ in ("originalActivity", "originalKpi"):
            if not it[f_]: errs.append(f"item {it['id']}: empty {f_}")
    for f_ in ("why", "causalGap"):
        if not it["analysis"][f_]: errs.append(f"item {it['id']}: empty analysis.{f_}")
    if not it["proposed"]["kpiName"]: errs.append(f"item {it['id']}: empty proposed.kpiName")
pids = {p_["id"] for p_ in problems}
for it in items:
    for x in it["issues"]:
        if x not in pids: errs.append(f"item {it['id']}: unknown issue {x}")
print("VALIDATION:", "OK" if not errs else f"{len(errs)} issues")
for e in errs[:20]: print("  -", e)
