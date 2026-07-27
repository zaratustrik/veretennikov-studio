/**
 * 152-ФЗ: единая точка правды о версии документов по персональным данным.
 *
 * При каждом содержательном изменении текста «Согласия на обработку
 * персональных данных» (/consent) — поднимайте версию и дату здесь.
 * Версия и серверное время фиксируются в Brief.consentVersion / consentAt
 * при отправке каждой формы.
 */

export const PD_CONSENT_VERSION = "1.0"
export const PD_CONSENT_DATE = "27.07.2026"

/** Строка, сохраняемая в БД: «1.0 от 27.07.2026». */
export const PD_CONSENT_STAMP = `${PD_CONSENT_VERSION} от ${PD_CONSENT_DATE}`
