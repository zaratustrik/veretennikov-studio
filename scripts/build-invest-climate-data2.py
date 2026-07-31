# -*- coding: utf-8 -*-
"""Часть 2: practices.json + sources.json (курируемые выжимки из final_analysis/raw_benchmark)."""
import json, sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "investment-climate"

P = []
def pr(id, scope, fg, jur, org, title, mech, res, rs, app, note, src):
    P.append({"id": id, "scope": scope, "functionGroup": fg, "jurisdiction": jur, "organization": org,
              "title": title, "mechanism": mech, "provenResult": res, "resultStatus": rs,
              "applicability": app, "applicabilityNote": note, "sourceIds": src})

# Международные
pr("intl-kr-ombudsman","intl","disputes","Южная Корея","KOTRA / Office of the Foreign Investment Ombudsman","Инвестиционный омбудсмен (с 1999)","Орган обязан ответить на рекомендацию за 30 дней; неисполненное эскалируется в правительственный комитет; постоянные отраслевые «home doctors».","Единичные ISDS-иски против Кореи при росте мировых кейсов с 600 (2013) до 1300 (2023); ~40 предотвращённых споров за 2006–2014.","confirmed","needs-legal","Переносится изменением положений Инвесткомитета и рабочей группы (региональные акты, без федеральных изменений).",["B-KR"])
pr("intl-kr-homedoc","intl","aftercare","Южная Корея","Invest KOREA","Система «home doctors»","10 отраслевых специалистов, каждый постоянно ведёт 30–50 иностранных компаний; выезды, горячая линия.","Реинвестиции действующих инвесторов 55,6–73,4% притока ПИИ (2020–2023, KOTRA).","confirmed","direct","Норматив портфеля менеджера АПИ — прямой перенос.",["B-KR"])
pr("intl-kr-seumter","intl","permits","Южная Корея","MOLIT","SEUMTER / e-AIS","Электронная разрешительная система: орган сам рассылает проект согласующим ведомствам; обработка только в системе (закон).","27,5 дня на все процедуры против 152,3 в среднем по OECD (Doing Business 2020).","confirmed","principle","Принцип «одна подача — параллельные согласования» реализуем в рамках 210-ФЗ.",["B-DB"])
pr("intl-ie-ida","intl","aftercare","Ирландия","IDA Ireland","Aftercare: портфельные менеджеры на весь жизненный цикл","Закреплённый менеджер за каждой компанией; категория «трансформационные инвестиции» действующих клиентов.","234 инвестиции за 2024, из них ~70% — расширения и трансформации действующих клиентов (годовой отчёт).","confirmed","direct","Сегмент aftercare в АПИ — организационная мера.",["B-IDA"])
pr("intl-ca-fees","intl","sla","Канада","Treasury Board / ведомства","Service Fees Act 2017 + сервисные стандарты","Возврат пошлины при нарушении сервисного стандарта — норма федерального закона; публичный шаблон «услуга—стандарт—цель—факт».","Ежегодная публичная отчётность всех ведомств; напр., 99,97% лицензий в 250-дневный стандарт (Health Canada).","confirmed","principle","Автоматический возврат госпошлины региону недоступен (НК РФ); переносим публичный формат отчётности и обязательства.",["B-CA"])
pr("intl-uk-planning","intl","sla","Великобритания","MHCLG","Planning Guarantee + режим designation","Возврат пошлины при превышении предельного срока; при системном недоборе орган лишается полномочий (заявки идут в вышестоящий орган); квартальная публичная статистика по каждому органу.","91% крупных заявок «в срок» формально, но лишь 19% — в статутный срок (за счёт согласованных продлений) — документированный урок anti-gaming.","confirmed","principle","Переносим: публичная статистика по органам + управленческие последствия; урок — считать «чистый» срок.",["B-UK"])
pr("intl-uk-datahub","intl","crm","Великобритания","Department for Business and Trade","Data Hub — CRM агентства","Единая CRM всех взаимодействий с бизнесом; open source, без лицензий на пользователя.","4 млн зафиксированных взаимодействий; 2 000+ пользователей/мес (официальный блог DBT).","confirmed","direct","Модель «одна CRM + публичная телеметрия» переносится на АПИ.",["B-UK2"])
pr("intl-lt-crm","intl","crm","Литва","Invest Lithuania","CRM полного цикла + публичная воронка","CRM охватывает путь от маркетинга до проекта; автонапоминания о health-checks; воронка в годовом отчёте.","371 лид → 389 встреч → 47 проектов (конверсия ~12,7%); затраты €2,3 тыс. на созданное рабочее место.","confirmed","direct","Публикация воронки АПИ — организационная мера.",["B-LT"])
pr("intl-rw-osc","intl","one-stop","Руанда","Rwanda Development Board","One Stop Center","23+ услуги в одном органе; Key Account Manager за каждым проектом; единая заявка (компания+налоги+соцстрах).","SLA: регистрация 6 часов; сертификат инвестора ≤24 ч; мотивированный отказ ≤2 дней (Service Charter).","confirmed","principle","Полномочия в РФ распределены — переносим единую заявку и SLA-обвязку, не оргсхему.",["B-RW"])
pr("intl-rw-charter","intl","sla","Руанда","RDB","Service Charter","Публичный каталог услуг со сроком каждой и порядком мотивированного отказа.","Опубликован (07.2025); базовые SLA соблюдаются по заявлениям RDB.","claimed","direct","Прямой шаблон для Service Charter АПИ.",["B-RW"])
pr("intl-ae-dewa","intl","utilities","ОАЭ (Дубай)","DEWA","Подключение к электросетям","2 процедуры, 7 дней, 0% стоимости (плата за ≤150 кВА отменена), ни одного визита; разрешение на раскопки — автоматически.","Балл 100 в Doing Business Getting Electricity три года подряд.","confirmed","principle","Ориентир процесса; в РФ — через SLA в соглашениях с РСО и дашборд.",["B-DB"])
pr("intl-ae-mystery","intl","sla","ОАЭ","Кабинет министров","Global Star Rating System","Независимая оценка сервисных центров раз в 2 года: mystery shopping, 233 критерия.","Публичная звёздная классификация центров.","confirmed","direct","Mystery investor для услуг АПИ/МФЦ — прямой перенос.",["B-AE"])
pr("intl-ge-utility","intl","utilities","Грузия","GNERC / Telasi","Автоматическая компенсация за просрочку подключения","В заявке указываются банковские реквизиты; сетевая компания автоматически платит штраф 50% платы при нарушении срока.","Зафиксировано в официальном профиле Doing Business 2020.","confirmed","principle","В РФ неустойка есть в ПП № 861 — переносим автоматизм: помощь АПИ во взыскании.",["B-DB"])
pr("intl-ge-permits","intl","permits","Грузия","Правительство","Риск-ориентированные разрешения","5 классов зданий (I — без разрешения, III — без экспертизы); стадии 5/15/10 дней; стоимость 0,3%.","Лучший балл B-READY 2024 по Business Location.","confirmed","principle","Логика ускоренного трека для типовых объектов на подготовленных площадках.",["B-DB"])
pr("intl-ge-ombudsman","intl","disputes","Грузия","Бизнес-омбудсмен","Мотивированный отказ за 30 дней","Орган, отклонивший рекомендацию, обязан письменно мотивировать отказ за 30 дней; штат всего 14 человек.","Позиция омбудсмена принята органами в 70% дел (OECD 2024).","confirmed","direct","Норма для положения о рабочей группе; масштаб-референс.",["B-OECD"])
pr("intl-nl-pdok","intl","geodata","Нидерланды","Kadaster / PDOK","Базовые регистры с юридическим каркасом","Госорганы обязаны использовать данные регистров (запрет повторного сбора); публичные операционные KPI платформы.","28,8 млрд обращений/год; доступность 99,99% (годовой отчёт PDOK 2024).","confirmed","principle","Принцип авторитетных источников → регламент данных Инвесткарты (ЕГРН/ГИСОГД/РСО).",["B-NL"])
pr("intl-nl-terug","intl","geodata","Нидерланды","Kadaster","Terugmeldplicht — обязанность сообщать об ошибках","Пользователь юридически обязан сообщить об ошибке в аутентичных данных; держатель обязан расследовать и исправить.","Работает на всех базовых регистрах (закон).","confirmed","direct","Кнопка «сообщить об ошибке» на Инвесткарте с SLA расследования.",["B-NL"])
pr("intl-nl-once","intl","one-stop","Нидерланды","Правительство","Принцип однократного ввода","«Eenmalig uitvragen»: данные запрашиваются у бизнеса один раз.","Закреплён законом для базовых регистров.","confirmed","principle","Принцип для единого реестра кейсов (запрет повторного запроса документов).",["B-NL"])
pr("intl-cz-sites","intl","sites","Чехия","CzechInvest","Национальная база площадок с валидацией","Обязательные критерии допуска объекта; «нет полного паспорта — нет публикации»; техаудиты; обратная связь рынка собственникам.","~5 100 локаций; запуск новой базы 02.2026 (официально).","confirmed","direct","Критерии публикации и валидация — прямой перенос на Инвесткарту.",["B-CZ"])
pr("intl-pl-paih","intl","sites","Польша","PAIH","Автонапоминания поставщикам данных","Система сама напоминает гминам об актуализации карточек площадок; стандартизированная карточка; сравнение до 6 площадок.","Работает в национальной базе (официальное описание).","confirmed","direct","Автонапоминания ОМСУ + автоснятие просроченных объектов.",["B-PL"])
pr("intl-de-gtai","intl","sites","Германия","GTAI + земли","Верификация площадки под запрос","Без публичной базы: конфиденциальный кейс-менеджмент, данные проверяются под конкретный запрос инвестора.","1 724 FDI-проекта, €23,2 млрд за 2024 (FDI Report).","confirmed","direct","Для крупных инвесторов — режим верифицированного пакета от АПИ.",["B-DE"])
pr("intl-sg-pep","intl","disputes","Сингапур","MTI / EnterpriseSG","Pro-Enterprise Panel / SME PEO","Институциональный «адвокат бизнеса»: ответ за 5 рабочих дней, эскалация регуляторных барьеров.",">1 100 изменений регуляций с 2000 г.; 65% из 300+ обращений первого года SME PEO разрешено (факт-лист MTI).","confirmed","principle","Формат обязательств по срокам ответа для каналов обратной связи.",["B-SG"])
pr("intl-id-oss","intl","one-stop","Индонезия","BKPM","OSS — единое окно с риск-моделью","Единая подача на все разрешения; низкий риск — только идентификатор NIB; геоданные (RDTR) дают автоматическое подтверждение локации за 2–3 дня.","10 млн NIB за 3 года (заявление ведомства).","claimed","principle","Риск-ориентированная логика и связка «план→разрешение» — принцип для ускоренных треков.",["B-ID"])
pr("intl-wb-sirm","intl","disputes","Всемирный банк","World Bank","SIRM — механизм удержания инвестиций","6-шаговый процесс (регистрация→фильтрация→оценка→решение→эскалация→мониторинг); KPI «удержанные инвестиции».","Пилоты: Эфиопия — удержано $231,8 млн; Руанда — $26,5 млн (EFI Note 2021).","confirmed","direct","Методика реестра кейсов-споров с KPI в рублях/рабочих местах.",["B-WB"])
pr("intl-ca-remission","intl","sla","Канада","ведомства","Публичные политики ремиссий","Каждое ведомство обязано публиковать политику возврата пошлин.","Ежегодные Fees Reports с фактом по каждому стандарту.","confirmed","principle","Формат публичной отчётности по SLA услуг.",["B-CA"])
# Российские
pr("ru-mo-css","ru","one-stop","Московская область","Центр содействия строительству","Штабное сопровождение строительства","Персональные менеджеры, дорожная карта проекта, еженедельный штаб с полномочиями по РСО и ОМСУ.","Заявлено регионом: сроки реализации проектов 36 → 18 мес.; ~2,7 тыс. проектов.","claimed","direct","Штабная модель для трека строительства в Инвесткомитете.",["B-RU-MO"])
pr("ru-msk-lk","ru","crm","Москва","investmoscow.ru","ЛК с транзакционными сервисами","30+ онлайн-сервисов: статусы с налоговым эффектом, субсидии, торги — подача и статус в кабинете.","68 тыс. личных кабинетов; 22 тыс. новых за год (заявление города).","claimed","direct","Модель транзакционного ЛК для ВИС «Инвестплатформа».",["B-RU-MSK"])
pr("ru-mo-uslugi","ru","one-stop","Московская область","uslugi.mosreg.ru","Комплексная услуга «земля без торгов»","Единая цифровая услуга по ст. 39.6 ЗК РФ на портале госуслуг региона.","Заявлено: срок 57 → 44 раб. дня; документов 11 → 8.","claimed","direct","Перенос: комплексные услуги инвестора на uslugi.egov66.ru.",["B-SM"])
pr("ru-lo-green","ru","sla","Ленинградская область","АЭРЛО","«Зелёный коридор для инвестора»","Единый стандарт взаимодействия ОИВ/ОМСУ/РСО (НПА) + SLA ответа 7 рабочих дней + муниципальные уполномоченные.","Тиражируется в 4 регионах (Смартека); портфель — заявление региона.","confirmed","direct","Готовый каркас SLA-стандарта взаимодействия для СО.",["B-SM"])
pr("ru-rb-sheriffs","ru","disputes","Башкортостан","Правительство РБ","«Бизнес-шерифы» + предпринимательские часы","Инвеступолномоченный в каждом МО, еженедельный фиксированный слот разбора проблем, эскалация на «Инвестчас» Главы; интегральный рейтинг МО с наставничеством.","Заявлено: >4 тыс. проектов рассмотрено бизнес-шерифами в 2025; 3-е место Нацрейтинга три года подряд (независимо).","claimed","direct","Триада «уполномоченный → слот → эскалация» для муниципального звена СО.",["B-RU-RB"])
pr("ru-rt-map","ru","geodata","Татарстан","АИР РТ","Инвесткарта с данными сетей и заявкой","Слои газо/электро/водо/теплоснабжения, авторизация ЕСИА, онлайн-заявка на локализацию, сравнение площадок.","Лидер оценки качества карт по исследованию АСИ-2025 (официально).","confirmed","direct","Функциональный ориентир модернизации карты СО.",["B-RT", "SRC-03"])
pr("ru-fed-map","ru","geodata","Россия","Минэкономразвития РФ","Федеральная инвесткарта (invest.gov.ru)","Единая карта: 14,8 тыс. площадок; KPI — сделки, не объекты.","496 реализованных площадок за 2025, 51 продана на 2,2 млрд руб. (официально).","confirmed","direct","Альтернативный фронт при отсутствии бюджета на свою карту; KPI «сделки с карты».",["B-FED"])

