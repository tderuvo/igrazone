/**
 * IgraZone — UI translation strings (EN / RU).
 *
 * Usage:
 *   import { T } from "@/lib/translations";
 *   const t = T[lang];   // lang is "en" | "ru"
 *   t.newGame            // → "New Game" or "Новая игра"
 */
export const T = {
  en: {
    // ── Nav ──────────────────────────────────────────────────────────────────
    klondike:        "Klondike",
    rules:           "Rules",
    help:            "Help",

    // ── Game header ───────────────────────────────────────────────────────────
    klondikeTitle:   "Klondike Solitaire",
    newGame:         "New Game",
    restart:         "Restart",
    score:           "Score",
    timer:           "Time",

    // ── Sidebar ───────────────────────────────────────────────────────────────
    howToPlay:       "How to Play",
    dailyLabel:      "Daily",
    dailyChallenge:  "Today's Challenge",
    dailyDesc:       "A new deal drops every day. Beat the clock and post your score.",
    startChallenge:  "Start Challenge",
    topScores:       "Top Scores",
    viewAllScores:   "View all scores →",

    // ── Search / GameSearch ───────────────────────────────────────────────────
    gameHelp:          "Game Help",
    searchPlaceholder: "Search rules, tips, or game help…",
    search:            "Search",
    clear:             "Clear",
    noHelpFound:       "No help topics found. Try a different keyword.",

    // ── VerifiedView — utility bar ────────────────────────────────────────────
    return:          "Return",
    swipeHint:       "Swipe right or tap Return to go back.",
    backTo:          "Back to",
    nowYouKnow:      "Now You Know",

    // ── VerifiedView — masthead ───────────────────────────────────────────────
    nykSubtitle:     "Independent context for a fast-changing world.",

    // ── VerifiedView — sources bar ────────────────────────────────────────────
    intlSources:     "International Sources:",

    // ── VerifiedView — lead story ─────────────────────────────────────────────
    leadBriefing:    "Lead Briefing",
    readBriefing:    "Read briefing →",
    closeBriefing:   "Close briefing ↑",
    byAuthor:        "By",

    // ── VerifiedView — article list ───────────────────────────────────────────
    contextLabel:    "Context",
    intlBriefing:    "International Briefing",
    noArticles:      "No articles available.",
    readMore:        "Read more →",
    showLess:        "Show less ↑",

    // ── VerifiedView — footer note ────────────────────────────────────────────
    sessionNote:     "This view is session-based and may refresh periodically.",
  },

  ru: {
    // ── Nav ──────────────────────────────────────────────────────────────────
    klondike:        "Клондайк",
    rules:           "Правила",
    help:            "Помощь",

    // ── Game header ───────────────────────────────────────────────────────────
    klondikeTitle:   "Пасьянс Клондайк",
    newGame:         "Новая игра",
    restart:         "Сначала",
    score:           "Очки",
    timer:           "Время",

    // ── Sidebar ───────────────────────────────────────────────────────────────
    howToPlay:       "Как играть",
    dailyLabel:      "Ежедневное",
    dailyChallenge:  "Задание дня",
    dailyDesc:       "Новая раздача каждый день. Обыграй часы и запиши результат.",
    startChallenge:  "Начать",
    topScores:       "Лучшие результаты",
    viewAllScores:   "Все результаты →",

    // ── Search / GameSearch ───────────────────────────────────────────────────
    gameHelp:          "Помощь",
    searchPlaceholder: "Поиск правил, советов или помощи…",
    search:            "Поиск",
    clear:             "Очистить",
    noHelpFound:       "Темы не найдены. Попробуйте другое слово.",

    // ── VerifiedView — utility bar ────────────────────────────────────────────
    return:          "Вернуться",
    swipeHint:       "Проведите вправо или нажмите «Вернуться».",
    backTo:          "Назад к",
    nowYouKnow:      "Now You Know",

    // ── VerifiedView — masthead ───────────────────────────────────────────────
    nykSubtitle:     "Независимый контекст для быстро меняющегося мира.",

    // ── VerifiedView — sources bar ────────────────────────────────────────────
    intlSources:     "Международные источники:",

    // ── VerifiedView — lead story ─────────────────────────────────────────────
    leadBriefing:    "Основная сводка",
    readBriefing:    "Читать сводку →",
    closeBriefing:   "Закрыть сводку ↑",
    byAuthor:        "Автор:",

    // ── VerifiedView — article list ───────────────────────────────────────────
    contextLabel:    "Контекст",
    intlBriefing:    "Международная сводка",
    noArticles:      "Статьи недоступны.",
    readMore:        "Читать далее →",
    showLess:        "Свернуть ↑",

    // ── VerifiedView — footer note ────────────────────────────────────────────
    sessionNote:     "Этот раздел активен в рамках сессии и может периодически обновляться.",
  },
};
