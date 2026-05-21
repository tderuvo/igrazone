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
    // Nav
    klondike:        "Klondike",
    rules:           "Rules",
    help:            "Help",

    // Game header
    klondikeTitle:   "Klondike Solitaire",
    newGame:         "New Game",
    restart:         "Restart",
    score:           "Score",
    timer:           "Time",

    // Sidebar
    howToPlay:       "How to Play",
    dailyLabel:      "Daily",
    dailyChallenge:  "Today's Challenge",
    dailyDesc:       "A new deal drops every day. Beat the clock and post your score.",
    startChallenge:  "Start Challenge",
    topScores:       "Top Scores",
    viewAllScores:   "View all scores →",

    // Search / GameSearch
    gameHelp:        "Game Help",
    searchPlaceholder: "Search rules, tips, or game help…",
    search:          "Search",
    clear:           "Clear",
    noHelpFound:     "No help topics found. Try a different keyword.",

    // Verified View
    return:          "Return",
  },
  ru: {
    // Nav
    klondike:        "Клондайк",
    rules:           "Правила",
    help:            "Помощь",

    // Game header
    klondikeTitle:   "Пасьянс Клондайк",
    newGame:         "Новая игра",
    restart:         "Сначала",
    score:           "Очки",
    timer:           "Время",

    // Sidebar
    howToPlay:       "Как играть",
    dailyLabel:      "Ежедневное",
    dailyChallenge:  "Задание дня",
    dailyDesc:       "Новая раздача каждый день. Обыграй часы и запиши результат.",
    startChallenge:  "Начать",
    topScores:       "Лучшие результаты",
    viewAllScores:   "Все результаты →",

    // Search / GameSearch
    gameHelp:        "Помощь",
    searchPlaceholder: "Поиск правил, советов или помощи…",
    search:          "Поиск",
    clear:           "Очистить",
    noHelpFound:     "Темы не найдены. Попробуйте другое слово.",

    // Verified View
    return:          "Вернуться",
  },
};