S = []
def src(id, title, org, date, cat, url=None, note=None, verified=True, accessed="31.07.2026"):
    S.append({"id": id, "title": title, "organization": org, "date": date, "accessed": accessed,
              "category": cat, "url": url, "note": note, "verified": verified})

src("DOCX","Проект дорожной карты НР/РИС Свердловской области 2026–2027 (source_roadmap.docx)","Проект регионального документа (статус «ПРОЕКТ»)","2026","regional",None,"Первоисточник всех 43 строк; сверен по SHA-256")
src("SRC-03","Исследование по итогам формирования Национального рейтинга 2025","АСИ","2025","rating","https://files-k2.asi.ru/iblock/f56/f56d03a5ee9670a11036e5878fc1909e/Issledovanie_po_itogam_formirovaniya_Natsionalnogo_reytinga_2025-_2_.pdf","Средние по РФ: комитет 4,70; карта 4,57; лидеры карт; требование конверсии")
src("SRC-10","Инвестиционная декларация СО (69-РГ от 08.04.2022 в ред. 66-РГ от 07.04.2025)","Губернатор Свердловской области","2025","legal","https://invest-in-ural.ru/invest-standart/","92 страницы; обязательства не реестрованы")
src("SRC-11","Постановление 670-ПП «О механизме обратной связи»","Правительство СО","24.09.2024","legal","https://invest-in-ural.ru/invest-standart/","Правовая база единого реестра обращений")
src("REG-04","Мониторинг результатов рассмотрения обращений на Инвесткомитете (на 01.07.2026)","Мининвестразвития СО","01.07.2026","regional","https://invest-in-ural.ru/invest-standart/","16 заседаний, 214 поручений: 177 исполнено, 37 в работе, 0 не исполнено")
src("REG-05","Информация о работе группы по досудебному урегулированию, 2022","Инвесткомитет СО","2022","regional","https://invest-in-ural.ru/invest-standart/")
src("REG-06","Информация о работе группы по досудебному урегулированию, 2023","Инвесткомитет СО","2023","regional","https://invest-in-ural.ru/invest-standart/")
src("REG-07","Информация о работе группы по досудебному урегулированию, 2024","Инвесткомитет СО","2024","regional","https://invest-in-ural.ru/invest-standart/")
src("REG-08","Информация о работе группы по досудебному урегулированию, 2025","Инвесткомитет СО","2025","regional","https://invest-in-ural.ru/invest-standart/","2 заседания, 2 вопроса за год")
src("REG-09","Информация о поступивших и рассмотренных обращениях инвесторов за 2025 год","АПИ СО","2025","regional","https://invest-in-ural.ru/investors/","656 консультаций; источники обращений")
src("REG-11","Алгоритм взаимодействия АПИ с РСО по техприсоединению","АПИ СО","2024","regional","https://invest-in-ural.ru/invest-standart/")
src("REG-12","Алгоритм получения земельного участка без торгов (08.08.2023 № 01-01-40,53)","Свердловская область","2023","regional","https://invest-in-ural.ru/invest-standart/")
src("REG-13","Алгоритм подключения к электросетям до 150 кВт (12.12.2023 № 01-01-40-101)","Свердловская область","2023","regional","https://invest-in-ural.ru/invest-standart/")
src("AUDIT-TP","Аудит портала техприсоединения seti.midural.ru (снимок счётчиков)","Аудит проекта","31.07.2026","service","https://seti.midural.ru/","976 заявок; 180 ТУ; 10 ИОВП; 20 626 согласований ОМС; 105 ОМС")
src("AUDIT-LK","Аудит ВИС «Инвестплатформа» lk.invest-in-ural.ru","Аудит проекта","31.07.2026","service","https://lk.invest-in-ural.ru/invest/catalog/services","~25 услуг; вход ЕСИА; два разных ЛК")
src("AUDIT-PORTAL","Аудит Инвестпортала invest-in-ural.ru","Аудит проекта","31.07.2026","service","https://invest-in-ural.ru/","Схема сопровождения с SLA 1/3/10 дней; CRM")
src("AUDIT-MAP","Аудит Инвесткарты map.invest-in-ural.ru","Аудит проекта","31.07.2026","service","https://map.invest-in-ural.ru/","Недоступна из тестовой среды (3 попытки); требует проверки из РФ-сети", False)
src("FC","Отчёт о фактчекинге (дефекты первоисточника D-01…D-07)","Аудит проекта","31.07.2026","research",None,"Оборванный KPI, дата 31.04.2027, противоречие 52/12, «Д.В.», пустые 33–36, дубль в 43")
src("GUB","Официальный сайт Губернатора Свердловской области","Правительство СО","2026","regional","https://gubernator96.ru/","Д.В. Паслер — врио с 26.03.2025, избран 16.09.2025")
src("ASI-24","Итоги Национального рейтинга 2024","АСИ","07.06.2024","rating","https://asi.ru/news/200202/","СО — 11-е место")
src("ASI-25","Итоги Национального рейтинга 2025","АСИ","20.06.2025","rating","https://asi.ru/news/204737/","СО — 10-е место")
src("ASI-26","Итоги Национального рейтинга 2026","АСИ","05.06.2026","rating","https://asi.ru/news/207300/","СО — 14-е место")
src("STAT-INV","Инвестиции в основной капитал СО, январь–декабрь 2025","Свердловскстат","30.03.2026","stats","https://66.rosstat.gov.ru/folder/30402","919,4 млрд руб.; ИФО 92,8%")
src("STAT-VRP","ВРП Свердловской области за 2023 год","Свердловскстат","2025","stats","https://66.rosstat.gov.ru/folder/139006","4 128,1 млрд; ИФО 108,6%")
src("B-KR","Правовая база и отчёты омбудсмена Кореи (FIPA ст. 15-2; обзор Washington CORE 2025)","KOTRA / MOTIE","2025","intl-practice","https://ombudsman.kotra.or.kr/ob-en/")
src("B-DB","Архив Doing Business 2020: профили экономик (SGP, ARE, KOR, GEO, RWA, DEU)","Всемирный банк","2020","intl-practice","https://archive.doingbusiness.org/")
src("B-IDA","IDA Ireland Annual Report 2024","IDA Ireland","2025","intl-practice","https://www.idaireland.com/annual-reports/annual-report-2024")
src("B-CA","Service Fees Act, S.C. 2017; Cabinet Directive on Regulation","Правительство Канады","2017–2018","intl-practice","https://laws-lois.justice.gc.ca/eng/acts/s-8.4/")
src("B-UK","Planning performance statistics; Growth and Infrastructure Act 2013","MHCLG (UK)","2026","intl-practice","https://www.gov.uk/government/collections/planning-applications-statistics")
src("B-UK2","Data Hub: официальный блог DBT","Department for Business and Trade","30.07.2024","intl-practice","https://digitaltrade.blog.gov.uk/2024/07/30/surpassing-4-million-interactions-how-we-made-collecting-data-a-doddle/")
src("B-LT","Invest Lithuania, Veiklos ataskaita 2024","Invest Lithuania","2025","intl-practice","https://investlithuania.com/wp-content/uploads/IL-veiklos-ataskaita-2024.pdf")
src("B-RW","Rwanda Development Board: One Stop Center, Service Charter","RDB","2025","intl-practice","https://rdb.rw/one-stop-centre/")
src("B-AE","Global Star Rating System for Services","Правительство ОАЭ","2011–2026","intl-practice","https://u.ae/en/about-the-uae/the-uae-government/global-star-rating-system-for-services")
src("B-NL","PDOK Jaarverslag 2024; stelsel van basisregistraties","Kadaster / digitaleoverheid.nl","2024–2025","intl-practice","https://www.pdok.nl/jaarverslag-2024")
src("B-CZ","CzechInvest: новая база недвижимости (запуск 02.2026)","CzechInvest","2026","intl-practice","https://czechinvest.gov.cz/en/For-Investors/Real-estate-offer/Database-of-business-properties")
src("B-PL","PAIH: Generator ofert inwestycyjnych","PAIH","2025","intl-practice","https://baza.paih.gov.pl/")
src("B-DE","GTAI FDI Report 2025; investor consulting","GTAI","2025","intl-practice","https://www.gtai.de/en/invest/business-location-germany/foreign-direct-investment/2025-fdi-report-1999616")
src("B-SG","Pro-Enterprise Panel / SME PEO (факт-лист MTI COS 2025)","MTI Singapore","2025","intl-practice","https://www.mti.gov.sg/ProEnterprisePanel")
src("B-ID","OSS-RBA: пресс-релизы BKPM (10 млн NIB)","BKPM Indonesia","2024","intl-practice","https://oss.go.id/","Заявление ведомства", False)
src("B-WB","Managing Investor Issues Through Retention Mechanisms (SIRM), EFI Note","Всемирный банк","2021","intl-practice","https://documents1.worldbank.org/curated/en/978811614610086665/pdf/Managing-Investor-Grievances-Through-Retention-Mechanisms.pdf")
src("B-OECD","Business Ombudsman Institutions in Eastern Europe and Central Asia","OECD","2024","intl-practice","https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/04/business-ombudsman-institutions-in-eastern-europe-and-central-asia_c254380c/7d994c17-en.pdf")
src("B-RU-MO","Центр содействия строительству Московской области","Правительство МО","2025","ru-practice","https://css.mosreg.ru/","Заявление региона: 36→18 мес.", False)
src("B-RU-MSK","Онлайн-сервисы инвестпортала Москвы","ДИПП Москвы","2025","ru-practice","https://investmoscow.ru/account/about/","Заявление города: 68 тыс. ЛК", False)
src("B-RU-RB","Практики Башкортостана: бизнес-шерифы, предпринимательские часы","Правительство РБ","2025–2026","ru-practice","https://economy.bashkortostan.ru/","Заявления региона; позиция в рейтинге — независимо", False)
src("B-SM","Смартека АСИ: «Зелёный коридор» (ЛО), «Земля без торгов» (МО), «Единая система господдержки» (Камчатка)","АСИ","2021–2025","ru-practice","https://smarteka.com/")
src("B-RT","Инвестиционная карта Татарстана","АИР РТ","2025","ru-practice","https://invest.tatarstan.ru/ru/map/")
src("B-FED","Инвестиционная карта РФ: итоги 2025","Минэкономразвития РФ","2026","federal","https://invest.gov.ru/","496 реализованных площадок")

(OUT / "practices.json").write_text(json.dumps(P, ensure_ascii=False, indent=1), encoding="utf-8")
(OUT / "sources.json").write_text(json.dumps(S, ensure_ascii=False, indent=1), encoding="utf-8")
print("practices:", len(P), "| sources:", len(S))

# кросс-валидация с items.json
items = json.loads((OUT / "items.json").read_text(encoding="utf-8"))
pid = {p["id"] for p in P}; sid = {s["id"] for s in S}
errs = []
for it in items:
    for b in it["benchmarkIds"]:
        if b not in pid: errs.append(f"item {it['id']}: unknown benchmark {b}")
    for s_ in it["sourceIds"]:
        if s_ not in sid: errs.append(f"item {it['id']}: unknown source {s_}")
for p in P:
    for s_ in p["sourceIds"]:
        if s_ not in sid: errs.append(f"practice {p['id']}: unknown source {s_}")
print("CROSS-VALIDATION:", "OK" if not errs else errs[:15])
