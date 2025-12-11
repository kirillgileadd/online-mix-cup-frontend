import { createTheme } from "@mantine/core";

export const theme = createTheme({
  /** Основной цвет для компонентов */
  primaryColor: "blue",

  /** Размер шрифта по умолчанию */
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },

  /** Радиус скругления по умолчанию */
  defaultRadius: "md",

  /** Настройки шрифтов */
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

  /** Настройки заголовков */
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    sizes: {
      h1: { fontSize: "2rem", lineHeight: "1.2", fontWeight: "700" },
      h2: { fontSize: "1.75rem", lineHeight: "1.3", fontWeight: "600" },
      h3: { fontSize: "1.5rem", lineHeight: "1.4", fontWeight: "600" },
      h4: { fontSize: "1.25rem", lineHeight: "1.4", fontWeight: "600" },
      h5: { fontSize: "1.125rem", lineHeight: "1.5", fontWeight: "600" },
      h6: { fontSize: "1rem", lineHeight: "1.5", fontWeight: "600" },
    },
  },

  /** Настройки цветов для темной темы */
  colors: {
    // dark: [
    //   "#AEB4C2",
    //   "#8D93A3",
    //   "#6C7280",
    //   "#555B69",
    //   "#434956",
    //   "#353B46",
    //   "#272C35",
    //   "#1D2129",
    //   "#14171D",
    //   "#0E1014",
    // ],
    dark: [
      "#FFFFFF", // 1 — белый
      "#C7C8CC", // 2 — светлый холодный текст
      "#A1A3A8", // 3 — средне-светлый холодный
      "#575B66", // 4 — border (стал темнее + более синеватый графит)
      "#41444D", // 5 — фон-бордер, усилен холодный подтон
      "#2C2F37", // 6 — тёмный, графитово-синий
      "#1E2128", // 7 — ещё глубже и холоднее
      "#15171D", // 8 — глубокий фон
      "#0F1115", // 9 — почти чёрный, но с синевой
      "#080A0D",
    ],
  },

  /** Дополнительные настройки компонентов */
  components: {
    // Можно настроить отдельные компоненты здесь
    // Например:
    // Button: {
    //   defaultProps: {
    //     radius: "md",
    //   },
    // },
  },

  /** Другие настройки темы */
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  /** Настройки теней */
  shadows: {
    xs: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px",
    md: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
    lg: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 16px 16px -7px",
    xl: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px",
  },
});
